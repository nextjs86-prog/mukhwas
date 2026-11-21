"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Minus, Plus, Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "light";
const btn: Record<Variant, string> = {
  primary: "bg-forest text-ivory hover:bg-emerald",
  gold: "bg-gold text-forest hover:bg-gold-light",
  outline: "border border-forest/25 text-forest hover:border-forest hover:bg-forest hover:text-ivory",
  ghost: "text-forest hover:bg-forest/5",
  light: "bg-ivory text-forest hover:bg-cream",
};
const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-[13px] font-medium uppercase tracking-[.14em] transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }>(
  ({ variant = "primary", className, loading, children, ...props }, ref) => (
    <button ref={ref} className={cn(base, btn[variant], className)} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export function ButtonLink({ href, variant = "primary", className, children }: { href: string; variant?: Variant; className?: string; children: ReactNode }) {
  return <Link href={href} className={cn(base, btn[variant], className)}>{children}</Link>;
}

export function Logo({ light = false, big = false, className = "" }: { light?: boolean; big?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={`${brand.name} home`} className={cn("group inline-flex flex-col items-center leading-none", className)}>
      <span className={cn("font-serif tracking-[.32em]", big ? "text-[26px] font-semibold sm:text-[34px] md:text-[48px]" : "text-[22px] md:text-[26px]", light ? "text-ivory" : "text-forest")}>{brand.name}</span>
      <span className={cn("mt-1 flex items-center gap-2 uppercase tracking-[.4em] text-gold", big ? "text-[9px] md:text-[12px]" : "text-[8px]")}>
        <span className="h-px w-4 bg-gold/70" />Est. India<span className="h-px w-4 bg-gold/70" />
      </span>
    </Link>
  );
}

export function Stars({ rating, size = 14, className = "" }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className={i <= Math.round(rating) ? "fill-gold text-gold" : "text-gold/40"} />
      ))}
    </span>
  );
}

export function DemoTag({ children = "Demo", className = "" }: { children?: ReactNode; className?: string }) {
  return <span className={cn("rounded-full border border-brown/30 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-brown", className)}>{children}</span>;
}

export function Eyebrow({ children, light, className = "" }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cn("mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest2", light ? "text-gold" : "text-brown", className)}>
      <span className="h-px w-8 bg-gold" />{children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, intro, light, center, action }: { eyebrow?: string; title: ReactNode; intro?: string; light?: boolean; center?: boolean; action?: ReactNode }) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between", center && "md:flex-col md:items-center text-center")}>
      <div className={cn("max-w-2xl", center && "mx-auto flex flex-col items-center")}>
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <h2 className={cn("font-serif text-[34px] leading-[1.08] md:text-5xl", light ? "text-ivory" : "text-forest")}>{title}</h2>
        {intro && <p className={cn("mt-4 text-[15px] leading-relaxed md:text-base", light ? "text-ivory/70" : "text-ink/70")}>{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = "", y = 24 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function QtyStepper({ value, onChange, min = 1, max = 20, size = "md" }: { value: number; onChange: (n: number) => void; min?: number; max?: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-forest/20", h)}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} className="grid h-full w-10 place-items-center text-forest disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className="grid h-full w-10 place-items-center text-forest disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button>
    </div>
  );
}

const fieldCls = "w-full rounded-xl border bg-ivory px-4 h-12 text-[15px] text-ink placeholder:text-ink/40 outline-none transition focus:border-forest focus:ring-2 focus:ring-gold/30";

export function Field({ label, error, hint, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = props.id || props.name;
  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wider text-ink/70">{label}{props.required && <span className="text-brown"> *</span>}</span>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cn(fieldCls, error ? "border-red-400" : "border-forest/15")} {...props} />
      {error ? <span id={`${id}-err`} className="mt-1 block text-xs text-red-600">{error}</span> : hint ? <span className="mt-1 block text-xs text-ink/50">{hint}</span> : null}
    </label>
  );
}

export function TextArea({ label, error, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = props.id || props.name;
  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wider text-ink/70">{label}{props.required && <span className="text-brown"> *</span>}</span>
      <textarea id={id} aria-invalid={!!error} rows={5} className={cn(fieldCls, "h-auto py-3", error ? "border-red-400" : "border-forest/15")} {...props} />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Select({ label, error, className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  const id = props.id || props.name;
  return (
    <label htmlFor={id} className={cn("block", className)}>
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wider text-ink/70">{label}{props.required && <span className="text-brown"> *</span>}</span>
      <select id={id} aria-invalid={!!error} className={cn(fieldCls, error ? "border-red-400" : "border-forest/15")} {...props}>{children}</select>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-gold/30" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-gold/20" />
      <div className="container py-14 md:py-20">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="max-w-3xl font-serif text-[40px] leading-[1.04] text-forest md:text-6xl">{title}</h1>
          {intro && <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-cream text-forest">{icon}</div>
      <h3 className="font-serif text-2xl text-forest">{title}</h3>
      <p className="mt-2 text-sm text-ink/60">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
