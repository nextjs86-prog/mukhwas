"use client";
import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useShop } from "@/lib/store";
import { evaluateCoupon } from "@/lib/utils";
import { coupons } from "@/data/content";

export function CouponBox({ subtotal }: { subtotal: number }) {
  const code = useShop((s) => s.coupon);
  const setCoupon = useShop((s) => s.setCoupon);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const live = code ? evaluateCoupon(code, subtotal) : null;

  const apply = (c: string) => {
    const r = evaluateCoupon(c, subtotal);
    if (r.error) { setErr(r.error); return; }
    setErr(""); setCoupon(r.coupon!.code); setInput("");
  };

  return (
    <div>
      {code && live && !live.error ? (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald">
          <span className="flex items-center gap-2"><Tag className="h-4 w-4" /><b>{code}</b> applied</span>
          <button onClick={() => setCoupon(null)} aria-label="Remove coupon"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <>
          {code && live?.error && <p className="mb-2 text-xs text-brown">{code}: {live.error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) apply(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => { setInput(e.target.value.toUpperCase()); setErr(""); }} placeholder="Coupon code" aria-label="Coupon code" className="h-11 min-w-0 flex-1 rounded-full border border-forest/15 bg-ivory px-4 text-sm uppercase outline-none focus:border-forest" />
            <button className="h-11 rounded-full border border-forest px-5 text-[12px] uppercase tracking-widest text-forest hover:bg-forest hover:text-ivory">Apply</button>
          </form>
          {err && <p role="alert" className="mt-2 text-xs text-red-600">{err}</p>}
          <p className="mt-2 text-[11px] text-ink/50">Demo codes: {coupons.map((c) => c.code).join(", ")}</p>
        </>
      )}
    </div>
  );
}
