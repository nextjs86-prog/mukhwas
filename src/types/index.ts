export type CategorySlug =
  | "mukhwas" | "candy" | "seeds" | "gift-hampers";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  tone: string; // accent colour for visual
}

export interface Variant { id: string; label: string; grams: number; price: number; mrp: number; stock: number; }

export interface Review { id: string; name: string; city: string; rating: number; title: string; body: string; date: string; productSlug?: string; }

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  short: string;
  description: string;
  ingredients: string[];
  notes: string[]; // flavour notes
  variants: Variant[];
  rating: number;
  reviewCount: number;
  bestSeller?: boolean;
  isNew?: boolean;
  createdAt: string;
  popularity: number;
  palette: { jar: string; fill: string; seed: string; label: string };
  images?: string[]; // real photography URLs — replace placeholders
  accent?: string; // product's own colour (taken from its contents) used for its page + carousel
  combo?: string[]; // product ids shown inside a combo gift box
  cutout?: string; // transparent PNG used in scenes (carousel, pantry, product hero)
}

export interface CartItem { productId: string; variantId: string; qty: number; }

export type OrderStatus = "placed" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export interface Address { id: string; name: string; phone: string; line1: string; city: string; state: string; pin: string; isDefault?: boolean; }

export interface OrderLine { productId: string; variantId: string; name: string; variant: string; qty: number; price: number; }

export interface Order {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment: { method: "cod" | "razorpay" | "upi"; status: "pending" | "paid" | "failed" };
  address: Omit<Address, "id">;
  email: string;
  tracking?: { courier: string; awb: string; events: { status: OrderStatus; date: string; note: string }[] };
}

export interface Coupon { code: string; type: "percent" | "flat"; value: number; minOrder: number; active: boolean; description: string; }
