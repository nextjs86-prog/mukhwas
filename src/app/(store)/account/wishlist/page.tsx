"use client";
import { Heart } from "lucide-react";
import { useShop } from "@/lib/store";
import { productById } from "@/data/products";
import { AccountShell } from "@/components/account/AccountShell";
import { ButtonLink, EmptyState } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/products/ProductCard";
import type { Product } from "@/types";

function Wishlist() {
  const ids = useShop((s) => s.wishlist);
  const items = ids.map(productById).filter((p): p is Product => !!p);
  if (!items.length) return <EmptyState icon={<Heart className="h-6 w-6" />} title="Your wishlist is empty" body="Tap the heart on any product to save it here." action={<ButtonLink href="/shop">Browse blends</ButtonLink>} />;
  return <ProductGrid products={items} cols={3} />;
}

// Wishlist works for guests too (stored locally).
export default function Page() { return <AccountShell title="Wishlist" allowGuest><Wishlist /></AccountShell>; }
