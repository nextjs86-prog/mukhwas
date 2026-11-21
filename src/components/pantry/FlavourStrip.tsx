"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { brand } from "@/config/brand";

import { inr } from "@/lib/utils";
import { minPrice, products } from "@/data/products";
import { ProductVisual } from "@/components/ui/Visuals";

export function Marquee() {
  const line = `${brand.name} • DIL SE INDIAN • MUKHWAS & MOUTH FRESHENERS • EK CHAMMACH AUR? • `;
  return (
    <div className="overflow-hidden border-y border-gold/30 bg-forest py-4 text-ivory" aria-hidden>
      <motion.div className="flex w-max whitespace-nowrap font-serif text-2xl italic tracking-wide md:text-3xl" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        {Array.from({ length: 6 }, (_, i) => <span key={i} className="px-2">{line}</span>)}
      </motion.div>
    </div>
  );
}

/** Horizontal, scroll- or drag-able flavour rail. */
export function FlavourStrip() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: number } | null>(null);
  return (
    <section className="py-16 md:py-24">
      <div className="container mb-8 flex items-end justify-between gap-4">
        <div><p className="text-[11px] uppercase tracking-widest2 text-brown">Every flavour</p><h2 className="mt-2 font-serif text-4xl text-forest md:text-5xl">Explore our flavours.</h2></div>
        <p className="hidden text-sm text-ink/55 md:block">Scroll or drag to discover flavours →</p>
      </div>
      <div ref={track} className="no-scrollbar flex cursor-grab snap-x gap-5 overflow-x-auto px-4 pb-4 active:cursor-grabbing md:px-[max(2rem,calc((100vw-1360px)/2+3rem))]"
        onPointerDown={(e) => { if (e.pointerType === "mouse") drag.current = { x: e.clientX, left: track.current!.scrollLeft, moved: 0 }; }}
        onPointerMove={(e) => { if (!drag.current) return; const d = e.clientX - drag.current.x; drag.current.moved = Math.abs(d); track.current!.scrollLeft = drag.current.left - d; }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)} onPointerLeave={() => (drag.current = null)}
        onClickCapture={(e) => { if (drag.current && drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); } }}>
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} draggable={false} className="group w-[62vw] shrink-0 snap-start sm:w-[300px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-lift"><ProductVisual product={p} /></div>
            <p className="mt-3 font-serif text-2xl text-forest">{p.name}</p>
            <p className="text-sm text-ink/55">{p.notes.join(" · ")} — from {inr(minPrice(p))}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
