"use client";
import { useEffect, useMemo, useState } from "react";
import { useShop } from "@/lib/store";
import { productById } from "@/data/products";
import { evaluateCoupon, shippingFor } from "@/lib/utils";

/** Returns true after the persisted store has rehydrated on the client (avoids hydration mismatch). */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export function useCartTotals() {
  const cart = useShop((s) => s.cart);
  const code = useShop((s) => s.coupon);
  return useMemo(() => {
    const lines = cart
      .map((c) => {
        const product = productById(c.productId);
        const variant = product?.variants.find((v) => v.id === c.variantId);
        return product && variant ? { ...c, product, variant, total: variant.price * c.qty } : null;
      })
      .filter((x): x is NonNullable<typeof x> => !!x);
    const subtotal = lines.reduce((a, l) => a + l.total, 0);
    const mrpTotal = lines.reduce((a, l) => a + l.variant.mrp * l.qty, 0);
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const coupon = code ? evaluateCoupon(code, subtotal) : { discount: 0 };
    const discount = coupon.discount;
    const shipping = shippingFor(subtotal - discount, count);
    return { lines, subtotal, mrpTotal, count, discount, couponError: "error" in coupon ? coupon.error : undefined, shipping, total: subtotal - discount + shipping, code };
  }, [cart, code]);
}
