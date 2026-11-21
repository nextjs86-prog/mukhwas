"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import type { Product } from "@/types";
import { products } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { brand } from "@/config/brand";
import { useShop } from "@/lib/store";
import { cn, inr, pctOff } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/Visuals";
import { Button, QtyStepper, Stars } from "@/components/ui/primitives";

export function whatsappOrderLink(p: Product, variantLabel: string, qty: number) {
  const text = `Hi ${brand.name}, I'd like to order: ${p.name} (${variantLabel}) × ${qty}.`;
  return `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function ProductPanel({ product, onClose, onPick }: { product: Product; onClose: () => void; onPick: (id: string) => void }) {
  const { addToCart, setCartOpen, showToast } = useShop.getState();
  const [vid, setVid] = useState("");
  const [qty, setQty] = useState(1);
  useEffect(() => { setVid((product.variants.find((v) => v.stock > 0) ?? product.variants[0]).id); setQty(1); }, [product]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const v = product.variants.find((x) => x.id === vid) ?? product.variants[0];
  const off = pctOff(v.price, v.mrp);
  const related = products.filter((p) => p.id !== product.id && (p.category === product.category || p.bestSeller)).slice(0, 4);

  return (
    <motion.aside role="dialog" aria-label={product.name}
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
      className="absolute inset-x-0 bottom-0 z-20 flex max-h-[64%] flex-col overflow-hidden rounded-t-[28px] bg-ivory shadow-lift lg:inset-y-4 lg:left-auto lg:right-4 lg:max-h-none lg:w-[440px] lg:rounded-[28px]">
      <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-forest/15 lg:hidden" />
      <button onClick={onClose} aria-label="Close product" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream hover:bg-gold-light"><X className="h-4 w-4" /></button>
      <div className="overflow-y-auto overscroll-contain px-6 pb-6 pt-4 lg:pt-6">
        <div className="flex gap-5">
          <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-2xl lg:w-36"><ProductVisual product={product} /></div>
          <div className="min-w-0 pr-8">
            <p className="text-[10px] uppercase tracking-widest text-brown">{categoryBySlug(product.category)?.name} · Made in India</p>
            <h2 className="mt-1 font-serif text-3xl leading-tight text-forest">{product.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55"><Stars rating={product.rating} size={12} />{product.rating} (demo)</p>
            <p className="mt-3 flex items-baseline gap-2"><span className="text-2xl">{inr(v.price)}</span>{off > 0 && <><span className="text-sm text-ink/40 line-through">{inr(v.mrp)}</span><span className="text-xs text-emerald">{off}% off</span></>}</p>
            <p className="text-[10px] text-ink/45">MRP incl. of all taxes · demo price</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink/70">{product.description}</p>

        <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Weight">
          {product.variants.map((x) => (
            <button key={x.id} role="radio" aria-checked={x.id === v.id} disabled={x.stock === 0} onClick={() => { setVid(x.id); setQty(1); }}
              className={cn("h-10 rounded-full border px-4 text-sm transition disabled:line-through disabled:opacity-40", x.id === v.id ? "border-forest bg-forest text-ivory" : "border-forest/20 hover:border-forest")}>{x.label}</button>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <QtyStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(20, v.stock))} />
          <Button className="flex-1" disabled={v.stock === 0} onClick={() => { addToCart(product.id, v.id, qty); showToast(`${product.name} added to cart`); setCartOpen(true); }}>{v.stock === 0 ? "Sold out" : "Add to cart"}</Button>
        </div>
        <a href={whatsappOrderLink(product, v.label, qty)} target="_blank" rel="noopener noreferrer" className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full border border-[#1F8F4E]/40 text-[13px] font-medium uppercase tracking-[.14em] text-[#1F8F4E] transition hover:bg-[#1F8F4E] hover:text-white">
          <MessageCircle className="h-4 w-4" />Order on WhatsApp
        </a>

        <div className="mt-7">
          <p className="text-[11px] uppercase tracking-widest text-brown">Inside the jar</p>
          <ul className="mt-3 flex flex-wrap gap-2">{product.ingredients.map((i) => <li key={i} className="rounded-full bg-cream px-3 py-1.5 text-xs text-forest">{i}</li>)}</ul>
        </div>

        <div className="mt-7">
          <p className="text-[11px] uppercase tracking-widest text-brown">You might like</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {related.map((r) => (
              <button key={r.id} onClick={() => onPick(r.id)} className="group text-left" aria-label={`Discover ${r.name}`}>
                <span className="relative block aspect-[4/5] overflow-hidden rounded-xl transition group-hover:-translate-y-1"><ProductVisual product={r} /></span>
                <span className="mt-1 block truncate text-[11px] text-forest">{r.name.replace(/ Mukhwas$/, "")}</span>
              </button>
            ))}
          </div>
        </div>
        <Link href={`/product/${product.slug}`} className="mt-6 flex items-center gap-1.5 text-sm text-forest underline-offset-4 hover:underline">Full product details <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </motion.aside>
  );
}
