"use client";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useShop } from "@/lib/store";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderSummaryCard, OrderTimeline } from "@/components/account/OrderTimeline";
import { Button, EmptyState } from "@/components/ui/primitives";
import { useReorder } from "@/hooks/useReorder";

function Detail({ number }: { number: string }) {
  const order = useShop((s) => s.orders.find((o) => o.number === number));
  const reorder = useReorder();
  if (!order) return <EmptyState icon={<ArrowLeft className="h-6 w-6" />} title="Order not found" body="This order isn't in your account." action={<Link href="/account/orders" className="underline">Back to orders</Link>} />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/account/orders" className="flex items-center gap-2 text-sm text-forest"><ArrowLeft className="h-4 w-4" />All orders</Link>
        <Button variant="outline" onClick={() => reorder(order)}><RotateCcw className="h-4 w-4" />Reorder</Button>
      </div>
      <div className="rounded-[24px] bg-ivory p-6 shadow-soft md:p-8"><OrderTimeline order={order} /></div>
      <OrderSummaryCard order={order} />
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  return <AccountShell title={`Order ${decodeURIComponent(number)}`}><Detail number={decodeURIComponent(number)} /></AccountShell>;
}
