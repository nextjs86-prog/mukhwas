import { NextResponse } from "next/server";
import { validators } from "@/lib/utils";

/** POST /api/newsletter — validates email. TODO(backend): upsert into Supabase `subscribers` / email provider. */
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({ email: "" }));
  const err = validators.email(String(email ?? ""));
  if (err) return NextResponse.json({ error: err }, { status: 422 });
  return NextResponse.json({ ok: true });
}
