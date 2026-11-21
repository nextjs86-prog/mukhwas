"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { products } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { useShop } from "@/lib/store";
import { cn, inr, pctOff } from "@/lib/utils";
import { Cutout, ProductVisual } from "@/components/ui/Visuals";
import { Button, QtyStepper } from "@/components/ui/primitives";
import { whatsappOrderLink } from "@/components/pantry/ProductPanel";

const ease = [0.22, 1, 0.36, 1] as const;
const Diamond = () => <span aria-hidden className="mx-auto block h-4 w-4 rotate-45" style={{ background: "var(--a)" }} />;

export function EditorialProduct({ product }: { product: Product }) {
  const { addToCart, setCartOpen, showToast, pushRecent } = useShop.getState();
  const [vid, setVid] = useState((product.variants.find((v) => v.stock > 0) ?? product.variants[0]).id);
  const [qty, setQty] = useState(1);
  const v = product.variants.find((x) => x.id === vid)!;
  const off = pctOff(v.price, v.mrp);
  const isBox = product.category === "gift-hampers";
  const A = product.accent ?? "#D7262E";
  const related = products.filter((p) => p.id !== product.id).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  useEffect(() => { pushRecent(product.id); }, [product.id, pushRecent]);

  return (
    <article style={{ ["--a" as string]: A, background: `linear-gradient(180deg, color-mix(in srgb, ${A} 14%, #FFFBF4) 0%, #FFFBF4 70%)` }}>
      {/* ── Hero: giant title, side labels, product ── */}
      <section className="container relative pb-10 pt-6 md:pt-8">
        <Link href="/" className="inline-flex h-12 items-center gap-2 rounded-full border px-6 text-[13px] font-semibold uppercase tracking-wider transition hover:text-white hover:[background:var(--a)]" style={{ color: A, borderColor: A }}>
          <ArrowLeft className="h-4 w-4" />Back to home
        </Link>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}
          className="mx-auto mt-6 max-w-6xl text-center font-serif text-[15vw] font-semibold uppercase leading-[.86] tracking-tight md:text-[8.5vw] xl:text-[128px]" style={{ color: A }}>
          {product.name.replace(/ Mukhwas$/, "")}
        </motion.h1>
        <div className="relative mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:mt-10">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }} className="font-serif text-xl leading-tight md:text-5xl" style={{ color: A, opacity: 0.8 }}>
            {categoryBySlug(product.category)?.name.replace(" Collection", "")}
          </motion.p>
          <motion.div initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 1, ease }} className={cn(isBox ? "w-[52vw] max-w-[520px]" : "w-[38vw] max-w-[340px]")}>
            <Cutout product={product} priority className="mx-auto h-[48vh] max-h-[520px] min-h-[300px] w-auto drop-shadow-[0_30px_26px_rgba(0,0,0,.28)]" />
          </motion.div>
          <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }} className="text-right font-serif text-xl leading-tight md:text-5xl" style={{ color: A, opacity: 0.8 }}>
            Made in<br />India
          </motion.p>
        </div>
      </section>

      {/* ── Story + price ── */}
      <section className="container max-w-4xl py-16 text-center md:py-24">
        <Diamond />
        <p className="mt-12 font-serif text-2xl leading-snug md:text-4xl" style={{ color: A }}>{product.short}</p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">{product.description}</p>
        <p className="mt-12 font-serif text-7xl md:text-9xl" style={{ color: A }}>{inr(v.price)}</p>
        <p className="mt-2 text-xs uppercase tracking-widest text-ink/50">
          {off > 0 && <><span className="line-through">MRP {inr(v.mrp)}</span> · {off}% off · </>}MRP incl. of all taxes · demo price
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Weight">
          {product.variants.map((x) => (
            <button key={x.id} role="radio" aria-checked={x.id === vid} disabled={x.stock === 0} onClick={() => { setVid(x.id); setQty(1); }}
              className={cn("h-12 rounded-full border px-6 text-sm transition disabled:line-through disabled:opacity-40", x.id === vid ? "text-white" : "border-ink/20 hover:border-ink/50")} style={x.id === vid ? { background: A, borderColor: A } : undefined}>{x.label}</button>
          ))}
        </div>
        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-3">
          <QtyStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(20, v.stock))} />
          <Button className="min-w-[200px] flex-1 hover:opacity-90" style={{ background: A }} disabled={v.stock === 0} onClick={() => { addToCart(product.id, v.id, qty); showToast(`${product.name} added to cart`); setCartOpen(true); }}>
            {v.stock === 0 ? "Sold out" : "Add to cart"}
          </Button>
        </div>
        <a href={whatsappOrderLink(product, v.label, qty)} target="_blank" rel="noopener noreferrer"
          className="mx-auto mt-3 flex h-12 max-w-md items-center justify-center gap-2 rounded-full border border-[#1F8F4E]/40 text-[13px] font-medium uppercase tracking-[.14em] text-[#1F8F4E] transition hover:bg-[#1F8F4E] hover:text-white">
          <MessageCircle className="h-4 w-4" />Order on WhatsApp
        </a>
      </section>

      {/* ── Inside the jar ── */}
      <section className="container max-w-4xl pb-16 text-center md:pb-24">
        <Diamond />
        <h2 className="mt-10 font-serif text-4xl text-forest md:text-5xl">Inside the {isBox ? "box" : "jar"}</h2>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {product.ingredients.map((i) => <li key={i} className="rounded-full border border-forest/15 bg-ivory px-5 py-2.5 text-sm text-forest">{i}</li>)}
        </ul>
      </section>

      {/* ── You might like ── */}
      <section className="border-t border-forest/10 py-16 md:py-24">
        <div className="container">
          <h2 className="text-center font-serif text-4xl text-forest md:text-5xl">You might like</h2>
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((r) => (
              <Link key={r.id} href={`/product/${r.slug}`} className="group text-center">
                <span className="relative block aspect-[4/5] overflow-hidden rounded-[24px] transition duration-500 group-hover:-translate-y-1"><ProductVisual product={r} /></span>
                <span className="mt-3 block font-serif text-xl text-forest">{r.name}</span>
                <span className="text-sm text-ink/55">{inr(Math.min(...r.variants.map((x) => x.price)))}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
