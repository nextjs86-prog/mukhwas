import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * POST /api/payments/webhook — Razorpay webhook receiver.
 * Verifies X-Razorpay-Signature against the raw body with RAZORPAY_WEBHOOK_SECRET.
 * TODO(backend): handle payment.captured / payment.failed / refund.processed idempotently in Supabase.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
  const event = JSON.parse(raw);
  switch (event.event) {
    case "payment.captured":
    case "payment.failed":
    case "refund.processed":
      // Persist status change here.
      break;
  }
  return NextResponse.json({ received: true });
}
