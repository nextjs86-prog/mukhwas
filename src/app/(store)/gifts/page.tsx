import type { Metadata } from "next";
import { Check } from "lucide-react";
import { products } from "@/data/products";
import { GiftBox, Jar } from "@/components/ui/Visuals";
import { Eyebrow, PageHero, Reveal, SectionHeading } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/products/ProductCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = { title: "Gift Hampers", description: "Mukhwas gift hampers for weddings, festivals and corporate gifting. Premium boxes and custom hampers." };

const collections = [
  { id: "wedding", t: "Wedding gifting", d: "Favour jars, trousseau trays and mehendi-night bowls — personalised tags and colour-matched ribbons available.", points: ["Personalised tags", "Bulk pricing", "Colour-matched ribbons"], tone: "#C9707A" },
  { id: "festival", t: "Festival gifting", d: "Diwali, Rakhi, Eid and Navratri boxes with seasonal blends and festive wrapping.", points: ["Seasonal blends", "Festive wrapping", "Greeting card"], tone: "#E8B21E" },
  { id: "corporate", t: "Corporate gifting", d: "Branded hampers for clients and teams, with logo sleeves and multi-address dispatch.", points: ["Logo sleeves", "Multi-address dispatch", "GST invoice"], tone: "#D7262E" },
  { id: "premium", t: "Premium gift boxes", d: "Our keepsake boxes of six or nine signature blends, ready to send.", points: ["Glass jars", "Linen-wrapped box", "Handwritten note"], tone: "#9E1B1F" },
  { id: "custom", t: "Custom gift hampers", d: "Choose your blends, box size and message — we'll assemble it by hand.", points: ["Pick your blends", "Choose box size", "Custom message"], tone: "#806347" },
];

export default function GiftsPage() {
  const giftable = [products[7], products[3], products[2], products[1]];
  return (
    <>
      <PageHero eyebrow="Gift hampers" title={<>Gifts that end <em className="text-emerald">every celebration</em> well.</>} intro="Glass jars, gold lids and linen-wrapped boxes — mukhwas hampers for weddings, festivals and the people you work with." />

      <section className="container space-y-6 py-14 md:py-20">
        {collections.map((c, i) => (
          <Reveal key={c.id}>
            <article id={c.id} className={`grid scroll-mt-28 overflow-hidden rounded-[32px] bg-cream md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative grid aspect-[4/3] place-items-center md:aspect-auto md:min-h-[380px]" style={{ background: `radial-gradient(90% 80% at 50% 30%, ${c.tone}40, ${c.tone}90)` }}>
                {i % 2 === 0 ? <GiftBox product={products[7]} className="w-[62%] drop-shadow-xl" /> : <div className="flex w-[70%] items-end justify-center gap-2">{[0, 1, 2].map((k) => <Jar key={k} product={products[(i * 2 + k) % 7]} className={k === 1 ? "w-[38%]" : "w-[30%]"} />)}</div>}
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <Eyebrow>0{i + 1}</Eyebrow>
                <h2 className="font-serif text-4xl text-forest">{c.t}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{c.d}</p>
                <ul className="mt-6 space-y-2">{c.points.map((p) => <li key={p} className="flex items-center gap-2 text-sm text-forest"><Check className="h-4 w-4 text-gold" />{p}</li>)}</ul>
                <a href={`#enquire`} className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-forest px-6 text-[12px] uppercase tracking-[.14em] text-ivory hover:bg-emerald">Enquire about {c.t.split(" ")[0].toLowerCase()}</a>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="bg-cream py-20"><div className="container"><SectionHeading eyebrow="Ready to send" title="Giftable favourites" /><ProductGrid products={giftable} /></div></section>

      <section id="enquire" className="scroll-mt-28 py-20 md:py-28">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Eyebrow>Gifting enquiry</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight text-forest md:text-5xl">Tell us about your occasion</h2>
            <p className="mt-4 text-[15px] text-ink/65">Share the occasion, quantity and date — we&apos;ll send options and a quote. Minimum quantities and lead times will be confirmed on enquiry.</p>
          </div>
          <div className="rounded-[28px] bg-ivory p-6 shadow-lift md:p-10"><EnquiryForm defaultType="wedding" showQty types={["wedding", "festival", "corporate", "custom", "bulk"]} /></div>
        </div>
      </section>
    </>
  );
}
