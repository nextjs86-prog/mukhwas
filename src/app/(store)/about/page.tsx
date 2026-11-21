import type { Metadata } from "next";
import { Award, HandHeart, Leaf, Package, Sprout, Users } from "lucide-react";
import { brand } from "@/config/brand";
import { products } from "@/data/products";
import { ingredients } from "@/data/content";
import { EditorialScene, GiftBox, IngredientVisual, Jar } from "@/components/ui/Visuals";
import { ButtonLink, Eyebrow, PageHero, Reveal, SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Our Story", description: `The story behind ${brand.name} — honouring India's after-meal tradition of mukhwas with small-batch blends.` };

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded border border-dashed border-brown/40 bg-cream px-1.5 py-0.5 text-[13px] text-brown">{children}</span>
);

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title={<>A ritual worth <em className="text-emerald">keeping</em>.</>} intro={`${brand.name} began with a simple belief: the last bite of a meal should be as thoughtful as the first.`} />

      <section className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-20">
        <Reveal><EditorialScene items={[products[0], products[3], products[2]]} dark className="aspect-[5/4] rounded-[32px]" /></Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>Introduction</Eyebrow>
          <h2 className="font-serif text-4xl leading-tight text-forest md:text-5xl">Who we are</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/70">
            <p>{brand.name} makes mukhwas — the fragrant seed and spice blends served after Indian meals — in small batches, with ingredients we can name and recipes we&apos;re proud of.</p>
            <p>Founded in <Placeholder>[Year]</Placeholder> in <Placeholder>[City]</Placeholder> by <Placeholder>[Founder names]</Placeholder>. <Placeholder>[Add your founding story here — keep it factual.]</Placeholder></p>
          </div>
        </Reveal>
      </section>

      <section className="relative overflow-hidden bg-forest py-20 text-ivory md:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-50" />
        <div className="container relative grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <Eyebrow light>The tradition</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">Mukh + vaas.<br /><em className="text-gold-light">Fragrance for the mouth.</em></h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-[15px] leading-relaxed text-ivory/75">
            <p>Across India, the end of a meal is marked by a small, generous gesture: a tray or bowl of roasted fennel, sesame, coriander seeds and sweet, colourful mixes passed from guest to guest.</p>
            <p>In Gujarati and Rajasthani homes it&apos;s a fixture beside the door; at weddings it arrives in silver bowls; at restaurants it waits by the cash counter. Recipes vary family to family — some savoury and tangy, some floral with rose and gulkand, some candied and bright.</p>
            <p>Our blends are inspired by that variety. We don&apos;t claim to have invented anything — we simply try to make each one carefully, and package it beautifully enough to share.</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading eyebrow="Ingredients" title="What goes in the jar" intro="Whole seeds, petals and spices. Every product page lists its full ingredients." />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {ingredients.map((g) => (
              <div key={g.name} className="text-center">
                <div className="aspect-square overflow-hidden rounded-full"><IngredientVisual tone={g.tone} seed={g.seed} shape={g.shape} label={g.name} /></div>
                <p className="mt-3 font-serif text-lg text-forest">{g.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-brown">{g.hindi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>Quality philosophy</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight text-forest md:text-5xl">Small batches. Clear labels. No shortcuts we&apos;d hide.</h2>
            <ul className="mt-8 space-y-5">
              {[[Sprout, "Ingredient sourcing", "[Describe where and how you source — only verifiable statements.]"], [Leaf, "Process", "[Describe roasting, blending and quality checks.]"], [Award, "Certifications", "[e.g. FSSAI licence no. — add only once issued.]"]].map(([I, t, d]) => {
                const Icon = I as typeof Leaf;
                return <li key={t as string} className="flex gap-4"><Icon className="mt-1 h-5 w-5 shrink-0 text-gold" /><div><p className="font-serif text-xl text-forest">{t as string}</p><p className="mt-1 text-sm"><Placeholder>{d as string}</Placeholder></p></div></li>;
              })}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative grid aspect-square place-items-center rounded-[32px] bg-ivory">
            <div className="flex w-[80%] items-end justify-center gap-3">{[products[6], products[4], products[1]].map((p, i) => <Jar key={p.id} product={p} className={i === 1 ? "w-[38%]" : "w-[30%]"} />)}</div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 grid aspect-[5/4] place-items-center rounded-[32px] bg-forest lg:order-1"><GiftBox product={products[7]} className="w-[70%]" /></Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <Eyebrow>Packaging</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight text-forest md:text-5xl">Made to be kept, gifted and refilled.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink/70">Our blends ship in sealed glass jars with gold-toned lids, designed to look at home on a dining table and to be reused long after. Gift boxes are wrapped by hand. <Placeholder>[Confirm final packaging materials before publishing.]</Placeholder></p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container">
          <SectionHeading center eyebrow="What we value" title="Our values" />
          <div className="grid gap-5 md:grid-cols-3">
            {[[HandHeart, "Hospitality", "Every product starts from the idea of welcoming someone to your table."], [Users, "Honesty", "Clear ingredients, honest descriptions and no exaggerated claims."], [Package, "Craft", "Small batches, careful packing, and attention to the details that matter."]].map(([I, t, d]) => {
              const Icon = I as typeof Leaf;
              return <Reveal key={t as string} className="rounded-[28px] bg-ivory p-8"><Icon className="h-7 w-7 text-gold" strokeWidth={1.4} /><h3 className="mt-6 font-serif text-3xl text-forest">{t as string}</h3><p className="mt-2 text-sm leading-relaxed text-ink/60">{d as string}</p></Reveal>;
            })}
          </div>
          <div className="mt-14 text-center"><ButtonLink href="/shop">Taste the collection</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
