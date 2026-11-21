"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { products } from "@/data/products";
import { brand } from "@/config/brand";
import type { Product } from "@/types";
import { Cutout } from "@/components/ui/Visuals";

const N = products.length;
const TILTS = [-16, 12, -10, 15, -13, 10, -12, 14];

/** One product in the rail. `pos` = continuous carousel position; item is centred when pos === i. */
function Item({ p, i, pos, spacing, onOpen, onGo }: { p: Product; i: number; pos: MotionValue<number>; spacing: number; onOpen: () => void; onGo: () => void }) {
  const off = useTransform(pos, (v) => i - v);
  const x = useTransform(off, (o) => o * spacing);
  const scale = useTransform(off, (o) => Math.max(0.55, 1 - Math.abs(o) * 0.25));
  const rotate = useTransform(off, (o) => TILTS[i % TILTS.length] * (0.45 + 0.55 * Math.min(1, Math.abs(o))));
  const opacity = useTransform(off, (o) => Math.max(0, Math.min(1, 1.3 - Math.abs(o) * 0.5)));
  const z = useTransform(off, (o) => 100 - Math.round(Math.abs(o) * 10));
  const near = useTransform(off, (o) => (Math.abs(o) < 3.5 ? "block" : "none")); // skip far-away items entirely
  return (
    <motion.button type="button" aria-label={`${p.name} — view`} style={{ x, scale, rotate, opacity, zIndex: z, display: near, willChange: "transform" }}
      onClick={() => (Math.abs(i - pos.get()) < 0.3 ? onOpen() : onGo())}
      className={`absolute inset-0 m-auto w-fit outline-none ${p.combo ? "h-[62%]" : "h-[98%]"}`}>
      <Cutout product={p} priority={i < 3} className="h-full w-auto drop-shadow-[0_34px_26px_rgba(0,0,0,.4)]" />
    </motion.button>
  );
}

/** Rotating ring of text behind the products. */
function RingText() {
  const text = `${brand.name} • DIL SE INDIAN • MUKHWAS & MOUTH FRESHENERS • EK CHAMMACH AUR? • `;
  return (
    <motion.svg viewBox="0 0 600 600" aria-hidden className="pointer-events-none absolute left-1/2 top-[42%] w-[110vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 opacity-40 sm:w-[56vw]"
      animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
      <defs><path id="ring" d="M300,300 m-270,0 a270,270 0 1,1 540,0 a270,270 0 1,1 -540,0" /></defs>
      <text fontSize="24" letterSpacing="10" fill="#FFFFFF" fontFamily="var(--font-serif), serif"><textPath href="#ring">{text}{text}</textPath></text>
    </motion.svg>
  );
}

export function ScrollCarousel() {
  const router = useRouter();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, N - 1]);
  const pos = useSpring(raw, { stiffness: 140, damping: 28, mass: 0.6 });
  const [spacing, setSpacing] = useState(380);
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number } | null>(null);
  const tick = useMotionValue(0);

  useEffect(() => {
    const m = () => setSpacing(window.innerWidth < 640 ? window.innerWidth * 0.62 : Math.min(560, window.innerWidth * 0.34));
    m(); window.addEventListener("resize", m); return () => window.removeEventListener("resize", m);
  }, []);
  useMotionValueEvent(pos, "change", (v) => { const a = Math.max(0, Math.min(N - 1, Math.round(v))); setActive((c) => (c === a ? c : a)); });

  /** Scroll the window so that the carousel lands on item i. */
  const goTo = (i: number) => {
    const el = section.current!; const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (range * Math.max(0, Math.min(N - 1, i))) / (N - 1), behavior: "smooth" });
  };

  // Horizontal drag (mouse or touch) is translated into page scroll, so scroll and drag share one source of truth.
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX }; tick.set(0); };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x; drag.current.x = e.clientX; tick.set(tick.get() + Math.abs(dx));
    const range = section.current!.offsetHeight - window.innerHeight;
    window.scrollBy(0, (-dx / spacing) * (range / (N - 1)));
  };
  const onUp = () => { if (drag.current && tick.get() > 5) goTo(Math.round(pos.get())); drag.current = null; };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1); }
  };

  const p = products[active];
  return (
    <section ref={section} aria-label="Product carousel" style={{ height: `${N * 40 + 60}vh` }} className="relative bg-[#FBF5EC]">
      <div className="sticky top-[84px] h-[calc(100svh-84px)] overflow-hidden md:top-[112px] md:h-[calc(100svh-112px)]" tabIndex={0} onKeyDown={onKey}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}
        onClickCapture={(e) => { if (tick.get() > 5) { e.stopPropagation(); e.preventDefault(); tick.set(0); } }}
        style={{ touchAction: "pan-y" }}>
        {/* Big arch "stage" — pure white so the product photos' white backgrounds disappear into it */}
        <svg aria-hidden viewBox="0 0 100 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[78%] w-[120%] sm:inset-x-[6%] sm:w-[88%]">
          <defs><linearGradient id="mt" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset="1" stopColor="#000" stopOpacity=".25" /></linearGradient></defs>
          {/* colour follows the active product */}
          <path d="M0,60 C8,60 14,48 22,34 C30,20 38,6 50,6 C62,6 70,20 78,34 C86,48 92,60 100,60 Z" style={{ fill: p.accent ?? "#E2641F", transition: "fill .7s ease" }} />
          <path d="M0,60 C8,60 14,48 22,34 C30,20 38,6 50,6 C62,6 70,20 78,34 C86,48 92,60 100,60 Z" fill="url(#mt)" />
        </svg>
        {/* ring fades out before it reaches the caption + button */}
        <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_68%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_68%)]">
          <RingText />
        </div>

        <div className="absolute inset-x-0 bottom-[25%] top-[3%] select-none">
          {products.map((x, i) => <Item key={x.id} p={x} i={i} pos={pos} spacing={spacing} onOpen={() => router.push(`/product/${x.slug}`)} onGo={() => goTo(i)} />)}
        </div>

        {/* Active product caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[3%] z-[120] flex flex-col items-center px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <p className="text-[10px] uppercase tracking-[.3em] text-white/80">{String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</p>
              <p className="font-serif text-2xl leading-tight text-ivory md:text-4xl">{p.name}</p>
            </motion.div>
          </AnimatePresence>
          <p className="mt-1 hidden font-serif text-xs uppercase tracking-[.2em] [@media(min-height:700px)]:block text-ivory/75 md:text-sm"><span className="md:hidden">Swipe to discover</span><span className="hidden md:inline">Scroll or drag to discover {brand.name} flavours</span></p>
          <button onClick={() => router.push(`/product/${p.slug}`)} className="pointer-events-auto mt-2 flex items-center gap-2 rounded-full bg-ivory px-6 py-2.5 md:px-7 md:py-3 text-[13px] font-semibold uppercase tracking-[.14em] text-forest shadow-lift transition hover:scale-105"><span className="h-2 w-2 rotate-45 bg-gold" />View Product</button>
        </div>
      </div>
    </section>
  );
}
