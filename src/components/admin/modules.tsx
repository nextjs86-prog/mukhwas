"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AlertTriangle, Check, Clock, IndianRupee, Package, Pencil, Plus, ShoppingCart, Trash2, Upload, Users, X } from "lucide-react";
import { useAdmin, type Banner } from "@/lib/adminStore";
import { statusFlow, statusLabel } from "@/data/content";
import type { Category, CategorySlug, Coupon, Order, OrderStatus, Product, Variant } from "@/types";
import { cn, fmtDate, inr } from "@/lib/utils";
import { Button, Field, Select, TextArea } from "@/components/ui/primitives";
import { ProductVisual } from "@/components/ui/Visuals";
import { Card, Modal, ModuleHeader, Pill, SearchInput, Table, Td, smallBtn } from "./ui";

const LOW = 10;
const orderTone = (s: OrderStatus): "good" | "bad" | "warn" | "neutral" => (s === "delivered" ? "good" : s === "cancelled" ? "bad" : s === "placed" ? "warn" : "neutral");
const totalStock = (p: Product) => p.variants.reduce((a, v) => a + v.stock, 0);

/* ───────────── Overview ───────────── */
export function Overview() {
  const { orders, products, customers } = useAdmin();
  const valid = orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.reduce((a, o) => a + o.total, 0);
  const pending = orders.filter((o) => ["placed", "confirmed", "processing"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "delivered").length;
  const low = products.flatMap((p) => p.variants.filter((v) => v.stock < LOW).map((v) => ({ p, v })));
  const kpis = [
    { l: "Total revenue", v: inr(revenue), icon: IndianRupee }, { l: "Total orders", v: orders.length, icon: ShoppingCart },
    { l: "Pending orders", v: pending, icon: Clock }, { l: "Completed orders", v: completed, icon: Check },
    { l: "Total customers", v: customers.length, icon: Users }, { l: "Low-stock variants", v: low.length, icon: AlertTriangle },
  ];
  return (
    <>
      <ModuleHeader title="Overview" desc="Store performance at a glance (demo data)." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map(({ l, v, icon: Icon }) => <Card key={l}><Icon className="h-5 w-5 text-gold" /><p className="mt-4 font-serif text-3xl text-forest">{v}</p><p className="text-xs text-ink/55">{l}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-xl text-forest">Recent orders</h2><Link href="/admin/orders" className="text-xs text-forest underline">View all</Link></div>
          <ul className="divide-y divide-forest/5 text-sm">
            {orders.slice(0, 6).map((o) => <li key={o.number} className="flex items-center justify-between gap-3 py-3"><span><b className="text-forest">{o.number}</b> <span className="text-ink/50">· {o.address.name}</span></span><span className="flex items-center gap-3"><span className="hidden sm:inline">{inr(o.total)}</span><Pill tone={orderTone(o.status)}>{statusLabel[o.status]}</Pill></span></li>)}
          </ul>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-xl text-forest">Low stock</h2><Link href="/admin/inventory" className="text-xs text-forest underline">Inventory</Link></div>
          {low.length === 0 ? <p className="text-sm text-ink/50">All variants are well stocked.</p> : (
            <ul className="space-y-3 text-sm">{low.map(({ p, v }) => <li key={v.id} className="flex justify-between"><span>{p.name} <span className="text-ink/50">· {v.label}</span></span><Pill tone={v.stock === 0 ? "bad" : "warn"}>{v.stock === 0 ? "Out" : `${v.stock} left`}</Pill></li>)}</ul>
          )}
        </Card>
      </div>
    </>
  );
}

/* ───────────── Products ───────────── */
const blankProduct = (): Product => ({
  id: `p${Date.now()}`, slug: "", name: "", category: "mukhwas", short: "", description: "", ingredients: [], notes: [],
  variants: [{ id: `v${Date.now()}`, label: "100 g", grams: 100, price: 0, mrp: 0, stock: 0 }], rating: 0, reviewCount: 0,
  createdAt: new Date().toISOString().slice(0, 10), popularity: 0, palette: { jar: "#E9EFE2", fill: "#8FAE6E", seed: "#5F7F41", label: "#9E1B1F" }, images: [],
});

function ProductForm({ initial, onDone }: { initial: Product; onDone: () => void }) {
  const { upsertProduct, categories } = useAdmin();
  const [p, setP] = useState<Product>(initial);
  const [ing, setIng] = useState(initial.ingredients.join(", "));
  const [err, setErr] = useState<Record<string, string>>({});
  const setV = (i: number, patch: Partial<Variant>) => setP({ ...p, variants: p.variants.map((v, k) => (k === i ? { ...v, ...patch } : v)) });

  const onFiles = (files: FileList | null) => {
    // Demo: preview as data URLs. TODO(backend): upload to Supabase Storage / Cloudinary and store the public URL.
    Array.from(files ?? []).slice(0, 4).forEach((f) => {
      if (!f.type.startsWith("image/") || f.size > 2_000_000) return setErr((e) => ({ ...e, images: "Images must be under 2 MB." }));
      const r = new FileReader();
      r.onload = () => setP((x) => ({ ...x, images: [...(x.images ?? []), String(r.result)] }));
      r.readAsDataURL(f);
    });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!p.name.trim()) er.name = "Name is required.";
    if (!p.variants.length) er.variants = "Add at least one variant.";
    if (p.variants.some((v) => !v.label || v.price <= 0 || v.mrp < v.price)) er.variants = "Each variant needs a label, price > 0 and MRP ≥ price.";
    setErr(er); if (Object.keys(er).length) return;
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    upsertProduct({ ...p, slug, ingredients: ing.split(",").map((s) => s.trim()).filter(Boolean) });
    onDone();
  };

  return (
    <form onSubmit={save} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" name="pn" required value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} error={err.name} />
        <Select label="Category" name="pc" value={p.category} onChange={(e) => setP({ ...p, category: e.target.value as CategorySlug })}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</Select>
        <Field label="Short description" name="ps" value={p.short} onChange={(e) => setP({ ...p, short: e.target.value })} className="sm:col-span-2" />
        <TextArea label="Description" name="pd" value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} className="sm:col-span-2" rows={3} />
        <Field label="Ingredients (comma separated)" name="pi" value={ing} onChange={(e) => setIng(e.target.value)} className="sm:col-span-2" />
      </div>
      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-wider text-ink/70">Images</p>
        <div className="flex flex-wrap gap-3">
          {(p.images ?? []).map((src, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl bg-cream">
              <Image src={src} alt="" fill unoptimized className="object-cover" />
              <button type="button" onClick={() => setP({ ...p, images: p.images!.filter((_, k) => k !== i) })} aria-label="Remove image" className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90"><X className="h-3 w-3" /></button>
            </div>
          ))}
          <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border border-dashed border-forest/30 text-forest hover:bg-cream"><Upload className="h-5 w-5" /><input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} /></label>
        </div>
        {err.images && <p className="mt-1 text-xs text-red-600">{err.images}</p>}
        <p className="mt-1 text-[11px] text-ink/45">Demo preview only. Without images, a rendered jar is shown.</p>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between"><p className="text-[12px] font-medium uppercase tracking-wider text-ink/70">Variants, prices & stock</p>
          <button type="button" className={smallBtn} onClick={() => setP({ ...p, variants: [...p.variants, { id: `v${Date.now()}`, label: "", grams: 0, price: 0, mrp: 0, stock: 0 }] })}><Plus className="h-3 w-3" />Add variant</button></div>
        <div className="space-y-2">
          {p.variants.map((v, i) => (
            <div key={v.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-2">
              {(["label", "price", "mrp", "stock"] as const).map((k) => (
                <input key={k} aria-label={k} placeholder={k} type={k === "label" ? "text" : "number"} min={0} value={String(v[k])} onChange={(e) => setV(i, { [k]: k === "label" ? e.target.value : Number(e.target.value) } as Partial<Variant>)} className="h-10 min-w-0 rounded-lg border border-forest/15 bg-white px-3 text-sm outline-none focus:border-forest" />
              ))}
              <button type="button" aria-label="Remove variant" onClick={() => setP({ ...p, variants: p.variants.filter((_, k) => k !== i) })} className="text-ink/40 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <p className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 text-[10px] uppercase tracking-wider text-ink/45"><span>Label</span><span>Price ₹</span><span>MRP ₹</span><span>Stock</span><span className="w-4" /></p>
        </div>
        {err.variants && <p className="mt-1 text-xs text-red-600">{err.variants}</p>}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.bestSeller} onChange={(e) => setP({ ...p, bestSeller: e.target.checked })} className="accent-[#9E1B1F]" />Best seller</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!p.isNew} onChange={(e) => setP({ ...p, isNew: e.target.checked })} className="accent-[#9E1B1F]" />New arrival</label>
      </div>
      <div className="flex gap-3 border-t border-forest/10 pt-5"><Button>Save product</Button><Button type="button" variant="ghost" onClick={onDone}>Cancel</Button></div>
    </form>
  );
}

export function Products() {
  const { products, categories, deleteProduct } = useAdmin();
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!cat || p.category === cat));
  return (
    <>
      <ModuleHeader title="Products" desc={`${products.length} products`} action={<Button onClick={() => setEditing(blankProduct())}><Plus className="h-4 w-4" />Add product</Button>} />
      <div className="mb-4 flex flex-wrap gap-3"><SearchInput value={q} onChange={setQ} placeholder="Search products" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter category" className="h-10 rounded-full border border-forest/15 bg-white px-4 text-sm"><option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
      <Table head={["Product", "Category", "Price", "Variants", "Stock", ""]} empty={!list.length}>
        {list.map((p) => (
          <tr key={p.id} className="hover:bg-cream/30">
            <Td><div className="flex items-center gap-3"><span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg"><ProductVisual product={p} /></span><span><b className="font-medium text-forest">{p.name}</b><span className="block text-xs text-ink/45">/{p.slug}</span></span></div></Td>
            <Td>{categories.find((c) => c.slug === p.category)?.name ?? p.category}</Td>
            <Td>{inr(Math.min(...p.variants.map((v) => v.price)))}</Td>
            <Td>{p.variants.map((v) => v.label).join(", ")}</Td>
            <Td><Pill tone={totalStock(p) === 0 ? "bad" : totalStock(p) < LOW * 2 ? "warn" : "good"}>{totalStock(p)}</Pill></Td>
            <Td className="text-right"><div className="flex justify-end gap-2">
              <button onClick={() => setEditing(p)} className={smallBtn}><Pencil className="h-3 w-3" />Edit</button>
              <button onClick={() => confirm(`Delete ${p.name}?`) && deleteProduct(p.id)} className={cn(smallBtn, "text-red-700")} aria-label={`Delete ${p.name}`}><Trash2 className="h-3 w-3" /></button>
            </div></Td>
          </tr>
        ))}
      </Table>
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.name ? `Edit ${editing.name}` : "New product"} wide>
        {editing && <ProductForm key={editing.id} initial={editing} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  );
}

