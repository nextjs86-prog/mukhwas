"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { brand } from "@/config/brand";
import { categories } from "@/data/categories";
import { products, minPrice } from "@/data/products";
import { useShop } from "@/lib/store";
import { useCartTotals, useHydrated } from "@/hooks/useCart";
import { Logo } from "@/components/ui/primitives";
import { ProductVisual } from "@/components/ui/Visuals";
import { cn, inr } from "@/lib/utils";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories", mega: true },
  { href: "/about", label: "Our Story" },
  { href: "/pantry", label: "Pantry" },
  { href: "/gifts", label: "Gift Hampers" },
  { href: "/contact", label: "Contact" },
];

export function AnnouncementBar() {
  const onHome = usePathname() === "/";
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % brand.announcement.length), 4500); return () => clearInterval(t); }, []);
  if (onHome) return null; // homepage is a full-screen carousel, like the reference
  return (
    <div className="bg-forest text-ivory">
      <div className="container flex h-9 items-center justify-center overflow-hidden text-[11px] uppercase tracking-[.2em]">
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.35 }} className="truncate text-center">
            {brand.announcement[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products.filter((p) => p.bestSeller).slice(0, 4);
    return products.filter((p) => [p.name, p.short, ...p.ingredients, ...p.notes].join(" ").toLowerCase().includes(s));
  }, [q]);
  return (
    <motion.div className="fixed inset-0 z-[65] bg-forest/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-label="Search products" onClick={(e) => e.stopPropagation()} initial={{ y: -30 }} animate={{ y: 0 }} exit={{ y: -30 }} className="bg-ivory shadow-lift">
        <div className="container py-6">
          <form onSubmit={(e) => { e.preventDefault(); router.push(`/shop?q=${encodeURIComponent(q)}`); onClose(); }} className="flex items-center gap-4 border-b border-forest/20 pb-4">
            <Search className="h-5 w-5 text-forest" />
            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fennel, rose, paan…" aria-label="Search" className="flex-1 bg-transparent font-serif text-2xl text-forest outline-none placeholder:text-ink/30 md:text-3xl" />
            <button type="button" onClick={onClose} aria-label="Close search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream"><X className="h-5 w-5" /></button>
          </form>
          <p className="mt-5 text-[11px] uppercase tracking-widest text-ink/50">{q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular right now"}</p>
          {results.length === 0 ? <p className="py-8 text-sm text-ink/60">No blends match “{q}”. Try “saunf” or “rose”.</p> : (
            <ul className="mt-4 grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.slug}`} onClick={onClose} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-cream">
                    <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl"><ProductVisual product={p} /></span>
                    <span><span className="block font-serif text-lg leading-tight text-forest">{p.name}</span><span className="text-xs text-ink/60">from {inr(minPrice(p))}</span></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [mega, setMega] = useState(false);
  const { count } = useCartTotals();
  const wishCount = useShop((s) => s.wishlist.length);
  const user = useShop((s) => s.user);
  const hydrated = useHydrated();
  const setCartOpen = useShop((s) => s.setCartOpen);

  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { setMobile(false); setMega(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full text-forest transition hover:bg-forest/5";
  const Badge = ({ n }: { n: number }) => hydrated && n > 0 ? <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-forest">{n}</span> : null;

  return (
    <>
      <header className={cn("sticky top-0 z-50 transition-all duration-500", scrolled ? "bg-ivory/90 shadow-[0_1px_0_rgba(158,27,31,.08)] backdrop-blur-md" : "bg-ivory")}>
        {/* Single-row header: cart + sign in | big logo | menu */}
        <div className="container grid h-[84px] grid-cols-[1fr_auto_1fr] items-center gap-2 md:h-[112px]">
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setCartOpen(true)} aria-label={`Cart (${count} items)`} className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-forest/80 text-forest transition hover:bg-forest hover:text-ivory md:h-14 md:w-[72px]">
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" /><Badge n={count} />
            </button>
            <Link href={hydrated && user ? "/account" : "/account/login"} className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-forest/80 px-4 text-[13px] font-bold uppercase tracking-[.14em] text-forest transition hover:bg-forest hover:text-ivory md:h-14 md:px-6 hidden sm:inline-flex">
              <User className="h-5 w-5" />{hydrated && user ? user.name.split(" ")[0] : "Sign in"}
            </Link>
          </div>
          <Logo big />
          <div className="flex items-center justify-end gap-2 md:gap-3">
            <button onClick={() => setSearch(true)} aria-label="Search" className="hidden h-11 w-11 place-items-center rounded-full text-forest transition hover:bg-forest/5 sm:grid md:h-14 md:w-14"><Search className="h-5 w-5" /></button>
            <button onClick={() => setMobile(true)} className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-forest/80 px-4 text-[13px] font-bold uppercase tracking-[.14em] text-forest transition hover:bg-forest hover:text-ivory md:h-14 md:px-6"><Menu className="h-5 w-5 md:hidden" /><span className="hidden md:inline">Menu</span></button>
            <span aria-hidden className="hidden h-14 w-14 place-items-center rounded-full bg-emerald md:grid"><span className="h-3 w-3 rotate-45 bg-ivory" /></span>
          </div>
        </div>
        <AnimatePresence>
          {mega && (
            <motion.div onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute inset-x-0 top-full hidden border-t border-forest/10 bg-ivory shadow-lift lg:block">
              <div className="container grid grid-cols-4 gap-x-10 gap-y-2 py-8">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/categories/${c.slug}`} className="group flex items-center gap-3 rounded-xl p-3 hover:bg-cream">
                    <span className="h-9 w-9 rounded-full" style={{ background: `radial-gradient(circle at 35% 35%, #fff8, ${c.tone})` }} />
                    <span><span className="block font-serif text-lg text-forest group-hover:text-emerald">{c.name}</span><span className="text-xs text-ink/55">{c.blurb}</span></span>
                  </Link>
                ))}
                <Link href="/categories" className="flex items-center p-3 text-[12px] uppercase tracking-widest text-brown underline underline-offset-4">All categories →</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobile && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-forest/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobile(false)} />
            <motion.nav aria-label="Mobile" className="fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-sm flex-col bg-ivory" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 32, stiffness: 300 }}>
              <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
                <Logo />
                <button onClick={() => setMobile(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream"><X className="h-5 w-5" /></button>
              </div>
              <ul className="flex-1 overflow-y-auto px-5 py-4">
                {nav.map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                    <Link href={n.href} className={cn("block border-b border-forest/10 py-4 font-serif text-2xl", active(n.href) ? "text-emerald" : "text-forest")}>{n.label}</Link>
                  </motion.li>
                ))}
                <li className="pt-6">
                  <p className="mb-3 text-[11px] uppercase tracking-widest text-brown">Shop by category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => <Link key={c.slug} href={`/categories/${c.slug}`} className="rounded-full border border-forest/15 px-3 py-1.5 text-xs text-forest">{c.name}</Link>)}
                  </div>
                </li>
              </ul>
              <div className="grid grid-cols-2 gap-2 border-t border-forest/10 p-5">
                <Link href={user ? "/account" : "/account/login"} className="flex h-12 items-center justify-center gap-2 rounded-full border border-forest/20 text-sm text-forest"><User className="h-4 w-4" />{user ? "Account" : "Sign in"}</Link>
                <Link href="/account/wishlist" className="flex h-12 items-center justify-center gap-2 rounded-full border border-forest/20 text-sm text-forest"><Heart className="h-4 w-4" />Wishlist</Link>
              </div>
            </motion.nav>
          </>
        )}
        {search && <SearchOverlay onClose={() => setSearch(false)} />}
      </AnimatePresence>
    </>
  );
}
