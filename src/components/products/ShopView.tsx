"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products, minPrice, inStock } from "@/data/products";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/types";
import { ProductGrid } from "./ProductCard";
import { Button, EmptyState } from "@/components/ui/primitives";
import { cn, inr } from "@/lib/utils";

const PRICE = [
  { id: "u300", label: "Under ₹300", test: (n: number) => n < 300 },
  { id: "300-600", label: "₹300 – ₹600", test: (n: number) => n >= 300 && n <= 600 },
  { id: "o600", label: "Above ₹600", test: (n: number) => n > 600 },
];
const SORTS = [["popular", "Popularity"], ["newest", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["rating", "Top rated"]] as const;
const PAGE = 6;

export function ShopView({ lockedCategory }: { lockedCategory?: CategorySlug }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [cats, setCats] = useState<string[]>(lockedCategory ? [lockedCategory] : sp.get("category")?.split(",").filter(Boolean) ?? []);
  const [prices, setPrices] = useState<string[]>([]);
  const [best, setBest] = useState(sp.get("filter") === "bestseller");
  const [avail, setAvail] = useState(false);
  const [sort, setSort] = useState<string>(sp.get("sort") ?? "popular");
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => { setQ(sp.get("q") ?? ""); }, [sp]);
  useEffect(() => { setShown(PAGE); }, [q, cats, prices, best, avail, sort]);
  useEffect(() => { document.body.style.overflow = drawer ? "hidden" : ""; }, [drawer]);

  // Keep URL shareable (only on the main shop page).
  useEffect(() => {
    if (lockedCategory) return;
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (cats.length) p.set("category", cats.join(","));
    if (best) p.set("filter", "bestseller");
    if (sort !== "popular") p.set("sort", sort);
    const s = p.toString();
    router.replace(s ? `/shop?${s}` : "/shop", { scroll: false });
  }, [q, cats, best, sort, lockedCategory, router]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = products.filter((p) =>
      (!s || [p.name, p.short, ...p.ingredients, ...p.notes].join(" ").toLowerCase().includes(s)) &&
      (!cats.length || cats.includes(p.category)) &&
      (!prices.length || prices.some((id) => PRICE.find((x) => x.id === id)!.test(minPrice(p)))) &&
      (!best || p.bestSeller) && (!avail || inStock(p)));
    r = [...r].sort((a, b) => {
      switch (sort) {
        case "newest": return b.createdAt.localeCompare(a.createdAt);
        case "price-asc": return minPrice(a) - minPrice(b);
        case "price-desc": return minPrice(b) - minPrice(a);
        case "rating": return b.rating - a.rating;
        default: return b.popularity - a.popularity;
      }
    });
    return r;
  }, [q, cats, prices, best, avail, sort]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const activeCount = (lockedCategory ? 0 : cats.length) + prices.length + (best ? 1 : 0) + (avail ? 1 : 0);
  const reset = () => { if (!lockedCategory) setCats([]); setPrices([]); setBest(false); setAvail(false); setQ(""); };

  const Check = ({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) => (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-ink/80 hover:text-forest">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-forest/30 accent-[#9E1B1F]" />
      <span className="flex-1">{label}</span>{count !== undefined && <span className="text-xs text-ink/40">{count}</span>}
    </label>
  );

  const filters = (
    <div className="space-y-8">
      {!lockedCategory && (
        <fieldset>
          <legend className="mb-3 text-[11px] uppercase tracking-widest text-brown">Category</legend>
          {categories.map((c) => <Check key={c.slug} label={c.name} checked={cats.includes(c.slug)} onChange={() => toggle(cats, setCats, c.slug)} count={products.filter((p) => p.category === c.slug).length} />)}
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-3 text-[11px] uppercase tracking-widest text-brown">Price</legend>
        {PRICE.map((p) => <Check key={p.id} label={p.label} checked={prices.includes(p.id)} onChange={() => toggle(prices, setPrices, p.id)} />)}
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-[11px] uppercase tracking-widest text-brown">Refine</legend>
        <Check label="Best sellers" checked={best} onChange={() => setBest(!best)} />
        <Check label="In stock only" checked={avail} onChange={() => setAvail(!avail)} />
      </fieldset>
      {activeCount > 0 && <button onClick={reset} className="text-sm text-forest underline underline-offset-4">Clear all filters</button>}
    </div>
  );

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 border-b border-forest/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search blends or ingredients" aria-label="Search products" className="h-12 w-full rounded-full border border-forest/15 bg-ivory pl-11 pr-10 text-sm outline-none focus:border-forest" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDrawer(true)} className="flex h-12 items-center gap-2 rounded-full border border-forest/20 px-5 text-sm lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />Filters{activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-forest text-[10px] text-ivory">{activeCount}</span>}
          </button>
          <p className="hidden text-sm text-ink/55 md:block">{list.length} product{list.length === 1 ? "" : "s"}</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only md:not-sr-only md:text-ink/55">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-12 rounded-full border border-forest/20 bg-ivory px-4 text-sm outline-none focus:border-forest">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters"><div className="sticky top-28">{filters}</div></aside>
        <div>
          {list.length === 0 ? (
            <EmptyState icon={<Search className="h-6 w-6" />} title="No blends found" body="Try a different search or clear some filters." action={<Button variant="outline" onClick={reset}>Clear filters</Button>} />
          ) : (
            <>
              <ProductGrid products={list.slice(0, shown)} cols={3} />
              <div className="mt-14 flex flex-col items-center gap-4">
                <p className="text-xs text-ink/50">Showing {Math.min(shown, list.length)} of {list.length}</p>
                <div className="h-0.5 w-40 overflow-hidden rounded bg-cream"><div className="h-full bg-gold" style={{ width: `${(Math.min(shown, list.length) / list.length) * 100}%` }} /></div>
                {shown < list.length && <Button variant="outline" onClick={() => setShown(shown + PAGE)}>Load more</Button>}
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-forest/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div role="dialog" aria-label="Filters" className="fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-ivory p-6" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 300 }}>
              <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-2xl text-forest">Filters</h2><button onClick={() => setDrawer(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream"><X className="h-5 w-5" /></button></div>
              {filters}
              <Button className="mt-8 w-full" onClick={() => setDrawer(false)}>Show {list.length} results</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export const priceLabel = (n: number) => inr(n);