/* ───────────── Orders ───────────── */
export function Orders() {
  const { orders, setOrderStatus } = useAdmin();
  const [q, setQ] = useState(""); const [st, setSt] = useState("");
  const [view, setView] = useState<Order | null>(null);
  const list = orders.filter((o) => (o.number + o.address.name + o.email).toLowerCase().includes(q.toLowerCase()) && (!st || o.status === st));
  const current = view ? orders.find((o) => o.number === view.number)! : null;
  return (
    <>
      <ModuleHeader title="Orders" desc={`${orders.length} orders`} />
      <div className="mb-4 flex flex-wrap gap-3"><SearchInput value={q} onChange={setQ} placeholder="Search order, name, email" />
        <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Filter status" className="h-10 rounded-full border border-forest/15 bg-white px-4 text-sm"><option value="">All statuses</option>{[...statusFlow, "cancelled"].map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}</select></div>
      <Table head={["Order", "Date", "Customer", "Total", "Payment", "Status", ""]} empty={!list.length}>
        {list.map((o) => (
          <tr key={o.number} className="hover:bg-cream/30">
            <Td><b className="text-forest">{o.number}</b></Td><Td>{fmtDate(o.date)}</Td><Td>{o.address.name}<span className="block text-xs text-ink/45">{o.address.city}</span></Td>
            <Td>{inr(o.total)}</Td><Td><Pill tone={o.payment.status === "paid" ? "good" : "warn"}>{o.payment.method === "cod" ? "COD" : "Online"} · {o.payment.status}</Pill></Td>
            <Td><select value={o.status} onChange={(e) => setOrderStatus(o.number, e.target.value as OrderStatus)} aria-label={`Status for ${o.number}`} className="h-9 rounded-full border border-forest/15 bg-white px-3 text-xs">{[...statusFlow, "cancelled"].map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}</select></Td>
            <Td><button onClick={() => setView(o)} className={smallBtn}>View</button></Td>
          </tr>
        ))}
      </Table>
      <Modal open={!!current} onClose={() => setView(null)} title={`Order ${current?.number ?? ""}`} wide>
        {current && (
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <Card><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Customer</p><p className="text-forest">{current.address.name}</p><p className="text-ink/60">{current.email}</p><p className="text-ink/60">{current.address.phone}</p></Card>
            <Card><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Shipping</p><p className="text-ink/70">{current.address.line1}, {current.address.city}, {current.address.state} {current.address.pin}</p><p className="mt-2 text-xs text-ink/50">Courier: {current.tracking?.courier ?? "Not assigned"} · AWB {current.tracking?.awb ?? "—"}</p><p className="mt-1 text-[11px] text-ink/40">Shiprocket integration pending.</p></Card>
            <Card><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Payment</p><p>{current.payment.method === "cod" ? "Cash on Delivery" : "Razorpay"}</p><Pill tone={current.payment.status === "paid" ? "good" : "warn"}>{current.payment.status}</Pill></Card>
            <Card><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Status</p>
              <select value={current.status} onChange={(e) => setOrderStatus(current.number, e.target.value as OrderStatus)} className="h-10 w-full rounded-full border border-forest/15 bg-white px-3 text-sm">{[...statusFlow, "cancelled"].map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}</select></Card>
            <Card className="sm:col-span-2"><p className="mb-2 text-[11px] uppercase tracking-widest text-brown">Items</p>
              <ul className="divide-y divide-forest/5">{current.lines.map((l) => <li key={l.variantId} className="flex justify-between py-2"><span>{l.name} · {l.variant} × {l.qty}</span><span>{inr(l.price * l.qty)}</span></li>)}</ul>
              <p className="mt-2 flex justify-between border-t border-forest/10 pt-2 font-medium text-forest"><span>Total</span><span>{inr(current.total)}</span></p></Card>
          </div>
        )}
      </Modal>
    </>
  );
}

