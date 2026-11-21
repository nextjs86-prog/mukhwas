import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics = ["", "/shop", "/categories", "/about", "/gifts", "/contact", "/orders/track", "/policies/shipping", "/policies/returns", "/policies/privacy", "/policies/terms", "/policies/faq"];
  return [
    ...statics.map((p) => ({ url: `${brand.url}${p}`, lastModified: now, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${brand.url}/categories/${c.slug}`, lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({ url: `${brand.url}/product/${p.slug}`, lastModified: now, priority: 0.9 })),
  ];
}
