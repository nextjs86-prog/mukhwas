import { NextResponse } from "next/server";
import { validators } from "@/lib/utils";

/**
 * POST /api/enquiries — contact / bulk / gifting enquiries.
 * Validates input server-side. TODO(backend): insert into Supabase `enquiries` and notify via email.
 * Currently does not store or send anything.
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const errors: Record<string, string> = {};
  const n = validators.required(String(b.name ?? ""), "Name"); if (n) errors.name = n;
  const e = validators.email(String(b.email ?? "")); if (e) errors.email = e;
  if (b.phone) { const p = validators.phone(String(b.phone)); if (p) errors.phone = p; }
  if (String(b.message ?? "").trim().length < 10) errors.message = "Please write at least 10 characters.";
  if (String(b.message ?? "").length > 4000) errors.message = "Message is too long.";
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });
  return NextResponse.json({ ok: true, reference: `ENQ-${Date.now().toString(36).toUpperCase()}` });
}
