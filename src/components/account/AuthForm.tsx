"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { useShop } from "@/lib/store";
import { validators } from "@/lib/utils";
import { Button, Field } from "@/components/ui/primitives";

type Mode = "login" | "register" | "forgot";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/account";
  const login = useShop((s) => s.login);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (ev: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: ev.target.value }); setE({ ...e, [k]: "" }); };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    const add = (k: string, m: string) => m && (er[k] = m);
    add("email", validators.email(f.email));
    if (mode !== "forgot") add("password", mode === "login" ? validators.required(f.password, "Password") : validators.password(f.password));
    if (mode === "register") {
      add("name", validators.required(f.name, "Full name"));
      if (f.phone) add("phone", validators.phone(f.phone));
      if (f.confirm !== f.password) er.confirm = "Passwords don't match.";
    }
    setE(er);
    if (Object.keys(er).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // TODO(backend): Supabase Auth signInWithPassword / signUp / resetPasswordForEmail
    setLoading(false);
    if (mode === "forgot") return setSent(true);
    login({ name: mode === "register" ? f.name : f.email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()), email: f.email, phone: f.phone });
    router.push(next);
  };

  const copy = {
    login: ["Welcome back", "Sign in to view orders, saved addresses and your wishlist."],
    register: ["Create an account", "Faster checkout, order tracking and early access to new blends."],
    forgot: ["Reset your password", "Enter your email and we'll send a reset link."],
  }[mode];

  return (
    <div className="container grid min-h-[70vh] place-items-center py-14">
      <div className="w-full max-w-md rounded-[28px] bg-ivory p-8 shadow-lift md:p-10">
        <h1 className="font-serif text-4xl text-forest">{copy[0]}</h1>
        <p className="mt-2 text-sm text-ink/60">{copy[1]}</p>
        {sent ? (
          <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald"><Check className="mb-2 h-5 w-5" />If an account exists for <b>{f.email}</b>, a reset link will be sent. (Demo: no email is sent.)</div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 space-y-4">
            {mode === "register" && <Field label="Full name" name="name" required autoComplete="name" value={f.name} onChange={set("name")} error={e.name} />}
            <Field label="Email" name="email" type="email" required autoComplete="email" value={f.email} onChange={set("email")} error={e.email} />
            {mode === "register" && <Field label="Mobile (optional)" name="phone" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} error={e.phone} />}
            {mode !== "forgot" && <Field label="Password" name="password" type="password" required autoComplete={mode === "login" ? "current-password" : "new-password"} value={f.password} onChange={set("password")} error={e.password} hint={mode === "register" ? "At least 8 characters" : undefined} />}
            {mode === "register" && <Field label="Confirm password" name="confirm" type="password" required autoComplete="new-password" value={f.confirm} onChange={set("confirm")} error={e.confirm} />}
            {mode === "login" && <div className="text-right"><Link href="/account/forgot-password" className="text-xs text-forest underline underline-offset-4">Forgot password?</Link></div>}
            <Button className="w-full" loading={loading}>{mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-ink/60">
          {mode === "login" ? <>New here? <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="text-forest underline underline-offset-4">Create an account</Link></> : <>Already have an account? <Link href="/account/login" className="text-forest underline underline-offset-4">Sign in</Link></>}
        </p>
        <p className="mt-4 rounded-xl bg-cream p-3 text-center text-[11px] text-ink/55">Demo mode: any email/password signs you in locally. Connect Supabase Auth before launch.</p>
      </div>
    </div>
  );
}
