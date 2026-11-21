"use client";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/lib/store";
import { useCartTotals, useHydrated } from "@/hooks/useCart";
import { brand } from "@/config/brand";
import { inr } from "@/lib/utils";
import { products } from "@/data/products";
import { ProductVisual } from "@/components/ui/Visuals";
import { ButtonLink, EmptyState, QtyStepper, SectionHeading } from "@/components/ui/primitives";
import { CouponBox } from "@/components/cart/CouponBox";
import { ProductGrid } from "@/components/products/ProductCard";

export default function CartPage() {
  const hydrated = useHydrated();
  const t = useCartTotals();
  const { setQty, removeFromCart } = useShop.getState();

  if (!hydrated) return <div className="container py-24 text-center text-sm text-ink/50">Loading your cart…</div>;

  return (
    <div className="container py-12 md:py-16">
      <h1 className="font-serif text-5xl text-forest">Your cart</h1>
      {t.lines.length === 0 ? (
        <>
          <EmptyState icon={<ShoppingBag className="h-6 w-6" />} title="Your cart is empty" body="Looks like you haven't added anything yet." action={<ButtonLink href="/shop">Start shopping</ButtonLink>} />
          <SectionHeading eyebrow="Popular" title="Customer favourites" />
          <ProductGrid products={products.filter((p) => p.bestSeller).slice(0, 4)} />
        </>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="hidden grid-cols-[1fr_140px_100px_40px] gap-4 border-b border-forest/10 pb-3 text-[11px] uppercase tracking-widest text-ink/50 md:grid"><span>Product</span><span>Quantity</span><span className="text-right">Total</span><span /></div>
            <ul className="divide-y divide-forest/10">
              {t.lines.map((l) => (
                <li key={l.variantId} className="grid grid-cols-[88px_1fr] gap-4 py-6 md:grid-cols-[1fr_140px_100px_40px] md:items-center">
                  <div className="contents md:flex md:items-center md:gap-5">
                    <Link href={`/product/${l.product.slug}`} className="relative h-28 w-[88px] shrink-0 overflow-hidden rounded-2xl"><ProductVisual product={l.product} /></Link>
                    <div>
                      <Link href={`/product/${l.product.slug}`} className="font-serif text-xl text-forest hover:text-emerald">{l.product.name}</Link>
                      <p className="text-sm text-ink/55">{l.variant.label} · {inr(l.variant.price)}</p>
                      <div className="mt-3 flex items-center gap-4 md:hidden">
                        <QtyStepper size="sm" value={l.qty} max={Math.min(20, l.variant.stock)} onChange={(n) => setQty(l.productId, l.variantId, n)} />
                        <span className="text-sm font-medium">{inr(l.total)}</span>
                        <button onClick={() => removeFromCart(l.productId, l.variantId)} aria-label={`Remove ${l.product.name}`} className="ml-auto text-ink/40 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block"><QtyStepper size="sm" value={l.qty} max={Math.min(20, l.variant.stock)} onChange={(n) => setQty(l.productId, l.variantId, n)} /></div>
                  <span className="hidden text-right font-medium md:block">{inr(l.total)}</span>
                  <button onClick={() => removeFromCart(l.productId, l.variantId)} aria-label={`Remove ${l.product.name}`} className="hidden h-9 w-9 place-items-center rounded-full text-ink/40 hover:bg-cream hover:text-red-600 md:grid"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-forest underline-offset-4 hover:underline"><ArrowLeft className="h-4 w-4" />Continue shopping</Link>
          </div>
          <aside className="h-fit space-y-5 rounded-[28px] bg-cream p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-forest">Order summary</h2>
            <CouponBox subtotal={t.subtotal} />
            <dl className="space-y-3 border-t border-forest/10 pt-5 text-sm">
              <div className="flex justify-between"><dt>Subtotal ({t.count} items)</dt><dd>{inr(t.subtotal)}</dd></div>
              {t.mrpTotal > t.subtotal && <div className="flex justify-between text-ink/55"><dt>You save on MRP</dt><dd>{inr(t.mrpTotal - t.subtotal)}</dd></div>}
              {t.discount > 0 && <div className="flex justify-between text-emerald"><dt>Coupon ({t.code})</dt><dd>−{inr(t.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd></div>
              {t.shipping > 0 && <p className="text-xs text-ink/50">Add {inr(brand.commerce.freeShippingThreshold - (t.subtotal - t.discount))} more for free shipping.</p>}
              <div className="flex justify-between border-t border-forest/10 pt-4 text-lg font-medium text-forest"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
            </dl>
            <ButtonLink href="/checkout" className="w-full">Proceed to checkout</ButtonLink>
            <p className="text-center text-[11px] text-ink/50">Taxes included. Final amount confirmed at checkout.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
