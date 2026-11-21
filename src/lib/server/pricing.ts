import "server-only";
import { productById } from "@/data/products";
import { evaluateCoupon, shippingFor } from "@/lib/utils";
import { brand } from "@/config/brand";
import type { CartItem, OrderLine } from "@/types";

/**
 * Authoritative server-side pricing. Never trust totals sent from the browser.
 * When Supabase is connected, read products/coupons/stock from the database here.
 */
export function priceCart(items: CartItem[], couponCode: string | null, method: "cod" | "razorpay" | "upi") {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new Error("Cart is empty or invalid.");
  const lines: OrderLine[] = items.map((i) => {
    const p = productById(String(i.productId));
    const v = p?.variants.find((x) => x.id === String(i.variantId));
    const qty = Math.floor(Number(i.qty));
    if (!p || !v) throw new Error("A product in your cart is no longer available.");
    if (!(qty >= 1 && qty <= 20)) throw new Error("Invalid quantity.");
    if (v.stock < qty) throw new Error(`${p.name} (${v.label}) has only ${v.stock} left.`);
    return { productId: p.id, variantId: v.id, name: p.name, variant: v.label, qty, price: v.price };
  });
  const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const c = couponCode ? evaluateCoupon(couponCode, subtotal) : { discount: 0 };
  const discount = c.discount;
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const shipping = shippingFor(subtotal - discount, count);
  const codFee = method === "cod" ? brand.commerce.codFee : 0;
  return { lines, subtotal, discount, shipping, codFee, total: subtotal - discount + shipping + codFee, coupon: discount ? couponCode : null };
}

export const razorpayConfigured = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
