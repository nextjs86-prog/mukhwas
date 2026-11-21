"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, Heart, MapPin, Package } from "lucide-react";
import { useShop } from "@/lib/store";
import { AccountShell } from "@/components/account/AccountShell";
import { Button, Field } from "@/components/ui/primitives";
import { validators } from "@/lib/utils";

function Profile() {
  const { user, updateProfile, orders, wishlist, addresses } = useShop();
  const [f, setF] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    const n = validators.required(f.name, "Name"); if (n) er.name = n;
    if (f.phone) { const p = validators.phone(f.phone); if (p) er.phone = p; }
    setE(er); if (Object.keys(er).length) return;
    updateProfile(f); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };
  const stats = [
    { href: "/account/orders", icon: Package, n: orders.length, l: "Orders" },
    { href: "/account/wishlist", icon: Heart, n: wishlist.length, l: "Wishlist" },
    { href: "/account/addresses", icon: MapPin, n: addresses.length, l: "Addresses" },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ href, icon: Icon, n, l }) => (
          <Link key={href} href={href} className="rounded-2xl bg-cream p-5 transition hover:shadow-soft"><Icon className="h-5 w-5 text-gold" /><p className="mt-3 font-serif text-3xl text-forest">{n}</p><p className="text-xs text-ink/55">{l}</p></Link>
        ))}
      </div>
      <form onSubmit={save} noValidate className="rounded-[24px] bg-ivory p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-2xl text-forest">Profile details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="pname" value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} />
          <Field label="Mobile" name="pphone" type="tel" value={f.phone} onChange={(x) => setF({ ...f, phone: x.target.value })} error={e.phone} />
          <Field label="Email" name="pemail" value={user?.email ?? ""} disabled hint="Contact support to change your email." className="sm:col-span-2" />
        </div>
        <div className="mt-6 flex items-center gap-4"><Button>Save changes</Button>{saved && <span className="flex items-center gap-1 text-sm text-emerald"><Check className="h-4 w-4" />Saved</span>}</div>
      </form>
    </div>
  );
}

export default function AccountPage() {
  return <AccountShell title="My account"><Profile /></AccountShell>;
}
