"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useCart";
import { demoOrders, statusLabel } from "@/data/content";
import type { Order } from "@/types";
import { Button, DemoTag, Field, PageHero } from "@/components/ui/primitives";
import { OrderSummaryCard, OrderTimeline } from "@/components/account/OrderTimeline";
import { fmtDate } from "@/lib/utils";

function Tracker() {
  const sp = useSearchParams();
  const hydrated = useHydrated();
  const myOrders = useShop((s) => s.orders);
  const [num, setNum] = useState(sp.get("n") ?? "");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState("");

  const find = (n: string) => [...myOrders, ...demoOrders].find((o) => o.number.toLowerCase() === n.trim().toLowerCase());
  useEffect(() => { if (hydrated && sp.get("n")) { const o = find(sp.get("n")!); if (o) setOrder(o); } }, [hydrated]); // eslint-disable-line

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!num.trim()) return setErr("Enter your order number.");
    const o = find(num);
    if (!o) { setOrder(null); return setErr("We couldn't find that order. Check the number and try again."); }
    if (email && o.email.toLowerCase() !== email.trim().toLowerCase()) { setOrder(null); return setErr("The email doesn't match this order."); }
    setErr(""); setOrder(o);
  };

  return (
    <div className="container py-12 md:py-16">
      <form onSubmit={submit} noValidate className="mx-auto grid max-w-2xl gap-4 rounded-[28px] bg-ivory p-6 shadow-soft sm:grid-cols-[1fr_1fr_auto] sm:items-end md:p-8">
        <Field label="Order number" name="num" placeholder="e.g. MK-10428" value={num} onChange={(e) => { setNum(e.target.value); setErr(""); }} />
        <Field label="Email (optional)" name="temail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button>Track</Button>
        {err && <p role="alert" className="text-sm text-red-600 sm:col-span-3">{err}</p>}
        <p className="text-xs text-ink/50 sm:col-span-3">Try demo orders <button type="button" onClick={() => setNum("MK-10428")} className="underline">MK-10428</button>, <button type="button" onClick={() => setNum("MK-10311")} className="underline">MK-10311</button> or <button type="button" onClick={() => setNum("MK-10502")} className="underline">MK-10502</button>.</p>
      </form>

      {order && (
        <section className="mx-auto mt-12 max-w-5xl space-y-8" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-[11px] uppercase tracking-widest text-brown">Order {order.number}</p><h2 className="mt-1 font-serif text-3xl text-forest">{statusLabel[order.status]}</h2><p className="text-sm text-ink/55">Placed on {fmtDate(order.date)}</p></div>
            <div className="text-right text-sm"><p className="text-ink/55">Courier: <span className="text-forest">{order.tracking?.courier}</span></p><p className="text-ink/55">AWB: <span className="text-forest">{order.tracking?.awb}</span></p><DemoTag className="mt-1 inline-block">Demo tracking</DemoTag></div>
          </div>
          <div className="rounded-[28px] bg-ivory p-6 shadow-soft md:p-10"><OrderTimeline order={order} /></div>
          <div className="rounded-[28px] bg-ivory p-6 shadow-soft md:p-8">
            <p className="mb-4 text-[11px] uppercase tracking-widest text-brown">Tracking history</p>
            <ul className="space-y-3 text-sm">{[...(order.tracking?.events ?? [])].reverse().map((e) => <li key={e.date} className="flex gap-4"><span className="w-36 shrink-0 text-ink/50">{e.date}</span><span className="text-forest">{e.note}</span></li>)}</ul>
          </div>
          <OrderSummaryCard order={order} />
        </section>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <>
      <PageHero eyebrow="Order tracking" title="Where's my order?" intro="Enter your order number to see live status. Tracking shown here is simulated until courier integration is configured." />
      <Suspense><Tracker /></Suspense>
    </>
  );
}
