"use client";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { validators, cn } from "@/lib/utils";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validators.email(email);
    setErr(v);
    if (v) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error((await res.json()).error || "Something went wrong");
      setState("done");
    } catch (e) {
      setErr((e as Error).message);
      setState("idle");
    }
  };

  if (state === "done")
    return <p className={cn("flex items-center gap-2 text-sm", dark ? "text-gold" : "text-emerald")}><Check className="h-4 w-4" />Thank you — you&apos;re on the list.</p>;

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={cn("flex h-12 items-center rounded-full border pl-5 pr-1.5", dark ? "border-ivory/20 bg-ivory/5" : "border-forest/20 bg-ivory", err && "border-red-400")}>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="Your email address" aria-label="Email address" aria-invalid={!!err}
          className={cn("min-w-0 flex-1 bg-transparent text-sm outline-none", dark ? "text-ivory placeholder:text-ivory/40" : "text-ink placeholder:text-ink/40")} />
        <button disabled={state === "loading"} aria-label="Subscribe" className={cn("grid h-9 w-9 place-items-center rounded-full transition", dark ? "bg-gold text-forest hover:bg-gold-light" : "bg-forest text-ivory hover:bg-emerald")}>
          <ArrowRight className={cn("h-4 w-4", state === "loading" && "animate-pulse")} />
        </button>
      </div>
      {err && <p role="alert" className="mt-2 text-xs text-red-400">{err}</p>}
    </form>
  );
}
