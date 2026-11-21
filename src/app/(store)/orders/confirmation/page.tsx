"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { brand } from "@/config/brand";
import { inr } from "@/lib/utils";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useCart";
import { ButtonLink } from "@/components/ui/primitives";
import { OrderSummaryCard } from "@/components/account/OrderTimeline";

function Confirmation() {
  const n = useSearchParams().get("n");
  const hydrated = useHydrated();
  const order = useShop((s) => s.orders.find((o) => o.number === n));
  if (!hydrated) return <p className="py-24 text-center text-sm text-ink/50">Loading…</p>;
  if (!order) return <div className="py-24 text-center"><p className="font-serif text-3xl text-forest">Order not found</p><Link href="/orders/track" className="mt-4 inline-block text-sm underline">Track an order</Link></div>;
  return (
    <div className="mx-auto max-w-3xl py-14 md:py-20">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 14 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50"><CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={1.5} /></motion.div>
      <h1 className="mt-6 text-center font-serif text-4xl text-forest md:text-5xl">Thank you, {order.address.name.split(" ")[0]}.</h1>
      <p className="mt-3 text-center text-ink/65">Your order <b className="text-forest">{order.number}</b> has been placed. {order.payment.method === "cod" ? "Please keep the amount ready on delivery." : order.payment.method === "upi" ? "We'll verify your UPI payment and confirm shortly." : "Your payment was verified."}</p>
      <p className="mt-1 text-center text-xs text-ink/45">Demo mode: no confirmation email is sent and the order is stored only in this browser.</p>
      <div className="mt-10"><OrderSummaryCard order={order} /></div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a href={`https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}, I just placed order ${order.number} (${inr(order.total)}). Please confirm.`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1F8F4E] px-6 text-[13px] font-medium uppercase tracking-[.14em] text-white hover:opacity-90"><MessageCircle className="h-4 w-4" />Confirm on WhatsApp</a>
        <ButtonLink href={`/orders/track?n=${order.number}`} variant="outline">Track order</ButtonLink>
        <ButtonLink href="/shop" variant="outline">Continue shopping</ButtonLink>
      </div>
    </div>
  );
}

export default function Page() {
  return <div className="container"><Suspense><Confirmation /></Suspense></div>;
}
