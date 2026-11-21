"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Field, Select, TextArea } from "@/components/ui/primitives";
import { validators } from "@/lib/utils";

export const enquiryTypes = [
  ["general", "General question"], ["order", "Order support"], ["business", "Business enquiry"], ["bulk", "Bulk order"],
  ["wedding", "Wedding gifting"], ["festival", "Festival gifting"], ["corporate", "Corporate gifting"], ["custom", "Custom hamper"],
] as const;

export function EnquiryForm({ defaultType = "general", types = enquiryTypes.map((t) => t[0]) as string[], showQty = false }: { defaultType?: string; types?: string[]; showQty?: boolean }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", type: defaultType, qty: "", date: "", message: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [ref, setRef] = useState("");
  const [serverErr, setServerErr] = useState("");
  const set = (k: keyof typeof f) => (x: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: x.target.value }); setE({ ...e, [k]: "" }); };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    const add = (k: string, m: string) => m && (er[k] = m);
    add("name", validators.required(f.name, "Name")); add("email", validators.email(f.email));
    if (f.phone) add("phone", validators.phone(f.phone));
    if (f.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setE(er); if (Object.keys(er).length) return;
    setState("loading"); setServerErr("");
    try {
      const r = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const j = await r.json();
      if (!r.ok) { if (j.errors) setE(j.errors); throw new Error(j.error); }
      setRef(j.reference); setState("done");
    } catch (x) { setServerErr((x as Error).message || "Could not send. Please try again."); setState("idle"); }
  };

  if (state === "done") return (
    <div className="rounded-[24px] bg-emerald-50 p-8 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald" strokeWidth={1.5} />
      <p className="mt-4 font-serif text-3xl text-forest">Thank you, {f.name.split(" ")[0]}.</p>
      <p className="mt-2 text-sm text-ink/65">Your enquiry ({ref}) was received. We typically reply within 1–2 business days.</p>
      <p className="mt-2 text-xs text-ink/45">Demo mode: enquiries are validated but not yet stored or emailed.</p>
      <Button variant="outline" className="mt-6" onClick={() => { setF({ ...f, message: "" }); setState("idle"); }}>Send another</Button>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Name" name="ename" required autoComplete="name" value={f.name} onChange={set("name")} error={e.name} />
      <Field label="Email" name="eemail" type="email" required autoComplete="email" value={f.email} onChange={set("email")} error={e.email} />
      <Field label="Phone (optional)" name="ephone" type="tel" value={f.phone} onChange={set("phone")} error={e.phone} />
      <Select label="Enquiry type" name="etype" value={f.type} onChange={set("type")}>
        {enquiryTypes.filter(([k]) => types.includes(k)).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </Select>
      {showQty && <>
        <Field label="Approx. quantity" name="eqty" inputMode="numeric" placeholder="e.g. 150 boxes" value={f.qty} onChange={set("qty")} />
        <Field label="Required by" name="edate" type="date" value={f.date} onChange={set("date")} />
      </>}
      <TextArea label="Message" name="emsg" required value={f.message} onChange={set("message")} error={e.message} className="sm:col-span-2" placeholder="Tell us about your requirement…" />
      {serverErr && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{serverErr}</p>}
      <Button className="sm:col-span-2 sm:justify-self-start" loading={state === "loading"}>Send enquiry</Button>
    </form>
  );
}
