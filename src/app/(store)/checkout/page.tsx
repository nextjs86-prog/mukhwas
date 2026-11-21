"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Banknote, CreditCard, Lock, QrCode, ShieldCheck, ShoppingBag, Upload } from "lucide-react";
import { useShop } from "@/lib/store";
import { useCartTotals, useHydrated } from "@/hooks/useCart";
import { brand } from "@/config/brand";
import { indianStates } from "@/data/content";
import { cn, inr, validators } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/Visuals";
import { Button, ButtonLink, EmptyState, Field, Select } from "@/components/ui/primitives";
import { CouponBox } from "@/components/cart/CouponBox";
import type { Order } from "@/types";

type Form = { name: string; email: string; phone: string; line1: string; city: string; state: string; pin: string };
const empty: Form = { name: "", email: "", phone: "", line1: "", city: "", state: "", pin: "" };

declare global { interface Window { Razorpay?: any } }

function loadRazorpay() {
  return new Promise<boolean>((res) => {
    if (window.Razorpay) return res(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true); s.onerror = () => res(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const t = useCartTotals();
  const { user, addresses, cart, coupon, addOrder, clearCart, saveAddress } = useShop();
  const [mode, setMode] = useState<"guest" | "login">("guest");
  const [f, setF] = useState<Form>(empty);
  const [selAddr, setSelAddr] = useState<string | "new">("new");
  const [save, setSave] = useState(true);
  const [method, setMethod] = useState<"cod" | "razorpay" | "upi">("cod");
  const [proof, setProof] = useState<{ name: string; url: string } | null>(null);
  const [proofErr, setProofErr] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [serverErr, setServerErr] = useState("");

  useEffect(() => {
    if (!hydrated || !user) return;
    setF((x) => ({ ...x, name: x.name || user.name, email: x.email || user.email, phone: x.phone || user.phone || "" }));
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (def) setSelAddr(def.id);
  }, [hydrated, user, addresses]);

  useEffect(() => {
    const a = addresses.find((x) => x.id === selAddr);
    if (a) setF((x) => ({ ...x, name: a.name, phone: a.phone, line1: a.line1, city: a.city, state: a.state, pin: a.pin }));
  }, [selAddr, addresses]);

  if (!hydrated) return <div className="container py-24 text-center text-sm text-ink/50">Loading checkout…</div>;
  if (t.lines.length === 0) return <div className="container py-12"><EmptyState icon={<ShoppingBag className="h-6 w-6" />} title="Nothing to check out" body="Your cart is empty." action={<ButtonLink href="/shop">Shop the collection</ButtonLink>} /></div>;

  const codFee = method === "cod" ? brand.commerce.codFee : 0;
  const total = t.total + codFee;
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setF({ ...f, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {
      name: validators.required(f.name, "Full name"), email: validators.email(f.email), phone: validators.phone(f.phone),
      line1: validators.required(f.line1, "Address"), city: validators.required(f.city, "City"), state: validators.required(f.state, "State"), pin: validators.pin(f.pin),
    };
    Object.keys(e).forEach((k) => !e[k as keyof Form] && delete e[k as keyof Form]);
    setErrors(e);
    if (Object.keys(e).length) document.getElementById(Object.keys(e)[0])?.focus();
    return Object.keys(e).length === 0;
  };

  const finish = (data: any, paid: boolean) => {
    const order: Order = {
      id: data.number, number: data.number, date: new Date().toISOString().slice(0, 10), status: paid ? "confirmed" : "placed",
      lines: data.lines, subtotal: data.subtotal, discount: data.discount, shipping: data.shipping + data.codFee, total: data.total,
      payment: { method, status: paid ? "paid" : "pending" }, address: { name: f.name, phone: f.phone, line1: f.line1, city: f.city, state: f.state, pin: f.pin }, email: f.email,
      tracking: { courier: "Pending assignment", awb: "—", events: [{ status: "placed", date: new Date().toISOString().slice(0, 16).replace("T", " "), note: "Order placed" }] },
    };
    if (user && save && selAddr === "new") saveAddress({ id: `a${Date.now()}`, name: f.name, phone: f.phone, line1: f.line1, city: f.city, state: f.state, pin: f.pin });
    addOrder(order);
    clearCart();
    router.push(`/orders/confirmation?n=${order.number}`);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErr("");
    if (!validate()) return;
    if (method === "upi" && !proof) { setProofErr("Upload your payment screenshot — the order can't be placed without it."); return; }
    setStatus("submitting");
    try {
      // Demo: only a flag is sent. TODO(backend): upload the screenshot to Supabase Storage and send its path.
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: f, items: cart, coupon, method, paymentProof: proof ? proof.name : null }) });
      const data = await res.json();
      if (!res.ok) { if (data.errors) setErrors(data.errors); throw new Error(data.error); }
      if (method === "cod" || method === "upi") return finish(data, false);

      if (!(await loadRazorpay())) throw new Error("Could not load the payment window. Check your connection.");
      const rz = new window.Razorpay({
        key: data.razorpay.keyId, order_id: data.razorpay.orderId, amount: data.razorpay.amount, currency: "INR", name: brand.name,
        prefill: { name: f.name, email: f.email, contact: f.phone }, theme: { color: brand.colors.forest },
        handler: async (resp: any) => {
          // Verify on the server — never trust the client callback alone.
          const v = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp) });
          const vj = await v.json();
          if (v.ok && vj.verified) finish(data, true);
          else { setServerErr("Payment could not be verified. If money was debited, it will be refunded automatically."); setStatus("idle"); }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
      rz.open();
    } catch (err) {
      setServerErr((err as Error).message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="bg-cream/50">
      <div className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[1fr_420px]">
        <form onSubmit={submit} noValidate className="space-y-8">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-brown">Secure checkout</p>
            <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">Checkout</h1>
          </div>

          {!user && (
            <section className="rounded-[24px] bg-ivory p-6 shadow-soft">
              <div className="flex gap-2 rounded-full bg-cream p-1" role="tablist">
                {(["guest", "login"] as const).map((m) => (
                  <button type="button" key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={cn("h-10 flex-1 rounded-full text-[12px] uppercase tracking-widest transition", mode === m ? "bg-forest text-ivory" : "text-forest")}>{m === "guest" ? "Guest checkout" : "Sign in"}</button>
                ))}
              </div>
              {mode === "login" && <p className="mt-4 text-sm text-ink/70">Have an account? <Link href="/account/login?next=/checkout" className="text-forest underline underline-offset-4">Sign in</Link> to use saved addresses and track orders.</p>}
              {mode === "guest" && <p className="mt-4 text-sm text-ink/60">No account needed — we&apos;ll email your order details.</p>}
            </section>
          )}

          <section className="rounded-[24px] bg-ivory p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-2xl text-forest">Contact</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="name" required autoComplete="name" value={f.name} onChange={set("name")} error={errors.name} className="sm:col-span-2" />
              <Field label="Email" id="email" type="email" required autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
              <Field label="Mobile number" id="phone" type="tel" required autoComplete="tel" inputMode="numeric" placeholder="10-digit mobile" value={f.phone} onChange={set("phone")} error={errors.phone} />
            </div>
          </section>

          <section className="rounded-[24px] bg-ivory p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-2xl text-forest">Delivery address</h2>
            {user && addresses.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <label key={a.id} className={cn("cursor-pointer rounded-2xl border p-4 text-sm transition", selAddr === a.id ? "border-forest bg-cream" : "border-forest/15")}>
                    <input type="radio" name="addr" className="sr-only" checked={selAddr === a.id} onChange={() => setSelAddr(a.id)} />
                    <b className="text-forest">{a.name}</b>{a.isDefault && <span className="ml-2 text-[10px] uppercase tracking-wider text-brown">Default</span>}
                    <p className="mt-1 text-ink/60">{a.line1}, {a.city}, {a.state} {a.pin}</p>
                  </label>
                ))}
                <label className={cn("grid cursor-pointer place-items-center rounded-2xl border border-dashed p-4 text-sm", selAddr === "new" ? "border-forest bg-cream" : "border-forest/25")}>
                  <input type="radio" name="addr" className="sr-only" checked={selAddr === "new"} onChange={() => { setSelAddr("new"); setF({ ...f, line1: "", city: "", state: "", pin: "" }); }} />+ New address
                </label>
              </div>
            )}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="House no. & street" id="line1" required autoComplete="street-address" value={f.line1} onChange={set("line1")} error={errors.line1} className="sm:col-span-2" />
              <Field label="City" id="city" required autoComplete="address-level2" value={f.city} onChange={set("city")} error={errors.city} />
              <Select label="State" id="state" required value={f.state} onChange={set("state")} error={errors.state}>
                <option value="">Select state</option>{indianStates.map((s) => <option key={s}>{s}</option>)}
              </Select>
              <Field label="PIN code" id="pin" required inputMode="numeric" maxLength={6} autoComplete="postal-code" value={f.pin} onChange={set("pin")} error={errors.pin} />
            </div>
            {user && selAddr === "new" && <label className="mt-4 flex items-center gap-2 text-sm text-ink/70"><input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="accent-[#9E1B1F]" />Save this address to my account</label>}
          </section>

          <section className="rounded-[24px] bg-ivory p-6 shadow-soft md:p-8">
            <h2 className="font-serif text-2xl text-forest">Payment</h2>
            <div className="mt-5 grid gap-3" role="radiogroup">
              {([["upi", QrCode, "UPI — scan & pay", "Pay to our UPI QR, then upload the payment screenshot. We verify and confirm on WhatsApp."], ["cod", Banknote, "Cash on Delivery", `Pay when your order arrives. ${inr(brand.commerce.codFee)} COD fee applies.`], ["razorpay", CreditCard, "Pay online — Razorpay", "UPI, cards, net banking & wallets. Requires Razorpay keys to be configured."]] as const).map(([k, Icon, l, d]) => (
                <label key={k} className={cn("flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition", method === k ? "border-forest bg-cream" : "border-forest/15")}>
                  <input type="radio" name="pay" checked={method === k} onChange={() => setMethod(k)} className="mt-1 accent-[#9E1B1F]" />
                  <Icon className="mt-0.5 h-5 w-5 text-forest" strokeWidth={1.5} />
                  <span><span className="block font-medium text-forest">{l}</span><span className="text-xs text-ink/60">{d}</span></span>
                </label>
              ))}
            </div>
            {method === "upi" && (
              <div className="mt-5 grid gap-5 rounded-2xl bg-cream p-5 sm:grid-cols-[160px_1fr]">
                <div className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-forest/25 bg-ivory p-3 text-center text-[11px] text-ink/50">
                  <span><QrCode className="mx-auto mb-2 h-10 w-10 text-forest/40" />UPI QR placeholder<br />Add your QR in<br /><code>/public/images/upi-qr.png</code></span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-forest">1. Scan and pay {inr(total)}</p>
                  <p className="mt-1 text-xs text-ink/55">UPI ID: <span className="font-mono">{brand.contact.upiId}</span></p>
                  <p className="mt-4 font-medium text-forest">2. Upload payment screenshot <span className="text-brown">*</span></p>
                  <label className={cn("mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed bg-ivory p-3", proofErr ? "border-red-400" : "border-forest/25")}>
                    <Upload className="h-5 w-5 shrink-0 text-forest" />
                    <span className="min-w-0 truncate text-xs text-ink/60">{proof ? proof.name : "Choose image (JPG/PNG, max 5 MB)"}</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      if (!file.type.startsWith("image/") || file.size > 5_000_000) { setProofErr("Please choose an image under 5 MB."); return; }
                      setProofErr(""); setProof({ name: file.name, url: URL.createObjectURL(file) });
                    }} />
                  </label>
                  {proof && <img src={proof.url} alt="Payment screenshot preview" className="mt-3 h-24 rounded-lg object-cover" />}
                  {proofErr && <p role="alert" className="mt-2 text-xs text-red-600">{proofErr}</p>}
                  <p className="mt-3 text-[11px] text-ink/50">Order will not be placed without a screenshot. Orders are confirmed after manual verification.</p>
                </div>
              </div>
            )}
          </section>

          {serverErr && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{serverErr}</p>}
          <Button type="submit" className="w-full lg:hidden" loading={status === "submitting"}><Lock className="h-4 w-4" />{method === "cod" ? "Place order" : "Pay"} · {inr(total)}</Button>
        </form>

        <aside className="h-fit space-y-5 rounded-[28px] bg-ivory p-6 shadow-soft md:p-8 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl text-forest">Order summary</h2>
          <ul className="space-y-4">
            {t.lines.map((l) => (
              <li key={l.variantId} className="flex items-center gap-4">
                <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl"><ProductVisual product={l.product} /><span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-forest text-[10px] text-ivory">{l.qty}</span></span>
                <span className="flex-1 text-sm"><span className="block text-forest">{l.product.name}</span><span className="text-xs text-ink/50">{l.variant.label}</span></span>
                <span className="text-sm">{inr(l.total)}</span>
              </li>
            ))}
          </ul>
          <CouponBox subtotal={t.subtotal} />
          <dl className="space-y-2.5 border-t border-forest/10 pt-5 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
            {t.discount > 0 && <div className="flex justify-between text-emerald"><dt>Discount ({t.code})</dt><dd>−{inr(t.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd></div>
            {codFee > 0 && <div className="flex justify-between"><dt>COD fee</dt><dd>{inr(codFee)}</dd></div>}
            <div className="flex justify-between border-t border-forest/10 pt-4 text-lg font-medium text-forest"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
          <Button type="button" onClick={(e) => (e.currentTarget.closest("aside")?.previousElementSibling as HTMLFormElement)?.requestSubmit()} className="hidden w-full lg:inline-flex" loading={status === "submitting"}>
            <Lock className="h-4 w-4" />{method === "cod" ? "Place order" : "Pay securely"}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink/50"><ShieldCheck className="h-3.5 w-3.5" />Totals are re-verified on our server before the order is placed.</p>
        </aside>
      </div>
    </div>
  );
}