/* ───────────── Inventory ───────────── */
export function Inventory() {
  const { products, setStock } = useAdmin();
  const [onlyLow, setOnlyLow] = useState(false);
  const rows = products.flatMap((p) => p.variants.map((v) => ({ p, v }))).filter(({ v }) => !onlyLow || v.stock < LOW);
  return (
    <>
      <ModuleHeader title="Inventory" desc={`Low-stock threshold: ${LOW} units`} action={<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} className="accent-[#9E1B1F]" />Show low stock only</label>} />
      <Table head={["Product", "Variant", "Status", "Stock", "Adjust"]} empty={!rows.length}>
        {rows.map(({ p, v }) => (
          <tr key={v.id}>
            <Td><b className="font-medium text-forest">{p.name}</b></Td><Td>{v.label}</Td>
            <Td><Pill tone={v.stock === 0 ? "bad" : v.stock < LOW ? "warn" : "good"}>{v.stock === 0 ? "Out of stock" : v.stock < LOW ? "Low" : "In stock"}</Pill></Td>
            <Td><input type="number" min={0} value={v.stock} onChange={(e) => setStock(p.id, v.id, Number(e.target.value))} aria-label={`Stock for ${p.name} ${v.label}`} className="h-9 w-20 rounded-lg border border-forest/15 px-2 text-sm" /></Td>
            <Td><div className="flex gap-1">{[-5, -1, 1, 5, 25].map((d) => <button key={d} onClick={() => setStock(p.id, v.id, v.stock + d)} className="h-8 rounded-full border border-forest/15 px-2.5 text-xs hover:border-forest">{d > 0 ? `+${d}` : d}</button>)}</div></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}

/* ───────────── Categories ───────────── */
export function Categories() {
  const { categories, products, upsertCategory, deleteCategory } = useAdmin();
  const [edit, setEdit] = useState<Category | null>(null); const [isNew, setIsNew] = useState(false); const [err, setErr] = useState("");
  return (
    <>
      <ModuleHeader title="Categories" action={<Button onClick={() => { setIsNew(true); setEdit({ slug: "" as CategorySlug, name: "", blurb: "", tone: "#D7262E" }); }}><Plus className="h-4 w-4" />Add category</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.slug} className="flex items-start gap-4">
            <span className="h-12 w-12 shrink-0 rounded-full" style={{ background: c.tone }} />
            <div className="flex-1"><p className="font-serif text-xl text-forest">{c.name}</p><p className="text-xs text-ink/55">{c.blurb}</p><p className="mt-1 text-xs text-ink/45">{products.filter((p) => p.category === c.slug).length} products · /{c.slug}</p>
              <div className="mt-3 flex gap-2"><button onClick={() => { setIsNew(false); setEdit(c); }} className={smallBtn}><Pencil className="h-3 w-3" />Edit</button><button onClick={() => confirm(`Delete ${c.name}?`) && deleteCategory(c.slug)} className={cn(smallBtn, "text-red-700")}><Trash2 className="h-3 w-3" /></button></div></div>
          </Card>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? "New category" : "Edit category"}>
        {edit && <form noValidate onSubmit={(e) => { e.preventDefault(); if (!edit.name.trim()) return setErr("Name is required."); const slug = (edit.slug || edit.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) as CategorySlug; if (isNew && categories.some((c) => c.slug === slug)) return setErr("A category with this slug exists."); upsertCategory({ ...edit, slug }); setEdit(null); setErr(""); }} className="space-y-4">
          <Field label="Name" name="cn" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} error={err} />
          <Field label="Slug" name="cs" value={edit.slug} disabled={!isNew} onChange={(e) => setEdit({ ...edit, slug: e.target.value as CategorySlug })} hint="Auto-generated from name if blank" />
          <Field label="Short description" name="cb" value={edit.blurb} onChange={(e) => setEdit({ ...edit, blurb: e.target.value })} />
          <label className="flex items-center gap-3 text-sm">Accent colour <input type="color" value={edit.tone} onChange={(e) => setEdit({ ...edit, tone: e.target.value })} /></label>
          <Button>Save</Button>
        </form>}
      </Modal>
    </>
  );
}

/* ───────────── Coupons ───────────── */
export function Coupons() {
  const { coupons, upsertCoupon, deleteCoupon } = useAdmin();
  const [edit, setEdit] = useState<Coupon | null>(null); const [err, setErr] = useState("");
  return (
    <>
      <ModuleHeader title="Coupons" desc="Coupon rules must also be enforced server-side." action={<Button onClick={() => setEdit({ code: "", type: "percent", value: 10, minOrder: 0, active: true, description: "" })}><Plus className="h-4 w-4" />New coupon</Button>} />
      <Table head={["Code", "Discount", "Min order", "Description", "Active", ""]} empty={!coupons.length}>
        {coupons.map((c) => (
          <tr key={c.code}>
            <Td><b className="font-mono text-forest">{c.code}</b></Td><Td>{c.type === "percent" ? `${c.value}%` : inr(c.value)}</Td><Td>{c.minOrder ? inr(c.minOrder) : "—"}</Td><Td className="text-ink/60">{c.description}</Td>
            <Td><button onClick={() => upsertCoupon({ ...c, active: !c.active })} aria-pressed={c.active} className={cn("h-6 w-11 rounded-full p-0.5 transition", c.active ? "bg-emerald" : "bg-ink/20")}><span className={cn("block h-5 w-5 rounded-full bg-white transition", c.active && "translate-x-5")} /></button></Td>
            <Td><div className="flex gap-2"><button onClick={() => setEdit(c)} className={smallBtn}><Pencil className="h-3 w-3" /></button><button onClick={() => deleteCoupon(c.code)} className={cn(smallBtn, "text-red-700")}><Trash2 className="h-3 w-3" /></button></div></Td>
          </tr>
        ))}
      </Table>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Coupon">
        {edit && <form noValidate onSubmit={(e) => { e.preventDefault(); if (!/^[A-Z0-9]{3,16}$/.test(edit.code)) return setErr("Use 3–16 letters/numbers."); if (edit.value <= 0 || (edit.type === "percent" && edit.value > 90)) return setErr("Enter a valid discount value."); upsertCoupon(edit); setEdit(null); setErr(""); }} className="space-y-4">
          <Field label="Code" name="cc" value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value.toUpperCase() })} error={err} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" name="ct" value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value as Coupon["type"] })}><option value="percent">Percent</option><option value="flat">Flat ₹</option></Select>
            <Field label="Value" name="cv" type="number" value={edit.value} onChange={(e) => setEdit({ ...edit, value: Number(e.target.value) })} />
          </div>
          <Field label="Minimum order (₹)" name="cm" type="number" value={edit.minOrder} onChange={(e) => setEdit({ ...edit, minOrder: Number(e.target.value) })} />
          <Field label="Description" name="cd" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          <Button>Save coupon</Button>
        </form>}
      </Modal>
    </>
  );
}

