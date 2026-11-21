import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * POST /api/payments/verify — verifies Razorpay checkout signature server-side.
 * The client handler response alone is never trusted. Webhook remains the source of truth.
 * TODO(backend): mark the order paid in Supabase only after this succeeds AND amount matches.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "Payments not configured." }, { status: 503 });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json().catch(() => ({}));
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  const expected = crypto.createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  const ok = expected.length === razorpay_signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  if (!ok) return NextResponse.json({ verified: false }, { status: 400 });
  return NextResponse.json({ verified: true });
}
