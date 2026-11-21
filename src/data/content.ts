import type { Coupon, Order, Review } from "@/types";

// DEMO REVIEWS — sample content for layout only. Replace with genuine customer reviews.
export const reviews: Review[] = [
  { id: "r1", name: "Ananya S.", city: "Mumbai", rating: 5, title: "Tastes like my nani's tray", body: "The Gujarati mix is exactly how I remember it. Fresh, fragrant and not overly sweet.", date: "2026-10-02", productSlug: "traditional-gujarati-mukhwas" },
  { id: "r2", name: "Rohan M.", city: "Bengaluru", rating: 5, title: "Beautiful gifting", body: "Ordered the gift collection for Diwali — the packaging got compliments from everyone.", date: "2026-10-28", productSlug: "premium-gift-collection" },
  { id: "r3", name: "Priya K.", city: "Delhi", rating: 4, title: "Paan done right", body: "Lovely paan flavour without being artificial. Would love a bigger jar size.", date: "2026-09-11", productSlug: "premium-paan-mukhwas" },
  { id: "r4", name: "Farhan A.", city: "Hyderabad", rating: 5, title: "My after-lunch ritual", body: "The Royal Saunf is clean and aromatic. I keep a jar on my desk.", date: "2026-08-19", productSlug: "royal-saunf-mukhwas" },
  { id: "r5", name: "Meera J.", city: "Ahmedabad", rating: 5, title: "Rose petal is stunning", body: "Delicate, floral and looks gorgeous in the jar. Perfect for guests.", date: "2026-10-15", productSlug: "rose-petal-mukhwas" },
  { id: "r6", name: "Karan T.", city: "Pune", rating: 4, title: "Great crunch", body: "Sweet Mix brought back childhood memories. Kids love it too.", date: "2026-07-30", productSlug: "sweet-mix-mukhwas" },
];

// DEMO COUPONS — must be validated server-side once backend is connected.
export const coupons: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, minOrder: 0, active: true, description: "10% off your first order" },
  { code: "FESTIVE200", type: "flat", value: 200, minOrder: 1499, active: true, description: "₹200 off orders above ₹1,499" },
  { code: "GIFT15", type: "percent", value: 15, minOrder: 2500, active: true, description: "15% off orders above ₹2,500" },
];

export const ingredients = [
  { name: "Fennel Seeds", hindi: "Saunf", note: "Sweet, anise-like aroma — the heart of most mukhwas.", tone: "#8FAE6E", seed: "#5F7F41", shape: "long" },
  { name: "Sesame Seeds", hindi: "Til", note: "Toasty and nutty when slow-roasted.", tone: "#EADBB8", seed: "#B39A63", shape: "drop" },
  { name: "Coriander Seeds", hindi: "Dhana Dal", note: "Split and roasted for a citrusy crunch.", tone: "#D2B47A", seed: "#9A7A3F", shape: "round" },
  { name: "Cardamom", hindi: "Elaichi", note: "Green pods with a bright, floral perfume.", tone: "#A9C08A", seed: "#6E8B4E", shape: "pod" },
  { name: "Coconut", hindi: "Nariyal", note: "Dried and shaved for a gentle sweetness.", tone: "#F3EDE0", seed: "#CDBFA3", shape: "flake" },
  { name: "Rose Petals", hindi: "Gulab", note: "Sun-dried for a delicate floral finish.", tone: "#E3A3AA", seed: "#A8485A", shape: "petal" },
  { name: "Natural Spices", hindi: "Masale", note: "Ajwain, black salt and more, balanced by hand.", tone: "#C29A68", seed: "#6E5333", shape: "round" },
] as const;

export const statusFlow = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"] as const;
export const statusLabel: Record<string, string> = {
  placed: "Order Placed", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped",
  out_for_delivery: "Out for Delivery", delivered: "Delivered", cancelled: "Cancelled",
};

// DEMO ORDERS — tracking is simulated until Shiprocket is configured.
const addr = { name: "Demo Customer", phone: "9000000000", line1: "12, Demo Residency, MG Road", city: "Mumbai", state: "Maharashtra", pin: "400001" };
export const demoOrders: Order[] = [
  {
    id: "o1", number: "MK-10428", date: "2026-11-14", status: "shipped",
    lines: [
      { productId: "p1", variantId: "p1-1", name: "Royal Saunf Mukhwas", variant: "250 g", qty: 1, price: 549 },
      { productId: "p3", variantId: "p3-0", name: "Premium Paan Mukhwas", variant: "100 g", qty: 2, price: 299 },
    ],
    subtotal: 1147, discount: 0, shipping: 0, total: 1147, payment: { method: "razorpay", status: "paid" }, address: addr, email: "demo@example.com",
    tracking: { courier: "Demo Courier", awb: "DEMO123456789", events: [
      { status: "placed", date: "2026-11-14 10:12", note: "Order placed" },
      { status: "confirmed", date: "2026-11-14 11:40", note: "Payment confirmed" },
      { status: "processing", date: "2026-11-15 09:05", note: "Packed at warehouse" },
      { status: "shipped", date: "2026-11-16 17:30", note: "Handed to courier — in transit" },
    ] },
  },
  {
    id: "o2", number: "MK-10311", date: "2026-10-22", status: "delivered",
    lines: [{ productId: "p8", variantId: "p8-0", name: "Premium Gift Collection", variant: "Box of 6", qty: 1, price: 1899 }],
    subtotal: 1899, discount: 200, shipping: 0, total: 1699, payment: { method: "cod", status: "paid" }, address: addr, email: "demo@example.com",
    tracking: { courier: "Demo Courier", awb: "DEMO987654321", events: [
      { status: "placed", date: "2026-10-22 18:02", note: "Order placed" },
      { status: "confirmed", date: "2026-10-22 18:30", note: "Order confirmed" },
      { status: "processing", date: "2026-10-23 10:00", note: "Packed" },
      { status: "shipped", date: "2026-10-23 16:45", note: "Shipped" },
      { status: "out_for_delivery", date: "2026-10-25 08:20", note: "Out for delivery" },
      { status: "delivered", date: "2026-10-25 13:10", note: "Delivered" },
    ] },
  },
  {
    id: "o3", number: "MK-10502", date: "2026-11-19", status: "processing",
    lines: [{ productId: "p2", variantId: "p2-1", name: "Sweet Mix Mukhwas", variant: "250 g", qty: 2, price: 449 }],
    subtotal: 898, discount: 0, shipping: 79, total: 977, payment: { method: "cod", status: "pending" },
    address: { ...addr, name: "Sample Buyer", city: "Pune", state: "Maharashtra", pin: "411001" }, email: "buyer@example.com",
    tracking: { courier: "Pending assignment", awb: "—", events: [
      { status: "placed", date: "2026-11-19 12:00", note: "Order placed" },
      { status: "confirmed", date: "2026-11-19 12:15", note: "COD confirmed" },
      { status: "processing", date: "2026-11-20 09:30", note: "Being packed" },
    ] },
  },
];

export const indianStates = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu & Kashmir", "Other",
];
