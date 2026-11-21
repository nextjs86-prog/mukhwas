"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Address, CartItem, Order } from "@/types";
import { demoOrders } from "@/data/content";

/**
 * Local demo store, persisted to localStorage.
 * When Supabase is connected, cart/wishlist/orders should sync to the server
 * and auth must come from Supabase Auth — this demo auth is NOT secure.
 */
interface User { name: string; email: string; phone?: string }

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  recent: string[];
  coupon: string | null;
  user: User | null;
  addresses: Address[];
  orders: Order[];
  cartOpen: boolean;
  quickView: string | null;
  toast: string | null;
  addToCart: (productId: string, variantId: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  pushRecent: (productId: string) => void;
  setCoupon: (c: string | null) => void;
  login: (u: User) => void;
  logout: () => void;
  updateProfile: (u: Partial<User>) => void;
  saveAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  addOrder: (o: Order) => void;
  setCartOpen: (b: boolean) => void;
  setQuickView: (id: string | null) => void;
  showToast: (t: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [], wishlist: [], recent: [], coupon: null, user: null, addresses: [], orders: [],
      cartOpen: false, quickView: null, toast: null,
      addToCart: (productId, variantId, qty = 1) => {
        const cart = [...get().cart];
        const i = cart.findIndex((c) => c.productId === productId && c.variantId === variantId);
        if (i >= 0) cart[i] = { ...cart[i], qty: Math.min(cart[i].qty + qty, 20) };
        else cart.push({ productId, variantId, qty });
        set({ cart });
      },
      setQty: (productId, variantId, qty) =>
        set({ cart: get().cart.map((c) => (c.productId === productId && c.variantId === variantId ? { ...c, qty: Math.max(1, Math.min(qty, 20)) } : c)) }),
      removeFromCart: (productId, variantId) =>
        set({ cart: get().cart.filter((c) => !(c.productId === productId && c.variantId === variantId)) }),
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWishlist: (id) => {
        const has = get().wishlist.includes(id);
        set({ wishlist: has ? get().wishlist.filter((x) => x !== id) : [...get().wishlist, id] });
        get().showToast(has ? "Removed from wishlist" : "Saved to wishlist");
      },
      pushRecent: (id) => set({ recent: [id, ...get().recent.filter((x) => x !== id)].slice(0, 8) }),
      setCoupon: (coupon) => set({ coupon }),
      login: (user) => set({ user, orders: get().orders.length ? get().orders : demoOrders }),
      logout: () => set({ user: null }),
      updateProfile: (u) => { const cur = get().user; if (cur) set({ user: { ...cur, ...u } }); },
      saveAddress: (a) => {
        let list = get().addresses.filter((x) => x.id !== a.id);
        if (a.isDefault || list.length === 0) { list = list.map((x) => ({ ...x, isDefault: false })); a = { ...a, isDefault: true }; }
        set({ addresses: [...list, a] });
      },
      removeAddress: (id) => set({ addresses: get().addresses.filter((x) => x.id !== id) }),
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setQuickView: (quickView) => set({ quickView }),
      showToast: (toast) => {
        set({ toast });
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => set({ toast: null }), 2600);
      },
    }),
    {
      name: "mukhwas-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, recent: s.recent, coupon: s.coupon, user: s.user, addresses: s.addresses, orders: s.orders }),
    }
  )
);