/* ───────────── Customers ───────────── */
export function Customers() {
  const { customers } = useAdmin(); const [q, setQ] = useState("");
  const list = customers.filter((c) => (c.name + c.email + c.city).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <ModuleHeader title="Customers" desc={`${customers.length} customers (demo)`} />
      <div className="mb-4"><SearchInput value={q} onChange={setQ} placeholder="Search customers" /></div>
      <Table head={["Name", "Email", "City", "Orders", "Total spent", "Joined"]} empty={!list.length}>
        {list.map((c) => <tr key={c.id}><Td><b className="font-medium text-forest">{c.name}</b></Td><Td>{c.email}</Td><Td>{c.city}</Td><Td>{c.orders}</Td><Td>{inr(c.spent)}</Td><Td>{fmtDate(c.joined)}</Td></tr>)}
      </Table>
    </>
  );
}

/* ───────────── Reviews ───────────── */
export function Reviews() {
  const { reviews, setReviewStatus } = useAdmin(); const [f, setF] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const list = reviews.filter((r) => f === "all" || r.status === f);
  return (
    <>
      <ModuleHeader title="Reviews" desc="Moderate customer reviews before they appear on the site." />
      <div className="mb-4 flex gap-2">{(["all", "pending", "approved", "rejected"] as const).map((k) => <button key={k} onClick={() => setF(k)} className={cn("h-9 rounded-full px-4 text-xs capitalize", f === k ? "bg-forest text-ivory" : "border border-forest/15")}>{k}</button>)}</div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between"><p className="font-medium text-forest">{r.name} · {"★".repeat(r.rating)}</p><Pill tone={r.status === "approved" ? "good" : r.status === "rejected" ? "bad" : "warn"}>{r.status}</Pill></div>
            <p className="mt-2 font-serif text-lg">{r.title}</p><p className="text-sm text-ink/65">{r.body}</p><p className="mt-2 text-xs text-ink/45">{r.productSlug} · {fmtDate(r.date)}</p>
            <div className="mt-4 flex gap-2"><button onClick={() => setReviewStatus(r.id, "approved")} className={smallBtn}><Check className="h-3 w-3" />Approve</button><button onClick={() => setReviewStatus(r.id, "rejected")} className={cn(smallBtn, "text-red-700")}><X className="h-3 w-3" />Reject</button></div>
          </Card>
        ))}
        {!list.length && <p className="text-sm text-ink/50">No reviews in this view.</p>}
      </div>
    </>
  );
}

