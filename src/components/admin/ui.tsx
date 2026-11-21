"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-forest/10 bg-white p-5 md:p-6", className)}>{children}</div>;
}

export function ModuleHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="font-serif text-3xl text-forest md:text-4xl">{title}</h1>{desc && <p className="mt-1 text-sm text-ink/55">{desc}</p>}</div>
      {action}
    </div>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-cream/60 text-[11px] uppercase tracking-wider text-ink/55"><tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-forest/5">{children}</tbody>
      </table>
      {empty && <p className="p-10 text-center text-sm text-ink/50">Nothing here yet.</p>}
    </div>
  );
}

export const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const t = { neutral: "bg-cream text-forest", good: "bg-emerald-50 text-emerald", warn: "bg-gold/20 text-brown", bad: "bg-red-50 text-red-700" }[tone];
  return <span className={cn("inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", t)}>{children}</span>;
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-end bg-forest/40 sm:place-items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className={cn("max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-ivory p-6 shadow-lift sm:rounded-3xl md:p-8", wide ? "max-w-3xl" : "max-w-lg")}>
            <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-2xl text-forest">{title}</h2><button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream"><X className="h-5 w-5" /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-10 w-full rounded-full border border-forest/15 bg-white px-4 text-sm outline-none focus:border-forest sm:w-64" />;
}

export const smallBtn = "inline-flex h-9 items-center gap-1.5 rounded-full border border-forest/15 px-3 text-xs text-forest transition hover:border-forest";
