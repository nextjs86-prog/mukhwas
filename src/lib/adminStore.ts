"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products as seedProducts } from "@/data/products";
import { categories as seedCategories } from "@/data/categories";
import { coupons as seedCoupons, demoOrders, reviews as seedReviews } from "@/data/content";
import type { Category, Coupon, Order, OrderStatus, Product, Review } from "@/types";

/**
 * DEMO admin data store (localStorage). Changes here do NOT affect the storefront
 * and are not secure. Replace with Supabase tables + RLS + role-checked server actions.
 */
export interface Banner { id: string; title: string; subtitle: string; cta: string; href: string; active: boolean }
export interface Enquiry { id: string; name: string; email: string; type: string; qty?: string; message: string; date: string; status: "new" | "contacted" | "closed" }
export interface AdminReview extends Review { status: "pending" | "approved" | "rejected" }
export interface Customer { id: string; name: string; email: string; phone: string; city: string; orders: number; spent: number; joined: string }

const moreOrders: Order[] = Array.from({ length: 9 }, (_, i) => {
  const p = seedProducts[i % 8]; const v = p.variants[0]; const qty = (i % 3) + 1;
  const statuses: OrderStatus[] = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "delivered", "cancelled", "placed"];
  const sub = v.price * qty;
  return {
    id: `x${i}`, number: `MK-${10200 + i * 17}`, date: `2026-11-${String(18 - i).padStart(2, "0")}`, status: statuses[i],
    lines: [{ productId: p.id, variantId: v.id, name: p.name, variant: v.label, qty, price: v.price }],
    subtotal: sub, discount: 0, shipping: sub >= 999 ? 0 : 79, total: sub + (sub >= 999 ? 0 : 79),
    payment: { method: i % 2 ? "cod" : "razorpay", status: statuses[i] === "delivered" || i % 2 === 0 ? "paid" : "pending" },
    address: { name: ["Aarav P.", "Isha R.", "Kabir S.", "Diya M.", "Vihaan K.", "Saanvi T.", "Arjun N.", "Myra G.", "Reyansh B."][i], phone: "9000000000", line1: "Demo address", city: ["Mumbai", "Delhi", "Pune", "Jaipur", "Surat", "Chennai", "Kolkata", "Indore", "Lucknow"][i], state: "—", pin: "400001" },
    email: `customer${i}@example.com`,
  };
});

interface AdminState {
  authed: boolean;
  products: Product[]; orders: Order[]; categories: Category[]; coupons: Coupon[];
  reviews: AdminReview[]; banners: Banner[]; enquiries: Enquiry[]; customers: Customer[];
  login: () => void; logout: () => void;
  upsertProduct: (p: Product) => void; deleteProduct: (id: string) => void;
  setStock: (pid: string, vid: string, stock: number) => void;
  setOrderStatus: (num: string, s: OrderStatus) => void;
  upsertCategory: (c: Category) => void; deleteCategory: (slug: string) => void;
  upsertCoupon: (c: Coupon) => void; deleteCoupon: (code: string) => void;
  setReviewStatus: (id: string, s: AdminReview["status"]) => void;
  upsertBanner: (b: Banner) => void; deleteBanner: (id: string) => void;
  setEnquiryStatus: (id: string, s: Enquiry["status"]) => void;
  reset: () => void;
}

const seed = () => ({
  products: seedProducts, orders: [...demoOrders, ...moreOrders], categories: seedCategories, coupons: seedCoupons,
  reviews: seedReviews.map((r, i) => ({ ...r, status: (i < 4 ? "approved" : "pending") as AdminReview["status"] })),
  banners: [
    { id: "b1", title: "The art of the after-meal", subtitle: "Small-batch Indian mukhwas", cta: "Shop now", href: "/shop", active: true },
    { id: "b2", title: "Festive gifting is here", subtitle: "Hampers for Diwali & weddings", cta: "Explore hampers", href: "/gifts", active: false },
  ],
  enquiries: [
    { id: "e1", name: "Neha Events", email: "events@example.com", type: "wedding", qty: "250 favour jars", message: "Looking for personalised favour jars for a December wedding.", date: "2026-11-18", status: "new" as const },
    { id: "e2", name: "Acme Corp (demo)", email: "hr@example.com", type: "corporate", qty: "120 hampers", message: "Diwali hampers for employees with logo sleeves.", date: "2026-11-12", status: "contacted" as const },
    { id: "e3", name: "Rahul V.", email: "rahul@example.com", type: "bulk", qty: "20 kg", message: "Restaurant supply of Royal Saunf, monthly.", date: "2026-11-05", status: "closed" as const },
  ],
  customers: Array.from({ length: 10 }, (_, i) => ({ id: `c${i}`, name: ["Demo Customer", "Sample Buyer", "Aarav P.", "Isha R.", "Kabir S.", "Diya M.", "Vihaan K.", "Saanvi T.", "Arjun N.", "Myra G."][i], email: `user${i}@example.com`, phone: "9000000000", city: ["Mumbai", "Pune", "Mumbai", "Delhi", "Pune", "Jaipur", "Surat", "Chennai", "Kolkata", "Indore"][i], orders: 6 - (i % 5), spent: 5400 - i * 410, joined: `2026-0${(i % 9) + 1}-1${i % 9}` })),
});

export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => ({
      authed: false, ...seed(),
      login: () => set({ authed: true }), logout: () => set({ authed: false }),
      upsertProduct: (p) => set({ products: get().products.some((x) => x.id === p.id) ? get().products.map((x) => (x.id === p.id ? p : x)) : [p, ...get().products] }),
      deleteProduct: (id) => set({ products: get().products.filter((x) => x.id !== id) }),
      setStock: (pid, vid, stock) => set({ products: get().products.map((p) => (p.id === pid ? { ...p, variants: p.variants.map((v) => (v.id === vid ? { ...v, stock: Math.max(0, stock) } : v)) } : p)) }),
      setOrderStatus: (num, status) => set({ orders: get().orders.map((o) => (o.number === num ? { ...o, status } : o)) }),
      upsertCategory: (c) => set({ categories: get().categories.some((x) => x.slug === c.slug) ? get().categories.map((x) => (x.slug === c.slug ? c : x)) : [...get().categories, c] }),
      deleteCategory: (slug) => set({ categories: get().categories.filter((x) => x.slug !== slug) }),
      upsertCoupon: (c) => set({ coupons: get().coupons.some((x) => x.code === c.code) ? get().coupons.map((x) => (x.code === c.code ? c : x)) : [...get().coupons, c] }),
      deleteCoupon: (code) => set({ coupons: get().coupons.filter((x) => x.code !== code) }),
      setReviewStatus: (id, status) => set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, status } : r)) }),
      upsertBanner: (b) => set({ banners: get().banners.some((x) => x.id === b.id) ? get().banners.map((x) => (x.id === b.id ? b : x)) : [...get().banners, b] }),
      deleteBanner: (id) => set({ banners: get().banners.filter((x) => x.id !== id) }),
      setEnquiryStatus: (id, status) => set({ enquiries: get().enquiries.map((e) => (e.id === id ? { ...e, status } : e)) }),
      reset: () => set(seed()),
    }),
    { name: "mukhwas-admin", storage: createJSONStorage(() => localStorage) }
  )
);
