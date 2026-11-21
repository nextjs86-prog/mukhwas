import type { Product } from "@/types";

/**
 * Product catalogue. Photos are in /public/images/products.
 * PRICES, WEIGHTS, STOCK, RATINGS AND INGREDIENT LISTS ARE PLACEHOLDERS — confirm with the actual labels before launch.
 */
const v = (id: string, rows: [string, number, number, number, number][]) =>
  rows.map(([label, grams, price, mrp, stock], i) => ({ id: `${id}-${i}`, label, grams, price, mrp, stock }));
const img = (...names: string[]) => names.map((n) => `/images/products/${n}.jpg`);
const pal = (fill: string, seed: string) => ({ jar: "#EEF0EC", fill, seed, label: "#9E1B1F" });
const std = (id: string, price: number) => v(id, [["1 bottle", 200, price, Math.round(price * 1.2), 40], ["Pack of 3", 600, price * 3 - 30, Math.round(price * 3.6), 20]]);

type Seed = Omit<Product, "variants" | "rating" | "reviewCount" | "createdAt" | "popularity"> & { price: number; pop: number; date: string };
const seed: Seed[] = [
  { id: "p1", slug: "jet-imli", name: "Jet Imli", category: "candy", price: 99, pop: 99, date: "2026-09-01", bestSeller: true,
    short: "Khatti-meethi imli goli — tangy, chatpata, individually wrapped.",
    description: "Classic tamarind candies with a sweet-sour masala kick. Each piece is individually wrapped, so a bottle stays fresh in your bag, car or desk drawer.",
    ingredients: ["Tamarind (imli)", "Sugar", "Jaggery", "Black salt", "Spices"], notes: ["Tangy", "Chatpata", "Wrapped"],
    images: img("jet-imli"), palette: pal("#5B3A2E", "#3A2219") },
  { id: "p2", slug: "royal-mukhwas", name: "Royal Mukhwas", category: "mukhwas", price: 109, pop: 97, date: "2026-08-12", bestSeller: true,
    short: "Roasted dhana dal with chocolate-coated saunf — a rich after-meal mix.",
    description: "Crunchy roasted dhana dal tossed with chocolate-coated fennel. Our most-loved everyday mukhwas for the dining table.",
    ingredients: ["Dhana dal (coriander split)", "Chocolate-coated saunf", "Sugar", "Salt"], notes: ["Crunchy", "Chocolatey", "Roasted"],
    images: img("royal-mukhwas", "bowl-royal"), palette: pal("#C9955E", "#4A2C1C") },
  { id: "p3", slug: "pan-heart", name: "Pan Heart", category: "candy", price: 99, pop: 92, date: "2026-07-20", bestSeller: true,
    short: "Heart-shaped paan-flavour candies with a sugary crust.",
    description: "Sweet, cooling paan-flavoured candies shaped like little hearts. A favourite with kids and grown-ups after a heavy meal.",
    ingredients: ["Sugar", "Liquid glucose", "Paan flavour", "Permitted colour"], notes: ["Paan", "Sweet", "Cooling"],
    images: img("pan-heart"), palette: pal("#E58A92", "#B44A57") },
  { id: "p4", slug: "mix-mukhwas", name: "Mix Mukhwas", category: "mukhwas", price: 99, pop: 95, date: "2026-06-02", bestSeller: true,
    short: "Saunf, dhana dal and colourful sugar balls — the classic party mix.",
    description: "A bright medley of fennel, dhana dal, sugar-coated saunf and candied bits. Exactly what you'd find in a silver bowl at a wedding.",
    ingredients: ["Saunf (fennel)", "Dhana dal", "Sugar-coated saunf", "Til", "Sugar", "Permitted colour"], notes: ["Colourful", "Sweet", "Festive"],
    images: img("mix-mukhwas", "bowl-mix"), palette: pal("#B7A26A", "#E07A3E") },
  { id: "p5", slug: "chocolate-mukhwas", name: "Chocolate Mukhwas", category: "mukhwas", price: 119, pop: 90, date: "2026-10-05", isNew: true,
    short: "Chocolate-coated saunf, mint balls and dhana dal.",
    description: "A modern twist on mukhwas — chocolate-coated fennel with cool mint sugar balls and roasted dhana dal.",
    ingredients: ["Chocolate-coated saunf", "Mint sugar balls", "Dhana dal", "Sugar"], notes: ["Chocolate", "Mint", "Crunchy"],
    images: img("chocolate-mukhwas", "bowl-chocolate"), palette: pal("#5A3B2B", "#9CCB8C") },
  { id: "p6", slug: "mouth-fresh", name: "Mouth Fresh", category: "mukhwas", price: 99, pop: 88, date: "2026-05-11",
    short: "Dhana dal, saunf, beetroot shreds and candy bits.",
    description: "A fragrant, colourful mouth freshener with roasted dhana dal, fennel and sweet candied pieces.",
    ingredients: ["Dhana dal", "Saunf", "Sugar-coated saunf", "Dried beetroot", "Sugar", "Permitted colour"], notes: ["Fresh", "Colourful", "Sweet"],
    images: img("mouth-fresh", "bowl-mouth-fresh"), palette: pal("#C9A46E", "#D9534F") },
  { id: "p7", slug: "rajasthani-mukhwas", name: "Rajasthani Mukhwas", category: "mukhwas", price: 99, pop: 86, date: "2026-04-18",
    short: "Saunf-heavy Rajasthani-style mix with colourful sugar saunf.",
    description: "Inspired by the mukhwas served in Rajasthani homes — plenty of fennel, til and bright sugar-coated saunf.",
    ingredients: ["Saunf", "Til", "Dhana dal", "Sugar-coated saunf", "Sugar", "Permitted colour"], notes: ["Saunf", "Traditional", "Sweet"],
    images: img("rajasthani-mukhwas", "bowl-rajasthani"), palette: pal("#A8A060", "#E46A8C") },
  { id: "p8", slug: "khana-khajana", name: "Khana Khajana", category: "mukhwas", price: 99, pop: 84, date: "2026-03-09",
    short: "Saunf, dhana dal and a few sweet surprises.",
    description: "A balanced after-meal mix of roasted saunf and dhana dal with a few sweet candied pieces.",
    ingredients: ["Saunf", "Dhana dal", "Sugar-coated saunf", "Sugar"], notes: ["Balanced", "Roasted", "Everyday"],
    images: img("khana-khajana"), palette: pal("#B8A06C", "#E37A3A") },
  { id: "p9", slug: "roasted-mukhwas", name: "Roasted Mukhwas", category: "mukhwas", price: 99, pop: 83, date: "2026-02-14",
    short: "Roasted saunf, til and dhana dal — light and aromatic.",
    description: "A savoury-leaning roasted mix of fennel, sesame and dhana dal. Light, aromatic and not too sweet.",
    ingredients: ["Saunf", "Til (sesame)", "Dhana dal", "Salt"], notes: ["Roasted", "Aromatic", "Light"],
    images: img("roasted-mukhwas", "bowl-roasted"), palette: pal("#A39A5E", "#6F6A34") },
  { id: "p10", slug: "ajwa-mukhwas", name: "Ajwa Mukhwas", category: "mukhwas", price: 99, pop: 80, date: "2026-01-21",
    short: "Dhana dal and saunf with a hint of ajwain.",
    description: "A roasted dhana dal and saunf mix finished with ajwain for a warm, spicy aroma.",
    ingredients: ["Dhana dal", "Saunf", "Ajwain", "Salt"], notes: ["Ajwain", "Warm", "Roasted"],
    images: img("ajwa-mukhwas", "bowl-dhana-til"), palette: pal("#C2A06A", "#7E6A3A") },
  { id: "p11", slug: "dhana-dal", name: "Dhana Dal", category: "seeds", price: 89, pop: 78, date: "2025-12-02",
    short: "Pure roasted dhana dal — crunchy and nutty.",
    description: "Split coriander seeds, roasted until crisp and nutty. Enjoy on its own or mix into your favourite blend.",
    ingredients: ["Dhana dal (coriander split)", "Salt"], notes: ["Nutty", "Crunchy", "Simple"],
    images: img("dhana-dal"), palette: pal("#C9955E", "#8A5B2E") },
  { id: "p12", slug: "roasted-til", name: "Roasted Til", category: "seeds", price: 89, pop: 74, date: "2025-11-15",
    short: "Toasted sesame with a few crunchy nuts.",
    description: "Golden roasted sesame seeds with a light seasoning — toasty, nutty and moreish.",
    ingredients: ["Til (sesame)", "Peanuts", "Salt", "Spices"], notes: ["Toasty", "Nutty", "Savoury"],
    images: img("roasted-til"), palette: pal("#BFAE6A", "#8C7A3A") },
  { id: "p13", slug: "roasted-alsi", name: "Roasted Alsi", category: "seeds", price: 89, pop: 76, date: "2025-11-01",
    short: "Plain roasted flax seeds.",
    description: "Whole flax seeds (alsi), roasted for a gentle crunch. A simple, savoury after-meal habit.",
    ingredients: ["Alsi (flax seeds)", "Salt"], notes: ["Plain", "Roasted", "Crunchy"],
    images: img("roasted-alsi"), palette: pal("#6B4A33", "#4A3122") },
  { id: "p14", slug: "sweet-alsi-mukhwas", name: "Sweet Alsi Mukhwas", category: "seeds", price: 99, pop: 79, date: "2026-03-28",
    short: "Alsi and saunf with sweet yellow sugar balls.",
    description: "Roasted flax and fennel with a sweet finish of yellow sugar-coated saunf.",
    ingredients: ["Alsi (flax seeds)", "Saunf", "Til", "Sugar-coated saunf", "Sugar"], notes: ["Sweet", "Alsi", "Saunf"],
    images: img("sweet-alsi-mukhwas", "bowl-sweet-alsi"), palette: pal("#8C7346", "#E3C640") },
  { id: "p15", slug: "lemon-alsi-mukhwas", name: "Lemon Alsi Mukhwas", category: "seeds", price: 99, pop: 72, date: "2026-02-03",
    short: "Alsi, til and saunf with a tangy lemon finish.",
    description: "Roasted flax seeds, sesame and fennel, seasoned with lemon and salt for a tangy bite.",
    ingredients: ["Alsi (flax seeds)", "Til", "Saunf", "Lemon", "Salt"], notes: ["Lemony", "Tangy", "Alsi"],
    images: img("lemon-alsi-mukhwas"), palette: pal("#7A6244", "#C9B060") },
  { id: "p16", slug: "alsi-gotli", name: "Alsi Gotli", category: "seeds", price: 99, pop: 70, date: "2025-10-20",
    short: "Alsi with roasted mango-seed (gotli) pieces.",
    description: "Roasted flax seeds mixed with crunchy mango-seed (gotli) pieces — a traditional chatpata combination.",
    ingredients: ["Alsi (flax seeds)", "Mango seed (gotli)", "Til", "Salt", "Spices"], notes: ["Chatpata", "Traditional", "Roasted"],
    images: img("alsi-gotli"), palette: pal("#6B4A33", "#C9A060") },
  { id: "p17", slug: "kala-khatta", name: "Kala Khatta", category: "candy", price: 99, pop: 87, date: "2026-08-30", isNew: true,
    short: "Tangy kala khatta candies dusted with masala.",
    description: "The taste of a kala khatta gola in candy form — sweet, sour and dusted with chatpata masala.",
    ingredients: ["Sugar", "Kala khatta flavour", "Black salt", "Citric acid", "Permitted colour"], notes: ["Khatta", "Chatpata", "Candy"],
    images: img("kala-khatta"), palette: pal("#5E4A6B", "#3A2A44") },
  { id: "p18", slug: "tini-mini", name: "Tini Mini", category: "candy", price: 89, pop: 82, date: "2026-07-05",
    short: "Colourful sugar-coated saunf — tiny, sweet and fun.",
    description: "Pastel sugar-coated fennel seeds. Sweet, crunchy and a hit with kids.",
    ingredients: ["Saunf (fennel)", "Sugar", "Permitted colour"], notes: ["Sweet", "Colourful", "Kids' favourite"],
    images: img("tini-mini"), palette: pal("#F0B6C4", "#E8C35A") },
];

