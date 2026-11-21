"use client";
import Link from "next/link";
import { useState } from "react";
import { BarChart3, Boxes, ExternalLink, FolderTree, Image as ImageIcon, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, Package, RotateCcw, ShoppingCart, Tag, Users, X } from "lucide-react";
import { useAdmin } from "@/lib/adminStore";
import { useHydrated } from "@/hooks/useCart";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";
import { Button, Field } from "@/components/ui/primitives";
import * as M from "./modules";

export const sections = [
  { id: "", label: "Overview", icon: LayoutDashboard, C: M.Overview },
  { id: "products", label: "Products", icon: Package, C: M.Products },
  { id: "orders", label: "Orders", icon: ShoppingCart, C: M.Orders },
  { id: "inventory", label: "Inventory", icon: Boxes, C: M.Inventory },
  { id: "categories", label: "Categories", icon: FolderTree, C: M.Categories },
  { id: "coupons", label: "Coupons", icon: Tag, C: M.Coupons },
  { id: "customers", label: "Customers", icon: Users, C: M.Customers },
  { id: "reviews", label: "Reviews", icon: MessageSquare, C: M.Reviews },
  { id: "banners", label: "Homepage banners", icon: ImageIcon, C: M.Banners },
  { id: "enquiries", label: "Bulk enquiries", icon: Mail, C: M.Enquiries },
  { id: "reports", label: "Reports", icon: BarChart3, C: M.Reports },
] as const;

function AdminLogin() {
  const login = useAdmin((s) => s.login);
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-forest p-4">
      <form onSubmit={(e) => { e.preventDefault(); if (!email || pw.length < 4) return setErr("Enter an email and a password (min 4 chars)."); login(); }} className="w-full max-w-sm rounded-3xl bg-ivory p-8 shadow-lift">
        <p className="font-serif text-2xl tracking-[.3em] text-forest">{brand.name}</p>
        <h1 className="mt-6 font-serif text-3xl text-forest">Admin sign in</h1>
        <div className="mt-6 space-y-4">
          <Field label="Email" name="aemail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} />
          <Field label="Password" name="apw" type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} error={err} />
          <Button className="w-full">Sign in</Button>
        </div>
        <p className="mt-5 rounded-xl bg-cream p-3 text-[11px] leading-relaxed text-ink/60">Demo gate only — <b>not security</b>. Before launch, protect /admin with Supabase Auth, a server-side role check (e.g. <code>profiles.role = &apos;admin&apos;</code>) in middleware and in every server action, plus RLS policies.</p>
      </form>
    </div>
  );
}

export function AdminApp({ section }: { section: string }) {
  const hydrated = useHydrated();
  const { authed, logout, reset } = useAdmin();
  const [nav, setNav] = useState(false);
  if (!hydrated) return <div className="grid min-h-screen place-items-center text-sm text-ink/50">Loading admin…</div>;
  if (!authed) return <AdminLogin />;
  const cur = sections.find((s) => s.id === section) ?? sections[0];
  const C = cur.C;

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6"><Link href="/admin" className="font-serif text-xl tracking-[.3em] text-ivory">{brand.name}</Link><span className="rounded-full bg-gold px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-forest">Admin</span></div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {sections.map(({ id, label, icon: Icon }) => (
          <li key={id}><Link href={`/admin${id ? `/${id}` : ""}`} onClick={() => setNav(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", cur.id === id ? "bg-ivory/10 text-ivory" : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory")}><Icon className="h-4 w-4" />{label}</Link></li>
        ))}
      </ul>
      <div className="space-y-1 border-t border-ivory/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ivory/60 hover:text-ivory"><ExternalLink className="h-4 w-4" />View store</Link>
        <button onClick={() => { if (confirm("Reset all demo admin data?")) reset(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ivory/60 hover:text-ivory"><RotateCcw className="h-4 w-4" />Reset demo data</button>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ivory/60 hover:text-ivory"><LogOut className="h-4 w-4" />Sign out</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F6F4EE]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-forest lg:block">{sidebar}</aside>
      {nav && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setNav(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-forest transition-transform lg:hidden", nav ? "translate-x-0" : "-translate-x-full")}>
        <button onClick={() => setNav(false)} aria-label="Close menu" className="absolute right-3 top-5 text-ivory"><X className="h-5 w-5" /></button>{sidebar}
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-forest/10 bg-[#F6F4EE]/90 px-4 backdrop-blur md:px-8">
          <button onClick={() => setNav(true)} aria-label="Open menu" className="lg:hidden"><Menu className="h-5 w-5 text-forest" /></button>
          <p className="hidden text-xs text-ink/50 sm:block">Demo data · changes are saved in this browser only and don&apos;t affect the storefront</p>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-xs text-ivory">AD</span>
        </header>
        <main className="p-4 md:p-8"><C /></main>
      </div>
    </div>
  );
}
