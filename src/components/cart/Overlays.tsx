"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop } from "@/lib/store";
import { useCartTotals, useHydrated } from "@/hooks/useCart";
import { productById } from "@/data/products";
import { brand } from "@/config/brand";
import { inr, pctOff, cn } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/Visuals";
import { Button, ButtonLink, QtyStepper, Stars } from "@/components/ui/primitives";

function useLockScroll(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { useShop.getState().setCartOpen(false); useShop.getState().setQuickView(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [lock]);
}

export function CartDrawer() {
  const open = useShop((s) => s.cartOpen);
  const { setCartOpen, setQty, removeFromCart } = useShop.getState();
  const t = useCartTotals();
  const hydrated = useHydrated();
  useLockScroll(open);
  const remaining = brand.commerce.freeShippingThreshold - (t.subtotal - t.discount);

  return (
    <AnimatePresence>
      {open && hydrated && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-forest/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[440px] flex-col bg-ivory shadow-lift"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            <header className="flex items-center justify-between border-b border-forest/10 px-6 py-5">
              <h2 className="font-serif text-2xl text-forest">Your Cart <span className="text-base text-ink/50">({t.count})</span></h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream"><X className="h-5 w-5" /></button>
            </header>
            {t.lines.length > 0 && (
              <div className="border-b border-forest/10 px-6 py-4">
                <p className="text-xs text-ink/70">{remaining > 0 ? <>You&apos;re <b className="text-forest">{inr(remaining)}</b> away from free shipping</> : <span className="flex items-center gap-1.5 text-emerald"><Check className="h-3.5 w-3.5" />You&apos;ve unlocked free shipping</span>}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream"><div className="h-full bg-gold transition-all duration-500" style={{ width: `${Math.min(100, ((t.subtotal - t.discount) / brand.commerce.freeShippingThreshold) * 100)}%` }} /></div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-6">
              {t.lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-10 w-10 text-gold" />
                  <p className="mt-4 font-serif text-2xl text-forest">Your cart is empty</p>
                  <p className="mt-1 text-sm text-ink/60">Discover our small-batch blends.</p>
                  <Link href="/shop" onClick={() => setCartOpen(false)} className="mt-6 inline-flex h-12 items-center rounded-full bg-forest px-6 text-[13px] uppercase tracking-[.14em] text-ivory hover:bg-emerald">Shop the collection</Link>
                </div>
              ) : (
                <ul className="divide-y divide-forest/10">
                  {t.lines.map((l) => (
                    <li key={l.variantId} className="flex gap-4 py-5">
                      <Link href={`/product/${l.product.slug}`} onClick={() => setCartOpen(false)} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl"><ProductVisual product={l.product} /></Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="font-serif text-lg leading-tight text-forest">{l.product.name}</p>
                            <p className="text-xs text-ink/50">{l.variant.label}</p>
                          </div>
                          <button onClick={() => removeFromCart(l.productId, l.variantId)} aria-label={`Remove ${l.product.name}`} className="h-8 w-8 shrink-0 rounded-full text-ink/40 hover:bg-cream hover:text-red-600"><Trash2 className="mx-auto h-4 w-4" /></button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QtyStepper size="sm" value={l.qty} max={Math.min(20, l.variant.stock)} onChange={(n) => setQty(l.productId, l.variantId, n)} />
                          <span className="text-sm font-medium">{inr(l.total)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {t.lines.length > 0 && (
              <footer className="space-y-3 border-t border-forest/10 bg-cream/60 px-6 py-5">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-medium">{inr(t.subtotal)}</span></div>
                {t.discount > 0 && <div className="flex justify-between text-sm text-emerald"><span>Discount ({t.code})</span><span>−{inr(t.discount)}</span></div>}
                <p className="text-xs text-ink/50">Shipping & coupons calculated at checkout.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/cart" onClick={() => setCartOpen(false)} className="inline-flex h-12 items-center justify-center rounded-full border border-forest/25 text-[12px] uppercase tracking-[.14em] text-forest hover:bg-forest hover:text-ivory">View cart</Link>
                  <Link href="/checkout" onClick={() => setCartOpen(false)} className="inline-flex h-12 items-center justify-center rounded-full bg-forest text-[12px] uppercase tracking-[.14em] text-ivory hover:bg-emerald">Checkout</Link>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function QuickView() {
  const id = useShop((s) => s.quickView);
  const { setQuickView, addToCart, setCartOpen, showToast, toggleWishlist } = useShop.getState();
  const wish = useShop((s) => (id ? s.wishlist.includes(id) : false));
  const product = id ? productById(id) : undefined;
  const [vid, setVid] = useState<string>("");
  const [qty, setQty] = useState(1);
  useLockScroll(!!product);
  useEffect(() => { if (product) { setVid((product.variants.find((v) => v.stock > 0) ?? product.variants[0]).id); setQty(1); } }, [product]);
  const variant = product?.variants.find((v) => v.id === vid) ?? product?.variants[0];

  return (
    <AnimatePresence>
      {product && variant && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-end bg-forest/40 backdrop-blur-[2px] md:place-items-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickView(null)}>
          <motion.div
            role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-ivory shadow-lift md:grid-cols-2 md:rounded-[28px]"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={() => setQuickView(null)} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 shadow-soft"><X className="h-5 w-5" /></button>
            <div className="relative aspect-square md:aspect-auto"><ProductVisual product={product} /></div>
            <div className="flex flex-col p-6 md:p-10">
              <h2 className="font-serif text-3xl text-forest">{product.name}</h2>
              <div className="mt-2 flex items-center gap-2 text-xs text-ink/60"><Stars rating={product.rating} />{product.rating} ({product.reviewCount} demo reviews)</div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl">{inr(variant.price)}</span>
                {variant.mrp > variant.price && <><span className="text-ink/40 line-through">{inr(variant.mrp)}</span><span className="text-sm text-emerald">{pctOff(variant.price, variant.mrp)}% off</span></>}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">{product.description}</p>
              <p className="mt-6 text-[11px] uppercase tracking-widest text-ink/60">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button key={v.id} onClick={() => setVid(v.id)} disabled={v.stock === 0} className={cn("h-10 rounded-full border px-4 text-sm transition disabled:line-through disabled:opacity-40", v.id === vid ? "border-forest bg-forest text-ivory" : "border-forest/20 hover:border-forest")}>{v.label}</button>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <QtyStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(20, variant.stock))} />
                <Button className="flex-1" disabled={variant.stock === 0} onClick={() => { addToCart(product.id, variant.id, qty); showToast(`${product.name} added to cart`); setQuickView(null); setCartOpen(true); }}>
                  {variant.stock === 0 ? "Sold out" : "Add to cart"}
                </Button>
                <button onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-forest/20"><Heart className={cn("h-4 w-4", wish && "fill-forest")} /></button>
              </div>
              <Link href={`/product/${product.slug}`} onClick={() => setQuickView(null)} className="mt-6 text-sm text-forest underline underline-offset-4">View full details</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast() {
  const toast = useShop((s) => s.toast);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm text-ivory shadow-lift">
            <Check className="h-4 w-4 text-gold" />{toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
