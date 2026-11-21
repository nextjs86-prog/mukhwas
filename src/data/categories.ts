import type { Category } from "@/types";

export const categories: Category[] = [
  { slug: "mukhwas", name: "Mukhwas Mixes", blurb: "Royal, mix, Rajasthani & more", tone: "#C9955E" },
  { slug: "candy", name: "Candies & Goli", blurb: "Jet Imli, Pan Heart, Kala Khatta", tone: "#D9534F" },
  { slug: "seeds", name: "Alsi, Til & Dhana Dal", blurb: "Roasted seeds, simple & crunchy", tone: "#806347" },
  { slug: "gift-hampers", name: "Gift Hampers", blurb: "Combos for every occasion", tone: "#9E1B1F" },
];

export const categoryBySlug = (s: string) => categories.find((c) => c.slug === s);
