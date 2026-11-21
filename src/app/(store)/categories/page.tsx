import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { GiftBox, Jar } from "@/components/ui/Visuals";
import { PageHero, Reveal } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Categories", description: "Explore mukhwas by collection — traditional, sweet, premium, paan, saunf, sugar-free and gift hampers." };

export default function CategoriesPage() {
  return (
    <>
      <PageHero eyebrow="Collections" title="Shop by category" intro="From heirloom Gujarati trays to rose-petal reserve blends — find the after-meal that feels like yours." />
      <section className="container grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-3 md:py-20">
        {categories.map((c, i) => {
          const items = products.filter((p) => p.category === c.slug);
          const p = items[0] ?? products[0];
          return (
            <Reveal key={c.slug} delay={(i % 3) * 0.08} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <Link href={`/categories/${c.slug}`} className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[28px] p-7" style={{ background: `linear-gradient(150deg, ${c.tone}26, ${c.tone}66)` }}>
                <div className="relative z-10">
                  <p className="text-[11px] uppercase tracking-widest text-ink/60">{items.length} product{items.length === 1 ? "" : "s"}</p>
                  <h2 className="mt-2 font-serif text-3xl text-forest">{c.name}</h2>
                  <p className="mt-1 text-sm text-ink/65">{c.blurb}</p>
                </div>
                <span className="relative z-10 inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-forest">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                <div className="absolute -bottom-4 right-4 w-[38%] transition duration-700 group-hover:-translate-y-2 group-hover:rotate-[-3deg]">
                  {c.slug === "gift-hampers" ? <GiftBox product={p} className="w-full" /> : <Jar product={p} className="w-full" />}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