const singles: Product[] = seed.map(({ price, pop, date, ...p }) => ({
  ...p, cutout: `/images/products/cut/${p.slug}.png`, variants: std(p.id, price), rating: 4.5 + (pop % 5) / 10, reviewCount: 20 + pop, createdAt: date, popularity: pop,
}));

/** Combo gift boxes (4 bottles each). Prices are placeholders. */
const combo = (id: string, slug: string, name: string, ids: string[], price: number, short: string): Product => ({
  id, slug, name, category: "gift-hampers", combo: ids, short,
  description: `${short} Four bottles packed in a gift box — perfect for parties, festivals and gifting.`,
  ingredients: ids.map((i) => singles.find((s) => s.id === i)!.name), notes: ["Combo", "Gift box", "Value pack"],
  images: ids.map((i) => singles.find((s) => s.id === i)!.images![0]), palette: pal("#C9955E", "#4A2C1C"),
  variants: v(id, [["Box of 4", 800, price, Math.round(price * 1.25), 25]]), rating: 4.9, reviewCount: 64, bestSeller: true, isNew: true, createdAt: "2026-11-01", popularity: 96,
});
const combos = [
  combo("c1", "candy-combo", "Candy Combo", ["p1", "p3", "p17", "p18"], 349, "Jet Imli, Pan Heart, Kala Khatta and Tini Mini — the full goli party."),
  combo("c2", "mukhwas-combo", "Mukhwas Combo", ["p2", "p4", "p5", "p7"], 399, "Royal, Mix, Chocolate and Rajasthani mukhwas in one box."),
  combo("c3", "alsi-combo", "Alsi & Seeds Combo", ["p13", "p14", "p15", "p16"], 349, "Roasted, Sweet, Lemon Alsi and Alsi Gotli together."),
];

