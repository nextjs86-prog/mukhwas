import { clsx, type ClassValue } from "clsx";
import { brand } from "@/config/brand";
import { coupons } from "@/data/content";
import type { Coupon } from "@/types";

export const cn = (...c: ClassValue[]) => clsx(c);

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const pctOff = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export const fmtDate = (d: string) =>
  new Date(d.replace(" ", "T")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** Client-side coupon preview. Final discount MUST be recomputed server-side. */
export function evaluateCoupon(code: string, subtotal: number): { coupon?: Coupon; discount: number; error?: string } {
  const c = coupons.find((x) => x.code === code.trim().toUpperCase() && x.active);
  if (!c) return { discount: 0, error: "This code isn't valid." };
  if (subtotal < c.minOrder) return { discount: 0, error: `Add ${inr(c.minOrder - subtotal)} more to use ${c.code}.` };
  const discount = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  return { coupon: c, discount: Math.min(discount, subtotal) };
}

export function shippingFor(subtotalAfterDiscount: number, items: number) {
  if (items === 0) return 0;
  return subtotalAfterDiscount >= brand.commerce.freeShippingThreshold ? 0 : brand.commerce.shippingFee;
}

export const validators = {
  required: (v: string, label = "This field") => (v.trim() ? "" : `${label} is required.`),
  email: (v: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."),
  phone: (v: string) => (/^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)) && v.replace(/\D/g, "").length >= 10 ? "" : "Enter a valid 10-digit Indian mobile number."),
  pin: (v: string) => (/^[1-9]\d{5}$/.test(v.trim()) ? "" : "Enter a valid 6-digit PIN code."),
  password: (v: string) => (v.length >= 8 ? "" : "Password must be at least 8 characters."),
};

/** Demo delivery estimate by PIN prefix. Replace with Shiprocket serviceability API. */
export function estimateDelivery(pin: string): { ok: boolean; days?: string; cod?: boolean; message: string } {
  if (!/^[1-9]\d{5}$/.test(pin)) return { ok: false, message: "Enter a valid 6-digit PIN code." };
  const zone = Number(pin[0]);
  const days = zone <= 4 ? "3–5" : zone <= 6 ? "4–6" : "5–8";
  return { ok: true, days, cod: zone !== 9, message: `Estimated delivery in ${days} business days (demo estimate).` };
}

export const statusTone = (s: string) =>
  s === "delivered" ? "bg-emerald-50 text-emerald" : s === "cancelled" ? "bg-red-50 text-red-700" : s === "shipped" || s === "out_for_delivery" ? "bg-gold/20 text-brown" : "bg-cream text-forest";
