"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { Jar } from "@/components/ui/Visuals";
import { ButtonLink } from "@/components/ui/primitives";
import { brand } from "@/config/brand";

const ease = [0.22, 1, 0.36, 1] as const;

/** Floating ingredient sprite (fennel, petal, cardamom, star anise). */
function Sprite({ kind, className, delay = 0 }: { kind: "fennel" | "petal" | "pod" | "anise"; className: string; delay?: number }) {
  const reduce = useReducedMotion();
  const shape = {
    fennel: <ellipse cx="20" cy="20" rx="16" ry="5" fill="#8FAE6E" transform="rotate(-30 20 20)" />,
    petal: <path d="M20 4 C34 10 34 30 20 36 C6 30 6 10 20 4Z" fill="#D98A93" />,
    pod: <ellipse cx="20" cy="20" rx="14" ry="9" fill="#A9C08A" stroke="#6E8B4E" strokeWidth="1" />,
    anise: <g fill="#806347">{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="20" cy="9" rx="3.4" ry="9" transform={`rotate(${i * 45} 20 20)`} />)}<circle cx="20" cy="20" r="3" fill="#5c4630" /></g>,
  }[kind];
  return (
    <motion.svg viewBox="0 0 40 40" aria-hidden className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0.6 }} animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -14, 0], rotate: [0, 12, 0] }}
      transition={{ opacity: { delay: 0.8 + delay, duration: 0.8 }, scale: { delay: 0.8 + delay, duration: 0.8 }, y: { duration: 6 + delay * 2, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}>
      {shape}
    </motion.svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const hero = [products[3], products[0], products[2]];

  return (
    <section ref={ref} className="relative overflow-hidden bg-forest text-ivory">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 72% 45%, #D7262E 0%, transparent 70%)" }} />
      <div className="container relative grid items-center gap-8 py-12 lg:min-h-[min(calc(100svh-156px),820px)] lg:grid-cols-[1.05fr_1fr] lg:py-10">
        <div className="relative z-10 max-w-xl pt-4 lg:pt-0">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-gold">
            <span className="h-px w-10 bg-gold" />Small-batch Indian mukhwas
          </motion.p>
          <h1 className="font-serif text-[52px] leading-[.98] sm:text-7xl lg:text-[88px]">
            {["The art of", "the after-meal."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <motion.span className={`block ${i === 1 ? "italic text-gold-light" : ""}`} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.15 + i * 0.12, ease }}>{line}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease }} className="mt-7 max-w-md text-[15px] leading-relaxed text-ivory/70 md:text-base">
            Fennel from Lucknow, rose petals dried in the sun, paan leaves folded with gulkand — {brand.name} brings India&apos;s most gracious ritual to your table, roasted slowly and packed by hand.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65, ease }} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="gold">Shop now <ArrowRight className="h-4 w-4" /></ButtonLink>
            <ButtonLink href="/categories" variant="outline" className="border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-forest">Explore collection</ButtonLink>
          </motion.div>
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-12 hidden grid-cols-3 gap-6 border-t border-ivory/10 pt-6 sm:grid">
            {[["8", "Signature blends"], ["7", "Collections"], ["₹999+", "Free shipping"]].map(([n, l]) => (
              <div key={l}><dt className="font-serif text-3xl text-gold-light">{n}</dt><dd className="mt-1 text-[11px] uppercase tracking-widest text-ivory/55">{l}</dd></div>
            ))}
          </motion.dl>
        </div>

        <motion.div style={{ y }} className="relative mx-auto aspect-square w-full max-w-[560px]">
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, ease }} className="absolute inset-[6%] rounded-full border border-gold/25" />
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.4, delay: 0.1, ease }} className="absolute inset-[16%] rounded-full bg-gradient-to-b from-emerald/60 to-forest" />
          <div className="absolute inset-x-[4%] bottom-[14%] h-[18%] rounded-[50%] bg-black/25 blur-2xl" />
          <div className="absolute inset-0 flex items-end justify-center gap-[2%] pb-[16%]">
            {hero.map((p, i) => (
              <motion.div key={p.id} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease }} className={i === 1 ? "z-10 w-[38%]" : "w-[29%]"}>
                <Jar product={p} className="w-full drop-shadow-[0_30px_30px_rgba(0,0,0,.35)]" />
              </motion.div>
            ))}
          </div>
          <Sprite kind="fennel" className="left-[6%] top-[18%] w-10" />
          <Sprite kind="petal" className="right-[8%] top-[12%] w-9" delay={0.3} />
          <Sprite kind="anise" className="right-[2%] top-[48%] w-12" delay={0.6} />
          <Sprite kind="pod" className="left-[0%] top-[52%] w-9" delay={0.9} />
          <Sprite kind="petal" className="left-[22%] top-[4%] w-6" delay={1.2} />
          <Sprite kind="fennel" className="right-[24%] top-[2%] w-7" delay={1.5} />
        </motion.div>
      </div>
    </section>
  );
}
