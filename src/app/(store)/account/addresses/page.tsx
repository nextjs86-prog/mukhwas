"use client";
import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useShop } from "@/lib/store";
import { AccountShell } from "@/components/account/AccountShell";
import { Button, EmptyState, Field, Select } from "@/components/ui/primitives";
import { indianStates } from "@/data/content";
import { validators } from "@/lib/utils";
import type { Address } from "@/types";

const blank: Address = { id: "", name: "", phone: "", line1: "", city: "", state: "", pin: "" };

function Addresses() {
  const { addresses, saveAddress, removeAddress } = useShop();
  const [edit, setEdit] = useState<Address | null>(null);
  const [e, setE] = useState<Record<string, string>>({});

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    const er: Record<string, string> = {};
    const add = (k: string, m: string) => m && (er[k] = m);
    add("name", validators.required(edit.name, "Name")); add("phone", validators.phone(edit.phone)); add("line1", validators.required(edit.line1, "Address"));
    add("city", validators.required(edit.city, "City")); add("state", validators.required(edit.state, "State")); add("pin", validators.pin(edit.pin));
    setE(er); if (Object.keys(er).length) return;
    saveAddress({ ...edit, id: edit.id || `a${Date.now()}` }); setEdit(null);
  };
  const set = (k: keyof Address) => (x: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => edit && setEdit({ ...edit, [k]: x.target.value });

  return (
    <div className="space-y-6">
      {edit ? (
        <form onSubmit={submit} noValidate className="rounded-[24px] bg-ivory p-6 shadow-soft md:p-8">
          <h2 className="font-serif text-2xl text-forest">{edit.id ? "Edit address" : "New address"}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="aname" required value={edit.name} onChange={set("name")} error={e.name} />
            <Field label="Mobile" name="aphone" type="tel" required value={edit.phone} onChange={set("phone")} error={e.phone} />
            <Field label="House no. & street" name="aline1" required value={edit.line1} onChange={set("line1")} error={e.line1} className="sm:col-span-2" />
            <Field label="City" name="acity" required value={edit.city} onChange={set("city")} error={e.city} />
            <Select label="State" name="astate" required value={edit.state} onChange={set("state")} error={e.state}><option value="">Select state</option>{indianStates.map((s) => <option key={s}>{s}</option>)}</Select>
            <Field label="PIN code" name="apin" required maxLength={6} inputMode="numeric" value={edit.pin} onChange={set("pin")} error={e.pin} />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.isDefault} onChange={(x) => setEdit({ ...edit, isDefault: x.target.checked })} className="accent-[#9E1B1F]" />Set as default</label>
          <div className="mt-6 flex gap-3"><Button>Save address</Button><Button type="button" variant="ghost" onClick={() => { setEdit(null); setE({}); }}>Cancel</Button></div>
        </form>
      ) : (
        <Button onClick={() => setEdit({ ...blank })}><Plus className="h-4 w-4" />Add address</Button>
      )}
      {addresses.length === 0 && !edit ? <EmptyState icon={<MapPin className="h-6 w-6" />} title="No saved addresses" body="Save an address for faster checkout." /> : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-[24px] bg-ivory p-6 shadow-soft">
              <div className="flex items-start justify-between"><p className="font-serif text-xl text-forest">{a.name}</p>{a.isDefault && <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] uppercase tracking-wider text-brown">Default</span>}</div>
              <p className="mt-2 text-sm text-ink/65">{a.line1}<br />{a.city}, {a.state} {a.pin}<br />{a.phone}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEdit(a)} className="flex items-center gap-1.5 rounded-full border border-forest/20 px-3 py-1.5 text-xs text-forest"><Pencil className="h-3 w-3" />Edit</button>
                <button onClick={() => removeAddress(a.id)} className="flex items-center gap-1.5 rounded-full border border-forest/20 px-3 py-1.5 text-xs text-red-700"><Trash2 className="h-3 w-3" />Remove</button>
                {!a.isDefault && <button onClick={() => saveAddress({ ...a, isDefault: true })} className="rounded-full px-3 py-1.5 text-xs text-forest underline">Make default</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Page() { return <AccountShell title="Saved addresses"><Addresses /></AccountShell>; }