/* ───────────── Banners ───────────── */
export function Banners() {
  const { banners, upsertBanner, deleteBanner } = useAdmin(); const [edit, setEdit] = useState<Banner | null>(null);
  return (
    <>
      <ModuleHeader title="Homepage banners" desc="Manage hero messages. (Storefront reads static content until backend is connected.)" action={<Button onClick={() => setEdit({ id: `b${Date.now()}`, title: "", subtitle: "", cta: "Shop now", href: "/shop", active: false })}><Plus className="h-4 w-4" />New banner</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {banners.map((b) => (
          <Card key={b.id} className="overflow-hidden !p-0">
            <div className="bg-forest p-6 text-ivory"><p className="text-[11px] uppercase tracking-widest text-gold">{b.subtitle}</p><p className="mt-2 font-serif text-3xl">{b.title}</p><span className="mt-4 inline-block rounded-full bg-gold px-4 py-1.5 text-xs text-forest">{b.cta}</span></div>
            <div className="flex items-center justify-between p-4"><Pill tone={b.active ? "good" : "neutral"}>{b.active ? "Live" : "Draft"}</Pill>
              <div className="flex gap-2"><button onClick={() => upsertBanner({ ...b, active: !b.active })} className={smallBtn}>{b.active ? "Unpublish" : "Publish"}</button><button onClick={() => setEdit(b)} className={smallBtn}><Pencil className="h-3 w-3" /></button><button onClick={() => deleteBanner(b.id)} className={cn(smallBtn, "text-red-700")}><Trash2 className="h-3 w-3" /></button></div></div>
          </Card>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Banner">
        {edit && <form noValidate onSubmit={(e) => { e.preventDefault(); if (edit.title.trim()) { upsertBanner(edit); setEdit(null); } }} className="space-y-4">
          <Field label="Title" name="bt" required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} error={!edit.title.trim() ? "Required" : ""} />
          <Field label="Subtitle" name="bs" value={edit.subtitle} onChange={(e) => setEdit({ ...edit, subtitle: e.target.value })} />
          <div className="grid grid-cols-2 gap-4"><Field label="Button text" name="bc" value={edit.cta} onChange={(e) => setEdit({ ...edit, cta: e.target.value })} /><Field label="Link" name="bh" value={edit.href} onChange={(e) => setEdit({ ...edit, href: e.target.value })} /></div>
          <Button>Save banner</Button>
        </form>}
      </Modal>
    </>
  );
}

/* ───────────── Enquiries ───────────── */
export function Enquiries() {
  const { enquiries, setEnquiryStatus } = useAdmin();
  return (
    <>
      <ModuleHeader title="Bulk & gifting enquiries" desc="Website form submissions will appear here once stored in Supabase." />
      <Table head={["Date", "From", "Type", "Quantity", "Message", "Status"]} empty={!enquiries.length}>
        {enquiries.map((e) => (
          <tr key={e.id}>
            <Td>{fmtDate(e.date)}</Td><Td><b className="font-medium text-forest">{e.name}</b><a href={`mailto:${e.email}`} className="block text-xs text-ink/50 underline">{e.email}</a></Td>
            <Td className="capitalize">{e.type}</Td><Td>{e.qty ?? "—"}</Td><Td className="max-w-xs text-ink/65">{e.message}</Td>
            <Td><select value={e.status} onChange={(x) => setEnquiryStatus(e.id, x.target.value as typeof e.status)} className="h-9 rounded-full border border-forest/15 bg-white px-3 text-xs"><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></Td>
          </tr>
        ))}
      </Table>
    </>
  );
}

/* ───────────── Reports ───────────── */
export function Reports() {
  const { orders, products } = useAdmin();
  const valid = orders.filter((o) => o.status !== "cancelled");
  const byProduct = useMemo(() => {
    const m = new Map<string, { name: string; units: number; revenue: number }>();
    valid.forEach((o) => o.lines.forEach((l) => { const x = m.get(l.productId) ?? { name: l.name, units: 0, revenue: 0 }; x.units += l.qty; x.revenue += l.qty * l.price; m.set(l.productId, x); }));
    return [...m.values()].sort((a, b) => b.revenue - a.revenue);
  }, [valid]);
  const max = Math.max(1, ...byProduct.map((x) => x.revenue));
  const byStatus = [...statusFlow, "cancelled" as const].map((s) => ({ s, n: orders.filter((o) => o.status === s).length }));
  const aov = valid.length ? Math.round(valid.reduce((a, o) => a + o.total, 0) / valid.length) : 0;
  const cod = valid.filter((o) => o.payment.method === "cod").length;
  const exportCsv = () => {
    const rows = [["Order", "Date", "Customer", "Status", "Payment", "Total"], ...orders.map((o) => [o.number, o.date, o.address.name, o.status, o.payment.method, String(o.total)])];
    const blob = new Blob([rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "orders-report.csv"; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <>
      <ModuleHeader title="Reports" desc="Computed from demo orders." action={<Button variant="outline" onClick={exportCsv}>Export CSV</Button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Net revenue", inr(valid.reduce((a, o) => a + o.total, 0))], ["Avg. order value", inr(aov)], ["COD share", `${valid.length ? Math.round((cod / valid.length) * 100) : 0}%`], ["Active products", products.length]].map(([l, v]) => <Card key={l as string}><p className="font-serif text-3xl text-forest">{v}</p><p className="text-xs text-ink/55">{l}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-5 font-serif text-xl text-forest">Revenue by product</h2>
          <ul className="space-y-3">
            {byProduct.map((x) => (
              <li key={x.name} className="text-sm">
                <div className="mb-1 flex justify-between"><span>{x.name}</span><span className="tabular-nums text-ink/60">{inr(x.revenue)} · {x.units} units</span></div>
                <div className="h-2 rounded-full bg-cream"><div className="h-full rounded-full bg-emerald" style={{ width: `${(x.revenue / max) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-5 font-serif text-xl text-forest">Orders by status</h2>
          <div className="flex h-48 items-end gap-3">
            {byStatus.map(({ s, n }) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs tabular-nums text-ink/60">{n}</span>
                <div className={cn("w-full rounded-t-lg", s === "cancelled" ? "bg-red-300" : "bg-forest")} style={{ height: `${(n / Math.max(1, ...byStatus.map((b) => b.n))) * 130 + 4}px` }} />
                <span className="text-center text-[10px] leading-tight text-ink/55">{statusLabel[s]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-ink/45"><Package className="h-3.5 w-3.5" />Connect Supabase to report on real orders and date ranges.</p>
    </>
  );
}
