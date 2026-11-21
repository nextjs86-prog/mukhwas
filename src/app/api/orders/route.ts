import { NextResponse } from "next/server";
import { priceCart, razorpayConfigured } from "@/lib/server/pricing";
import { validators } from "@/lib/utils";

/**
 * POST /api/orders — validates the customer + cart, re-prices server-side and creates an order.
 * COD: order is created with payment "pending".
 * Razorpay: creates a Razorpay order (only if keys are configured). Payment is NOT marked paid here;
 * that happens in /api/payments/verify (signature check) and /api/payments/webhook.
 * TODO(backend): persist to Supabase `orders` + `order_items` tables, decrement stock in a transaction.
 */
export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const c = body?.customer ?? {};
  const errors: Record<string, string> = {};
  const chk = (k: string, msg: string) => { if (msg) errors[k] = msg; };
  chk("name", validators.required(String(c.name ?? ""), "Full name"));
  chk("email", validators.email(String(c.email ?? "")));
  chk("phone", validators.phone(String(c.phone ?? "")));
  chk("line1", validators.required(String(c.line1 ?? ""), "Address"));
  chk("city", validators.required(String(c.city ?? ""), "City"));
  chk("state", validators.required(String(c.state ?? ""), "State"));
  chk("pin", validators.pin(String(c.pin ?? "")));
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });

  const method = body.method === "razorpay" ? "razorpay" : body.method === "upi" ? "upi" : "cod";
  // UPI: customer pays via QR and uploads a screenshot. TODO(backend): upload to Supabase Storage and verify manually in admin.
  if (method === "upi" && !body.paymentProof) return NextResponse.json({ error: "Please upload your payment screenshot.", errors: { proof: "Payment screenshot is required." } }, { status: 422 });
  let priced;
  try { priced = priceCart(body.items, body.coupon ?? null, method); }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 422 }); }

  const number = `MK-${Math.floor(10000 + Math.random() * 89999)}`;

  if (method === "razorpay") {
    if (!razorpayConfigured()) {
      return NextResponse.json({ error: "Online payment is not configured yet. Please choose Cash on Delivery." }, { status: 503 });
    }
    const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: priced.total * 100, currency: "INR", receipt: number }),
    });
    if (!r.ok) return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
    const rz = await r.json();
    return NextResponse.json({ number, ...priced, payment: { method, status: "pending" }, razorpay: { orderId: rz.id, keyId: process.env.RAZORPAY_KEY_ID, amount: rz.amount } });
  }

  return NextResponse.json({ number, ...priced, payment: { method, status: "pending" } });
}
