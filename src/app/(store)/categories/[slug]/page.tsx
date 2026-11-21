import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryBySlug } from "@/data/categories";
import { PageHero } from "@/components/ui/primitives";
import { ShopView } from "@/components/products/ShopView";

export function generateStaticParams() { return categories.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = categoryBySlug((await params).slug);
  return c ? { title: c.name, description: `${c.name} — ${c.blurb}. Small-batch Indian mukhwas.` } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = categoryBySlug((await params).slug);
  if (!c) notFound();
  return (
    <>
      <PageHero eyebrow="Collection" title={c.name} intro={c.blurb}>
        <nav aria-label="Other categories" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4">
          {categories.map((x) => (
            <Link key={x.slug} href={`/categories/${x.slug}`} className={`shrink-0 rounded-full border px-4 py-2 text-xs ${x.slug === c.slug ? "border-forest bg-forest text-ivory" : "border-forest/20 text-forest hover:border-forest"}`}>{x.name}</Link>
          ))}
        </nav>
      </PageHero>
      <Suspense><ShopView lockedCategory={c.slug} /></Suspense>
    </>
  );
}