// Carousel order: a combo after every few singles.
const ACCENT: Record<string, string> = {"jet-imli": "#7A3E28", "royal-mukhwas": "#B8702A", "pan-heart": "#D93A5E", "mix-mukhwas": "#E2641F", "chocolate-mukhwas": "#5C3322", "mouth-fresh": "#C7402F", "rajasthani-mukhwas": "#D97C1E", "khana-khajana": "#B5832A", "roasted-mukhwas": "#6F7F2A", "ajwa-mukhwas": "#A06F2E", "dhana-dal": "#B0682C", "roasted-til": "#A88A22", "roasted-alsi": "#6B432C", "sweet-alsi-mukhwas": "#C99A12", "lemon-alsi-mukhwas": "#8E9A1E", "alsi-gotli": "#8A532A", "kala-khatta": "#5E2F7A", "tini-mini": "#E0508A", "candy-combo": "#D93A5E", "mukhwas-combo": "#E2641F", "alsi-combo": "#6B432C"};

const ordered: Product[] = [
  ...singles.slice(0, 2), combos[0], ...singles.slice(2, 6), combos[1], ...singles.slice(6, 11), combos[2], ...singles.slice(11),
];
export const products: Product[] = ordered.map((p) => ({ ...p, accent: ACCENT[p.slug] ?? "#D7262E" }));

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const productById = (id: string) => products.find((p) => p.id === id);
export const minPrice = (p: { variants: { price: number }[] }) => Math.min(...p.variants.map((x) => x.price));
export const inStock = (p: { variants: { stock: number }[] }) => p.variants.some((x) => x.stock > 0);
