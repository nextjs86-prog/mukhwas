"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Gift, Instagram, Leaf, Package, Quote, Sparkles, Sun, Wheat } from "lucide-react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ingredients, reviews } from "@/data/content";
import { brand } from "@/config/brand";
import { ProductGrid } from "@/components/products/ProductCard";
import { EditorialScene, GiftBox, IngredientVisual, Jar } from "@/components/ui/Visuals";
import { ButtonLink, DemoTag, Eyebrow, Reveal, SectionHeading, Stars } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function CategoryShowcase() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <SectionHeading eyebrow="Shop by category" title={<>Seven ways to <em className="text-emerald">end a meal</em></>}
          action={<Link href="/categories" className="text-[12px] uppercase tracking-widest text-forest underline underline-offset-8">View all</Link>} />
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-7">
          {categories.map((c, i) => {
            const p = products.find((x) => x.category === c.slug) ?? products[0];
            return (
              <Reveal key={c.slug} delay={i * 0.05} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-auto">
                <Link href={`/categories/${c.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[999px_999px_24px_24px] transition duration-700 group-hover:shadow-lift" style={{ background: `linear-gradient(180deg, ${c.tone}22, ${c.tone}55)` }}>
                    <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 transition duration-700 group-hover:-translate-y-2">
                      {c.slug === "gift-hampers" ? <GiftBox product={p} className="w-[86%]" /> : <Jar product={p} className="w-[70%]" showLabel={false} />}
                    </div>
                  </div>
                  <h3 className="mt-4 font-serif text-lg leading-tight text-forest group-hover:text-emerald md:text-xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-ink/55">{c.blurb}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BestSellers() {
  const list = products.filter((p) => p.bestSeller).slice(0, 4);
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container">
        <SectionHeading eyebrow="Best sellers" title="Most reached-for, after every meal" intro="The blends our customers reorder most. Ratings shown are sample data for this demo storefront."
          action={<ButtonLink href="/shop?filter=bestseller" variant="outline">Shop best sellers</ButtonLink>} />
        <ProductGrid products={list} />
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="overflow-hidden py-20 md:py-32">
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <EditorialScene items={[products[4], products[6], products[1]]} className="aspect-[4/5] rounded-[32px]" />
          <div className="absolute -bottom-8 -right-4 hidden w-56 rounded-[24px] bg-forest p-6 text-ivory shadow-lift md:block">
            <p className="font-serif text-4xl text-gold-light">मुखवास</p>
            <p className="mt-2 text-xs leading-relaxed text-ivory/70">From <em>mukh</em> (mouth) and <em>vaas</em> (fragrance) — literally, “fragrance for the mouth.”</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>Our story</Eyebrow>
          <h2 className="font-serif text-4xl leading-[1.05] text-forest md:text-[56px]">A small spoonful of <em className="text-emerald">hospitality</em>.</h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/70">
            <p>In Indian homes, a meal rarely ends without a little bowl being passed around — roasted fennel, a few candied seeds, a sliver of something sweet. It&apos;s a gesture of welcome, as much a part of the table as the food itself.</p>
            <p>We set out to honour that ritual with blends made the slow way: seeds roasted in small batches, spices balanced by hand, and packaging worthy of the occasions they&apos;re shared at.</p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-forest/10 py-6">
            {[["Roasted", "in small batches"], ["Balanced", "by hand"], ["Packed", "for gifting"]].map(([a, b]) => (
              <div key={a}><p className="font-serif text-2xl text-forest">{a}</p><p className="text-xs text-ink/55">{b}</p></div>
            ))}
          </div>
          <ButtonLink href="/about" className="mt-8">Discover more <ArrowRight className="h-4 w-4" /></ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function IngredientsShowcase() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 text-ivory md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-50" />
      <div className="container relative">
        <SectionHeading light eyebrow="The pantry" title={<>Honest ingredients, <em className="text-gold-light">nothing to hide</em></>}
          intro="Every blend starts with whole seeds, petals and spices. Full ingredient lists are on every product page." />
        <div className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-7">
          {ingredients.map((g, i) => (
            <Reveal key={g.name} delay={i * 0.06} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-auto">
              <div className="group">
                <div className="aspect-square overflow-hidden rounded-full ring-1 ring-gold/20 transition duration-700 group-hover:scale-[1.03] group-hover:ring-gold/60">
                  <IngredientVisual tone={g.tone} seed={g.seed} shape={g.shape} label={g.name} />
                </div>
                <p className="mt-5 text-center font-serif text-xl">{g.name}</p>
                <p className="text-center text-[11px] uppercase tracking-widest text-gold">{g.hindi}</p>
                <p className="mt-2 text-center text-xs leading-relaxed text-ivory/60">{g.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const items = [
    { icon: Wheat, t: "Quality ingredients", d: "Whole seeds, petals and spices — ingredients listed in full, always." },
    { icon: Leaf, t: "Carefully selected", d: "Each blend is tasted and tuned before it joins the collection." },
    { icon: Package, t: "Fresh packaging", d: "Sealed, reusable glass jars that keep aroma locked in." },
    { icon: Sun, t: "Traditional flavours", d: "Recipes inspired by Indian household mukhwas trays." },
    { icon: Gift, t: "Premium gifting", d: "Keepsake boxes and custom hampers for every occasion." },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <SectionHeading center eyebrow="Why choose us" title="Made with care, start to finish" />
        <div className="grid gap-px overflow-hidden rounded-[28px] bg-forest/10 sm:grid-cols-2 lg:grid-cols-5">
          {items.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.06} className="bg-ivory p-8 transition hover:bg-cream">
              <Icon className="h-7 w-7 text-gold" strokeWidth={1.4} />
              <h3 className="mt-6 font-serif text-2xl text-forest">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{d}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-ink/40">Brand claims are placeholders — confirm each against actual sourcing and process before launch.</p>
      </div>
    </section>
  );
}

export function GiftCollection() {
  const tiles = [
    { t: "Festival gifting", d: "Diwali, Rakhi & Eid boxes", href: "/gifts#festival" },
    { t: "Wedding gifting", d: "Favours & trousseau trays", href: "/gifts#wedding" },
    { t: "Premium gift boxes", d: "Keepsake boxes, ready to send", href: "/gifts#premium" },
    { t: "Combo collections", d: "Build-your-own trios", href: "/gifts#custom" },
  ];
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-forest p-8 text-ivory md:p-12">
          <div className="grain pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative">
            <Eyebrow light>The gifting edit</Eyebrow>
            <h2 className="font-serif text-4xl leading-[1.05] md:text-5xl">Gifts that end <em className="text-gold-light">every celebration</em> well.</h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/70">Linen-wrapped boxes, glass jars and handwritten notes. Corporate and bulk orders welcome.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/gifts" variant="gold">Explore hampers</ButtonLink>
              <ButtonLink href="/contact?type=bulk" variant="outline" className="border-ivory/30 text-ivory hover:bg-ivory hover:text-forest">Bulk enquiry</ButtonLink>
            </div>
            <GiftBox product={products[7]} className="mx-auto mt-10 w-[80%] max-w-sm" />
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {tiles.map((x, i) => (
            <Reveal key={x.t} delay={i * 0.08}>
              <Link href={x.href} className="group flex h-full flex-col justify-between rounded-[24px] bg-ivory p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift md:p-7">
                <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl" style={{ background: `linear-gradient(160deg, ${products[i + 1].palette.jar}, #F7F2E8)` }}>
                  <div className="absolute inset-0 flex items-end justify-center pb-3">
                    {i % 2 === 0 ? <GiftBox product={products[i]} className="w-[80%]" /> : <div className="flex w-[90%] items-end justify-center gap-1">{[0, 1, 2].map((k) => <Jar key={k} product={products[(i + k) % 7]} showLabel={false} className="w-1/3" />)}</div>}
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-forest md:text-2xl">{x.t}</h3>
                  <p className="mt-1 flex items-center justify-between text-xs text-ink/55">{x.d}<ArrowRight className="h-4 w-4 text-gold transition group-hover:translate-x-1" /></p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (paused) return; const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 6000); return () => clearInterval(t); }, [paused]);
  const r = reviews[i];
  return (
    <section className="py-20 md:py-28" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Kind words <DemoTag>Demo reviews</DemoTag></Eyebrow>
          <Quote className="mx-auto h-10 w-10 text-gold" strokeWidth={1} />
          <div className="relative mt-6 min-h-[220px] md:min-h-[200px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }}>
                <Stars rating={r.rating} size={16} className="justify-center" />
                <blockquote className="mt-5 font-serif text-[28px] leading-snug text-forest md:text-4xl">“{r.body}”</blockquote>
                <figcaption className="mt-6 text-[12px] uppercase tracking-widest text-ink/60">{r.name} · {r.city}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => setI((i - 1 + reviews.length) % reviews.length)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 hover:bg-forest hover:text-ivory"><ArrowLeft className="h-4 w-4" /></button>
            <div className="flex gap-2">{reviews.map((x, k) => <button key={x.id} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-forest" : "w-1.5 bg-forest/25"}`} />)}</div>
            <button onClick={() => setI((i + 1) % reviews.length)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-forest/20 hover:bg-forest hover:text-ivory"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstagramGallery() {
  const tiles = [...products.slice(0, 4), ...ingredients.slice(0, 2)];
  return (
    <section className="pb-20 md:pb-28">
      <div className="container">
        <SectionHeading eyebrow="@yourhandle" title="From our table to yours"
          action={<a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-forest/25 px-6 text-[12px] uppercase tracking-[.14em] text-forest hover:bg-forest hover:text-ivory"><Instagram className="h-4 w-4" />Follow on Instagram</a>} />
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-4">
          {tiles.map((t, i) => (
            <a key={i} href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="View on Instagram" className="group relative aspect-square overflow-hidden rounded-2xl">
              {"slug" in t
                ? <div className="absolute inset-0 flex items-end justify-center" style={{ background: `radial-gradient(circle at 50% 30%, #FFFDF8, ${t.palette.jar})` }}><Jar product={t} className="mb-[6%] w-[58%]" /></div>
                : <IngredientVisual tone={t.tone} seed={t.seed} shape={t.shape} label={t.name} />}
              <span className="absolute inset-0 grid place-items-center bg-forest/0 text-ivory opacity-0 transition group-hover:bg-forest/50 group-hover:opacity-100"><Instagram className="h-6 w-6" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[32px] bg-cream px-6 py-14 text-center md:px-16 md:py-20">
          <Sparkles className="mx-auto h-6 w-6 text-gold" />
          <h2 className="mx-auto mt-4 max-w-xl font-serif text-4xl leading-tight text-forest md:text-5xl">Letters from the spice room</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/65">New blends, festive gifting guides and early access to limited batches. Unsubscribe anytime.</p>
          <div className="mx-auto mt-8 max-w-md"><NewsletterForm /></div>
        </Reveal>
      </div>
    </section>
  );
}
