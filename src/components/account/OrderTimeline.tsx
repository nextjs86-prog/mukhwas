import { Check, Package, PackageCheck, Home, ClipboardCheck, Truck, Bike } from "lucide-react";
import type { Order } from "@/types";
import { statusFlow, statusLabel } from "@/data/content";
import { cn, fmtDate, inr } from "@/lib/utils";

const icons = [ClipboardCheck, Check, Package, Truck, Bike, Home];

export function OrderTimeline({ order }: { order: Order }) {
  const idx = statusFlow.indexOf(order.status as (typeof statusFlow)[number]);
  const ev = (s: string) => order.tracking?.events.find((e) => e.status === s);
  return (
    <div>
      {/* horizontal on desktop */}
      <ol className="hidden grid-cols-6 md:grid">
        {statusFlow.map((s, i) => {
          const Icon = icons[i]; const done = i <= idx;
          return (
            <li key={s} className="relative flex flex-col items-center text-center">
              {i > 0 && <span className={cn("absolute right-1/2 top-6 h-0.5 w-full", i <= idx ? "bg-forest" : "bg-forest/10")} />}
              <span className={cn("relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 transition", done ? "border-forest bg-forest text-ivory" : "border-forest/15 bg-ivory text-ink/30", i === idx && "ring-4 ring-gold/30")}><Icon className="h-5 w-5" strokeWidth={1.6} /></span>
              <span className={cn("mt-3 text-[12px] font-medium", done ? "text-forest" : "text-ink/40")}>{statusLabel[s]}</span>
              <span className="mt-0.5 text-[11px] text-ink/45">{ev(s)?.date ?? "—"}</span>
            </li>
          );
        })}
      </ol>
      {/* vertical on mobile */}
      <ol className="space-y-0 md:hidden">
        {statusFlow.map((s, i) => {
          const Icon = icons[i]; const done = i <= idx;
          return (
            <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
              {i < statusFlow.length - 1 && <span className={cn("absolute left-5 top-10 h-[calc(100%-2.5rem)] w-0.5", i < idx ? "bg-forest" : "bg-forest/10")} />}
              <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border-2", done ? "border-forest bg-forest text-ivory" : "border-forest/15 text-ink/30")}><Icon className="h-4 w-4" /></span>
              <div><p className={cn("text-sm font-medium", done ? "text-forest" : "text-ink/40")}>{statusLabel[s]}</p><p className="text-xs text-ink/50">{ev(s)?.note ?? "Pending"} {ev(s) && `· ${ev(s)!.date}`}</p></div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function OrderSummaryCard({ order }: { order: Order }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-cream p-5 text-sm md:col-span-2">
        <p className="mb-3 text-[11px] uppercase tracking-widest text-brown">Items</p>
        <ul className="divide-y divide-forest/10">
          {order.lines.map((l) => <li key={l.variantId} className="flex justify-between py-2.5"><span>{l.name} <span className="text-ink/50">· {l.variant} × {l.qty}</span></span><span>{inr(l.price * l.qty)}</span></li>)}
        </ul>
        <dl className="mt-3 space-y-1.5 border-t border-forest/10 pt-3">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald"><dt>Discount</dt><dd>−{inr(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt>Shipping & fees</dt><dd>{order.shipping ? inr(order.shipping) : "Free"}</dd></div>
          <div className="flex justify-between font-medium text-forest"><dt>Total</dt><dd>{inr(order.total)}</dd></div>
        </dl>
      </div>
      <div className="space-y-4 text-sm">
        <div className="rounded-2xl bg-cream p-5"><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Ship to</p><p className="text-forest">{order.address.name}</p><p className="text-ink/60">{order.address.line1}, {order.address.city}, {order.address.state} {order.address.pin}</p><p className="text-ink/60">{order.address.phone}</p></div>
        <div className="rounded-2xl bg-cream p-5"><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Payment</p><p className="text-forest">{order.payment.method === "cod" ? "Cash on Delivery" : order.payment.method === "upi" ? "UPI (screenshot)" : "Razorpay"}</p><p className="capitalize text-ink/60">{order.payment.status}</p><p className="mt-2 text-xs text-ink/50">Placed {fmtDate(order.date)}</p></div>
      </div>
    </div>
  );
}
