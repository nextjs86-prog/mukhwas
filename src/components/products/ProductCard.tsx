"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { ProductVisual } from "@/components/ui/Visuals";
import { Stars } from "@/components/ui/primitives";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useCart";
import { cn, inr, pctOff } from "@/lib/utils";
import { categoryBySlug } from "@/data/categories";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const hydrated = useHydrated();
  const wish = useShop((s) => s.wishlist.includes(product.id));
  const { toggleWishlist, addToCart, setQuickView, setCartOpen, showToast } = useShop.getState();
  const variant = product.variants.find((v) => v.stock > 0) ?? product.variants[0];
  const off = pctOff(variant.price, variant.mrp);
  const soldOut = !product.variants.some((v) => v.stock > 0);

  const add = () => {
    if (soldOut) return;
    addToCart(product.id, variant.id);
    showToast(`${product.name} (${variant.label}) added to cart`);
    setCartOpen(true);
  };

  return (
    <motion.article whileHover="hover" className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-cream">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <motion.div variants={{ hover: { scale: 1.04 } }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
            <ProductVisual product={product} priority={priority} />
          </motion.div>
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {soldOut ? <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-ivory">Sold out</span>
            : off > 0 && <span className="rounded-full bg-forest px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory">{off}% off</span>}
          {product.bestSeller && <span className="rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] uppercase tracking-wider text-forest">Best seller</span>}
          {product.isNew && <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] uppercase tracking-wider text-forest">New</span>}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={hydrated && wish}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-forest shadow-soft backdrop-blur transition hover:bg-ivory"
        >
          <Heart className={cn("h-4 w-4 transition", hydrated && wish && "fill-forest")} />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex gap-2 transition duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button onClick={add} disabled={soldOut} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-forest text-[11px] font-medium uppercase tracking-[.14em] text-ivory transition hover:bg-emerald disabled:bg-ink/50">
            <ShoppingBag className="h-4 w-4" /><span className="sr-only sm:not-sr-only">{soldOut ? "Sold out" : "Add to cart"}</span>
          </button>
          <button onClick={() => setQuickView(product.id)} aria-label={`Quick view ${product.name}`} className="grid h-11 w-11 place-items-center rounded-full bg-ivory text-forest shadow-soft transition hover:bg-cream">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-[10px] uppercase tracking-widest text-brown">{categoryBySlug(product.category)?.name}</p>
        <h3 className="mt-1 font-serif text-xl leading-snug text-forest">
          <Link href={`/product/${product.slug}`} className="hover:text-emerald">{product.name}</Link>
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink/60">
          <Stars rating={product.rating} size={12} />
          <span>{product.rating} · {product.reviewCount} <span className="text-[10px] uppercase tracking-wider">(demo)</span></span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[15px] font-medium text-ink">{inr(variant.price)}</span>
          {off > 0 && <span className="text-sm text-ink/40 line-through">{inr(variant.mrp)}</span>}
          <span className="ml-auto text-xs text-ink/50">{variant.label}</span>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {products.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}
    </div>
  );
}
