"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Heart, MapPin, PackageCheck, RotateCcw, Star, Truck, X, ZoomIn } from "lucide-react";
import type { Product } from "@/types";
import { products, productById } from "@/data/products";
import { categoryBySlug } from "@/data/categories";
import { reviews as allReviews } from "@/data/content";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useCart";
import { brand } from "@/config/brand";
import { cn, estimateDelivery, fmtDate, inr, pctOff } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/Visuals";
import { Button, DemoTag, QtyStepper, SectionHeading, Stars, Field, TextArea } from "@/components/ui/primitives";
import { ProductGrid } from "./ProductCard";

function Gallery({ product }: { product: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [full, setFull] = useState(false);
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row lg:sticky lg:top-28">
      <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Product images">
        {[0, 1, 2].map((k) => (
          <button key={k} role="tab" aria-selected={i === k} aria-label={`Image ${k + 1}`} onClick={() => setI(k)} className={cn("relative h-20 w-16 overflow-hidden rounded-xl ring-1 transition md:h-24 md:w-20", i === k ? "ring-2 ring-forest" : "ring-forest/10 opacity-70 hover:opacity-100")}>
            <ProductVisual product={product} index={k} />
          </button>
        ))}
      </div>
      <div
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-[28px] bg-cream"
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setFull(true)}
      >
        <div className="absolute inset-0 transition-transform duration-200" style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
          <ProductVisual product={product} index={i} priority sizes="(max-width:1024px) 100vw, 50vw" />
        </div>
        <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ivory/90 px-3 py-1.5 text-[11px] text-forest"><ZoomIn className="h-3.5 w-3.5" />Hover or tap to zoom</span>
      </div>
      <AnimatePresence>
        {full && (
          <motion.div className="fixed inset-0 z-[80] bg-ivory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={() => setFull(false)} aria-label="Close zoom" className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-cream"><X className="h-5 w-5" /></button>
            <div className="absolute inset-0 overflow-auto"><div className="relative mx-auto aspect-[4/5] w-[160vw] max-w-[1400px] md:w-[90vw]"><ProductVisual product={product} index={i} sizes="100vw" /></div></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PinChecker() {
  const [pin, setPin] = useState("");
  const [res, setRes] = useState<ReturnType<typeof estimateDelivery> | null>(null);
  return (
    <div className="rounded-2xl border border-forest/10 p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-forest"><MapPin className="h-4 w-4 text-gold" />Check delivery</p>
      <form onSubmit={(e) => { e.preventDefault(); setRes(estimateDelivery(pin)); }} className="mt-3 flex gap-2">
        <input inputMode="numeric" maxLength={6} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setRes(null); }} placeholder="Enter PIN code" aria-label="PIN code" className="h-11 min-w-0 flex-1 rounded-full border border-forest/15 px-4 text-sm outline-none focus:border-forest" />
        <button className="h-11 rounded-full bg-forest px-5 text-[12px] uppercase tracking-widest text-ivory hover:bg-emerald">Check</button>
      </form>
      {res && <p role="status" className={cn("mt-3 text-xs", res.ok ? "text-emerald" : "text-red-600")}>{res.message}{res.ok && (res.cod ? " Cash on Delivery available." : " Prepaid only for this PIN.")}</p>}
    </div>
  );
}

function Reviews({ product }: { product: Product }) {
  const [list, setList] = useState(allReviews.filter((r) => r.productSlug === product.slug));
  const [form, setForm] = useState({ name: "", title: "", body: "", rating: 5 });
  const [err, setErr] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (form.body.trim().length < 10) er.body = "Please write at least 10 characters.";
    setErr(er);
    if (Object.keys(er).length) return;
    // Demo only: would POST to /api/reviews for moderation.
    setList([{ id: `u${Date.now()}`, name: form.name, city: "", rating: form.rating, title: form.title || "Review", body: form.body, date: new Date().toISOString().slice(0, 10) }, ...list]);
    setDone(true); setOpen(false); setForm({ name: "", title: "", body: "", rating: 5 });
  };
  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <div>
        <p className="font-serif text-6xl text-forest">{product.rating}</p>
        <Stars rating={product.rating} size={18} className="mt-2" />
        <p className="mt-2 text-sm text-ink/60">Based on {product.reviewCount} reviews <DemoTag className="ml-1">Demo</DemoTag></p>
        <Button variant="outline" className="mt-6" onClick={() => setOpen(!open)}>{open ? "Cancel" : "Write a review"}</Button>
        {done && <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald"><Check className="h-3.5 w-3.5" />Thanks! Reviews are moderated before publishing.</p>}
      </div>
      <div>
        {open && (
          <form onSubmit={submit} noValidate className="mb-10 grid gap-4 rounded-2xl bg-cream p-6">
            <div className="flex items-center gap-3"><span className="text-[12px] uppercase tracking-wider text-ink/70">Rating</span>
              {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} stars`} aria-pressed={n <= form.rating}><Star className={cn("h-5 w-5", n <= form.rating ? "fill-gold text-gold" : "text-gold/40")} /></button>)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="rname" required value={form.name} error={err.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Field label="Title" name="rtitle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <TextArea label="Review" name="rbody" required value={form.body} error={err.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            <Button className="justify-self-start">Submit review</Button>
          </form>
        )}
        {list.length === 0 ? <p className="text-sm text-ink/60">No written reviews yet — be the first.</p> : (
          <ul className="divide-y divide-forest/10">
            {list.map((r) => (
              <li key={r.id} className="py-6 first:pt-0">
                <div className="flex items-center justify-between"><Stars rating={r.rating} /><span className="text-xs text-ink/45">{fmtDate(r.date)}</span></div>
                <p className="mt-3 font-serif text-xl text-forest">{r.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{r.body}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-ink/50">{r.name}{r.city && ` · ${r.city}`} <DemoTag className="ml-1">Sample</DemoTag></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { addToCart, setCartOpen, showToast, toggleWishlist, pushRecent } = useShop.getState();
  const wish = useShop((s) => s.wishlist.includes(product.id));
  const recentIds = useShop((s) => s.recent);
  const [vid, setVid] = useState((product.variants.find((v) => v.stock > 0) ?? product.variants[0]).id);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "ingredients" | "shipping">("desc");
  const v = product.variants.find((x) => x.id === vid)!;
  const off = pctOff(v.price, v.mrp);
  const cat = categoryBySlug(product.category);

  useEffect(() => { pushRecent(product.id); }, [product.id, pushRecent]);

  const related = useMemo(() => {
    const same = products.filter((p) => p.id !== product.id && p.category === product.category);
    return [...same, ...products.filter((p) => p.id !== product.id && p.category !== product.category).sort((a, b) => b.popularity - a.popularity)].slice(0, 4);
  }, [product]);
  const recent = hydrated ? recentIds.filter((id) => id !== product.id).map(productById).filter((p): p is Product => !!p).slice(0, 4) : [];

  const add = (buy = false) => {
    addToCart(product.id, v.id, qty);
    if (buy) router.push("/checkout");
    else { showToast(`${product.name} (${v.label}) added to cart`); setCartOpen(true); }
  };

  return (
    <>
      <div className="container py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-ink/50">
          <Link href="/" className="hover:text-forest">Home</Link><ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-forest">Shop</Link><ChevronRight className="h-3 w-3" />
          {cat && <><Link href={`/categories/${cat.slug}`} className="hover:text-forest">{cat.name}</Link><ChevronRight className="h-3 w-3" /></>}
          <span className="text-ink/80" aria-current="page">{product.name}</span>
        </nav>
      </div>
      <section className="container grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <Gallery product={product} />
        <div>
          <p className="text-[11px] uppercase tracking-widest text-brown">{cat?.name}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-forest md:text-5xl">{product.name}</h1>
          <a href="#reviews" className="mt-3 flex items-center gap-2 text-sm text-ink/60"><Stars rating={product.rating} />{product.rating} · {product.reviewCount} reviews <DemoTag>Demo</DemoTag></a>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/70">{product.short}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl text-ink">{inr(v.price)}</span>
            {off > 0 && <><span className="text-lg text-ink/40 line-through">{inr(v.mrp)}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald">Save {off}%</span></>}
          </div>
          <p className="mt-1 text-xs text-ink/50">Inclusive of all taxes · Demo pricing</p>

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-widest text-ink/60">Weight</p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Weight">
              {product.variants.map((x) => (
                <button key={x.id} role="radio" aria-checked={x.id === vid} onClick={() => { setVid(x.id); setQty(1); }} disabled={x.stock === 0}
                  className={cn("flex h-14 min-w-[96px] flex-col items-center justify-center rounded-2xl border px-4 transition disabled:cursor-not-allowed disabled:opacity-40", x.id === vid ? "border-forest bg-forest text-ivory" : "border-forest/20 hover:border-forest")}>
                  <span className="text-sm">{x.label}</span><span className={cn("text-[11px]", x.id === vid ? "text-ivory/70" : "text-ink/50")}>{x.stock === 0 ? "Sold out" : inr(x.price)}</span>
                </button>
              ))}
            </div>
          </div>
          <p className={cn("mt-5 flex items-center gap-2 text-sm", v.stock === 0 ? "text-red-600" : v.stock < 10 ? "text-brown" : "text-emerald")}>
            <span className={cn("h-2 w-2 rounded-full", v.stock === 0 ? "bg-red-500" : v.stock < 10 ? "bg-gold" : "bg-emerald")} />
            {v.stock === 0 ? "Currently out of stock" : v.stock < 10 ? `Only ${v.stock} left in stock` : "In stock, ready to ship"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <QtyStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(20, v.stock))} />
            <Button className="min-w-[180px] flex-1" disabled={v.stock === 0} onClick={() => add()}>Add to cart</Button>
            <button onClick={() => toggleWishlist(product.id)} aria-label={wish ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={hydrated && wish} className="grid h-12 w-12 place-items-center rounded-full border border-forest/20 hover:border-forest"><Heart className={cn("h-5 w-5 text-forest", hydrated && wish && "fill-forest")} /></button>
          </div>
          <Button variant="gold" className="mt-3 w-full" disabled={v.stock === 0} onClick={() => add(true)}>Buy it now</Button>

          <div className="mt-8 grid gap-4"><PinChecker /></div>
          <ul className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] text-ink/60">
            <li className="rounded-2xl bg-cream p-4"><Truck className="mx-auto mb-2 h-5 w-5 text-forest" strokeWidth={1.5} />Free shipping over {inr(brand.commerce.freeShippingThreshold)}</li>
            <li className="rounded-2xl bg-cream p-4"><PackageCheck className="mx-auto mb-2 h-5 w-5 text-forest" strokeWidth={1.5} />Sealed glass jar</li>
            <li className="rounded-2xl bg-cream p-4"><RotateCcw className="mx-auto mb-2 h-5 w-5 text-forest" strokeWidth={1.5} />Easy returns on damaged items</li>
          </ul>

          <div className="mt-10">
            <div role="tablist" className="flex gap-6 border-b border-forest/10">
              {([["desc", "Description"], ["ingredients", "Ingredients"], ["shipping", "Shipping & Care"]] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("relative pb-3 text-[12px] uppercase tracking-widest", tab === k ? "text-forest" : "text-ink/45")}>
                  {l}{tab === k && <motion.span layoutId="tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />}
                </button>
              ))}
            </div>
            <div role="tabpanel" className="py-6 text-sm leading-relaxed text-ink/70">
              {tab === "desc" && <><p>{product.description}</p><div className="mt-4 flex flex-wrap gap-2">{product.notes.map((n) => <span key={n} className="rounded-full bg-cream px-3 py-1 text-xs text-forest">{n}</span>)}</div></>}
              {tab === "ingredients" && <><ul className="grid gap-2 sm:grid-cols-2">{product.ingredients.map((x) => <li key={x} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{x}</li>)}</ul><p className="mt-4 text-xs text-ink/50">Placeholder list — always confirm against the final printed label. May contain traces of sesame and nuts.</p></>}
              {tab === "shipping" && <ul className="space-y-2"><li>Dispatched within 1–2 business days.</li><li>Free shipping on orders above {inr(brand.commerce.freeShippingThreshold)}; otherwise {inr(brand.commerce.shippingFee)}.</li><li>Store in a cool, dry place. Close the lid tightly after use.</li><li>Best before: see pack.</li></ul>}
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-28 border-t border-forest/10 py-16 md:py-20"><div className="container"><SectionHeading eyebrow="Reviews" title="What people are saying" /><Reviews product={product} /></div></section>
      <section className="bg-cream py-16 md:py-20"><div className="container"><SectionHeading eyebrow="You may also like" title="Related blends" /><ProductGrid products={related} /></div></section>
      {recent.length > 0 && <section className="py-16 md:py-20"><div className="container"><SectionHeading eyebrow="Recently viewed" title="Pick up where you left off" /><ProductGrid products={recent} /></div></section>}
    </>
  );
}
