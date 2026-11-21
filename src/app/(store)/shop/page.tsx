import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/primitives";
import { ShopView } from "@/components/products/ShopView";

export const metadata: Metadata = { title: "Shop All Mukhwas", description: "Browse our full collection of small-batch mukhwas — saunf, paan, rose, sweet, sugar-free and gift hampers." };

export default function ShopPage() {
  return (
    <>
      <PageHero eyebrow="The collection" title={<>Shop all <em className="text-emerald">mukhwas</em></>} intro="Mukhwas mixes, candies, roasted seeds and combo boxes. Filter by taste, price or category." />
      <Suspense fallback={<div className="container py-20 text-center text-sm text-ink/50">Loading products…</div>}>
        <ShopView />
      </Suspense>
    </>
  );
}
