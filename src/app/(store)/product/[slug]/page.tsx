import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, productBySlug, minPrice, inStock } from "@/data/products";
import { brand } from "@/config/brand";
import { EditorialProduct } from "@/components/products/EditorialProduct";

export function generateStaticParams() { return products.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = productBySlug((await params).slug);
  if (!p) return {};
  return { title: p.name, description: `${p.short} ${p.description}`.slice(0, 158), openGraph: { title: `${p.name} | ${brand.name}`, description: p.short, type: "website" } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = productBySlug((await params).slug);
  if (!p) notFound();
  // Structured data. Ratings omitted from schema because demo ratings are not genuine.
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, sku: p.id, brand: { "@type": "Brand", name: brand.name },
    offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: minPrice(p), highPrice: Math.max(...p.variants.map((v) => v.price)), availability: inStock(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EditorialProduct product={p} />
    </>
  );
}
