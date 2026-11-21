"use client";
import Link from "next/link";
import { Package, RotateCcw } from "lucide-react";
import { useShop } from "@/lib/store";
import { AccountShell } from "@/components/account/AccountShell";
import { ButtonLink, EmptyState } from "@/components/ui/primitives";
import { statusLabel } from "@/data/content";
import { cn, fmtDate, inr, statusTone } from "@/lib/utils";
import { useReorder } from "@/hooks/useReorder";

function Orders() {
  const orders = useShop((s) => s.orders);
  const reorder = useReorder();
  if (!orders.length) return <EmptyState icon={<Package className="h-6 w-6" />} title="No orders yet" body="When you place an order, it'll appear here." action={<ButtonLink href="/shop">Start shopping</ButtonLink>} />;
  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.number} className="rounded-[24px] bg-ivory p-5 shadow-soft md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-serif text-xl text-forest">{o.number}</p><p className="text-xs text-ink/55">{fmtDate(o.date)} · {o.lines.reduce((a, l) => a + l.qty, 0)} items · {inr(o.total)}</p></div>
            <span className={cn("rounded-full px-3 py-1 text-xs", statusTone(o.status))}>{statusLabel[o.status]}</span>
          </div>
          <p className="mt-3 truncate text-sm text-ink/65">{o.lines.map((l) => `${l.name} (${l.variant})`).join(", ")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/account/orders/${o.number}`} className="rounded-full border border-forest/20 px-4 py-2 text-xs text-forest hover:border-forest">View details</Link>
            <Link href={`/orders/track?n=${o.number}`} className="rounded-full border border-forest/20 px-4 py-2 text-xs text-forest hover:border-forest">Track</Link>
            <button onClick={() => reorder(o)} className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs text-ivory hover:bg-emerald"><RotateCcw className="h-3.5 w-3.5" />Reorder</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Page() { return <AccountShell title="Order history"><Orders /></AccountShell>; }
