"use client";
import { useShop } from "@/lib/store";
import { productById } from "@/data/products";
import type { Order } from "@/types";

export function useReorder() {
  const { addToCart, setCartOpen, showToast } = useShop.getState();
  return (o: Order) => {
    let added = 0;
    o.lines.forEach((l) => {
      const v = productById(l.productId)?.variants.find((x) => x.id === l.variantId);
      if (v && v.stock > 0) { addToCart(l.productId, l.variantId, Math.min(l.qty, v.stock)); added++; }
    });
    showToast(added === o.lines.length ? "Items added to your cart" : added ? "Some items are out of stock — the rest were added" : "These items are currently out of stock");
    if (added) setCartOpen(true);
  };
}
