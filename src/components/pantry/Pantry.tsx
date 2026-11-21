"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { Hand, Minus, MousePointerClick, Plus } from "lucide-react";
import { products } from "@/data/products";

import { Cutout } from "@/components/ui/Visuals";
import { ProductPanel } from "./ProductPanel";
import { cn } from "@/lib/utils";

/* ── World layout (in world px). Shelves are horizontal boards; items sit on them. ── */
const W = 2600, H = 1640;
const SHELVES = [430, 820, 1210, 1600]; // y of each shelf top surface
type Slot = { kind: "product"; id: string; x: number; shelf: number; w: number } | { kind: "decor"; type: "bowl" | "tin" | "plant" | "brass" | "stack"; x: number; shelf: number; w: number; tone: string };

const SLOTS: Slot[] = [
  { kind: "decor", type: "plant", x: 140, shelf: 0, w: 150, tone: "#5F7F41" },
  { kind: "product", id: "p1", x: 420, shelf: 0, w: 210 },
  { kind: "decor", type: "bowl", x: 690, shelf: 0, w: 170, tone: "#8FAE6E" },
  { kind: "product", id: "p4", x: 950, shelf: 0, w: 190 },
  { kind: "decor", type: "tin", x: 1210, shelf: 0, w: 110, tone: "#E8B21E" },
  { kind: "product", id: "p8", x: 1450, shelf: 0, w: 300 },
  { kind: "decor", type: "brass", x: 1840, shelf: 0, w: 150, tone: "#E8B21E" },
  { kind: "product", id: "p3", x: 2120, shelf: 0, w: 210 },

  { kind: "decor", type: "stack", x: 200, shelf: 1, w: 160, tone: "#E59BAE" },
  { kind: "product", id: "p2", x: 520, shelf: 1, w: 220 },
  { kind: "decor", type: "bowl", x: 800, shelf: 1, w: 160, tone: "#E3A3AA" },
  { kind: "product", id: "p7", x: 1080, shelf: 1, w: 220 },
  { kind: "decor", type: "tin", x: 1370, shelf: 1, w: 120, tone: "#D7262E" },
  { kind: "product", id: "p5", x: 1640, shelf: 1, w: 210 },
  { kind: "decor", type: "bowl", x: 1930, shelf: 1, w: 170, tone: "#D2B47A" },
  { kind: "product", id: "p6", x: 2220, shelf: 1, w: 200 },

  { kind: "product", id: "p3", x: 260, shelf: 2, w: 170 },
  { kind: "decor", type: "brass", x: 520, shelf: 2, w: 140, tone: "#E8B21E" },
  { kind: "product", id: "p1", x: 760, shelf: 2, w: 170 },
  { kind: "decor", type: "plant", x: 1020, shelf: 2, w: 140, tone: "#6E8B4E" },
  { kind: "product", id: "p8", x: 1300, shelf: 2, w: 260 },
  { kind: "product", id: "p4", x: 1640, shelf: 2, w: 170 },
  { kind: "decor", type: "stack", x: 1900, shelf: 2, w: 150, tone: "#A88A5F" },
  { kind: "product", id: "p2", x: 2200, shelf: 2, w: 180 },

  { kind: "decor", type: "bowl", x: 220, shelf: 3, w: 180, tone: "#A9C08A" },
  { kind: "product", id: "p5", x: 520, shelf: 3, w: 180 },
  { kind: "product", id: "p7", x: 830, shelf: 3, w: 180 },
  { kind: "decor", type: "tin", x: 1090, shelf: 3, w: 120, tone: "#806347" },
  { kind: "product", id: "p6", x: 1340, shelf: 3, w: 180 },
  { kind: "decor", type: "brass", x: 1620, shelf: 3, w: 150, tone: "#E8B21E" },
  { kind: "product", id: "p3", x: 1900, shelf: 3, w: 180 },
  { kind: "decor", type: "plant", x: 2240, shelf: 3, w: 150, tone: "#5F7F41" },
];

/* ── Decorative props (simple, flat, same light direction as jars) ── */
function Decor({ type, tone }: { type: string; tone: string }) {
  if (type === "bowl") return (
    <svg viewBox="0 0 200 110" className="w-full" aria-hidden>
      <ellipse cx="100" cy="104" rx="88" ry="6" fill="#000" opacity=".18" />
      <ellipse cx="100" cy="30" rx="86" ry="18" fill={tone} />
      {Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={30 + ((i * 37) % 140)} cy={22 + ((i * 13) % 16)} rx="4" ry="1.6" fill="#fff" opacity=".35" transform={`rotate(${i * 23} ${30 + ((i * 37) % 140)} ${22 + ((i * 13) % 16)})`} />)}
      <path d="M12 32 Q100 150 188 32 Q100 54 12 32Z" fill="#C9B79A" /><path d="M12 32 Q100 150 188 32" fill="none" stroke="#fff" strokeOpacity=".4" />
    </svg>
  );
  if (type === "tin") return (
    <svg viewBox="0 0 100 150" className="w-full" aria-hidden>
      <ellipse cx="50" cy="146" rx="44" ry="4" fill="#000" opacity=".18" />
      <rect x="8" y="22" width="84" height="122" rx="6" fill={tone} /><rect x="4" y="10" width="92" height="18" rx="4" fill="#F7D774" />
      <rect x="18" y="60" width="64" height="44" rx="2" fill="#FFFDF8" opacity=".9" /><rect x="8" y="22" width="12" height="122" fill="#fff" opacity=".12" />
    </svg>
  );
  if (type === "brass") return (
    <svg viewBox="0 0 140 150" className="w-full" aria-hidden>
      <defs><linearGradient id="br" x1="0" x2="1"><stop offset="0" stopColor="#8A6E3A" /><stop offset=".4" stopColor="#F7D774" /><stop offset="1" stopColor="#9C7F45" /></linearGradient></defs>
      <ellipse cx="70" cy="146" rx="56" ry="4" fill="#000" opacity=".2" />
      <path d="M50 10 H90 L86 30 Q128 50 122 98 Q116 140 70 144 Q24 140 18 98 Q12 50 54 30Z" fill="url(#br)" />
    </svg>
  );
  if (type === "plant") return (
    <svg viewBox="0 0 150 220" className="w-full" aria-hidden>
      <ellipse cx="75" cy="216" rx="52" ry="4" fill="#000" opacity=".18" />
      {[-40, -20, 0, 20, 40].map((r, i) => <ellipse key={i} cx="75" cy="80" rx="13" ry="62" fill={tone} opacity={0.75 + i * 0.05} transform={`rotate(${r} 75 140)`} />)}
      <path d="M32 140 H118 L108 214 H42Z" fill="#B7774E" /><rect x="28" y="134" width="94" height="12" rx="3" fill="#C98A5E" />
    </svg>
  );
  return ( // stack of little pouches
    <svg viewBox="0 0 160 150" className="w-full" aria-hidden>
      <ellipse cx="80" cy="146" rx="70" ry="4" fill="#000" opacity=".18" />
      <rect x="10" y="96" width="140" height="48" rx="6" fill={tone} /><rect x="22" y="52" width="116" height="46" rx="6" fill="#F7F2E8" /><rect x="36" y="12" width="88" height="42" rx="6" fill={tone} opacity=".8" />
      <rect x="10" y="114" width="140" height="6" fill="#E8B21E" />
    </svg>
  );
}

function Shelf({ y }: { y: number }) {
  return (
    <div className="pointer-events-none absolute left-0" style={{ top: y, width: W }}>
      <div className="h-6 bg-gradient-to-b from-[#B48A5E] to-[#8C6640] shadow-[0_18px_30px_-12px_rgba(60,35,10,.55)]" />
      <div className="h-2 bg-[#6E4F31]" />
    </div>
  );
}

export function Pantry() {
  const view = useRef<HTMLDivElement>(null);
  const [vp, setVp] = useState({ w: 1200, h: 700 });
  const [zoom, setZoom] = useState(1);
  const x = useMotionValue(0), y = useMotionValue(0);
  const [selected, setSelected] = useState<{ id: string; slot: number } | null>(null);
  const [hinted, setHinted] = useState(true);
  const moved = useRef(0);

  const bounds = useCallback((z = zoom) => ({
    minX: Math.min(0, vp.w - W * z), minY: Math.min(0, vp.h - H * z), maxX: 0, maxY: 0,
  }), [vp, zoom]);
  const clamp = useCallback((nx: number, ny: number, z = zoom) => {
    const b = bounds(z);
    return [Math.max(b.minX, Math.min(b.maxX, nx)), Math.max(b.minY, Math.min(b.maxY, ny))] as const;
  }, [bounds, zoom]);

  // measure + choose zoom so a shelf row fills the viewport nicely
  useEffect(() => {
    const m = () => {
      const r = view.current!.getBoundingClientRect();
      if (!r.width) return;
      setVp({ w: r.width, h: r.height });
      const z = r.width < 640 ? 0.62 : r.width < 1024 ? 0.75 : Math.max(0.8, Math.min(1, r.height / 900));
      setZoom(z);
    };
    m();
    const ro = new ResizeObserver(m); ro.observe(view.current!);
    return () => ro.disconnect();
  }, []);
  // initial camera: centred on the top two shelves
  useEffect(() => {
    const [cx, cy] = clamp(vp.w / 2 - (W / 2) * zoom, vp.h / 2 - 560 * zoom, zoom);
    x.set(cx); y.set(cy);
  }, [vp, zoom]); // eslint-disable-line

  const panTo = (wx: number, wy: number) => {
    const panelW = vp.w >= 1024 ? 460 : 0;
    const visibleH = vp.w >= 1024 ? vp.h : vp.h * 0.38;
    const [tx, ty] = clamp((vp.w - panelW) / 2 - wx * zoom, visibleH / 2 - wy * zoom);
    animate(x, tx, { type: "spring", stiffness: 120, damping: 22 });
    animate(y, ty, { type: "spring", stiffness: 120, damping: 22 });
  };

  const pick = (i: number) => {
    const s = SLOTS[i]; if (s.kind !== "product") return;
    if (moved.current > 6) return; // was a drag, not a click
    setHinted(false);
    setSelected({ id: s.id, slot: i });
    panTo(s.x, SHELVES[s.shelf] - 140);
  };
  const pickById = (id: string) => { const i = SLOTS.findIndex((s) => s.kind === "product" && s.id === id); moved.current = 0; pick(i); };

  const onWheel = (e: React.WheelEvent) => {
    const [nx, ny] = clamp(x.get() - e.deltaX, y.get() - e.deltaY);
    x.set(nx); y.set(ny); setHinted(false);
  };
  const doZoom = (d: number) => {
    const nz = Math.max(0.5, Math.min(1.3, +(zoom + d).toFixed(2)));
    const cx = (vp.w / 2 - x.get()) / zoom, cy = (vp.h / 2 - y.get()) / zoom;
    setZoom(nz);
    const [nx, ny] = clamp(vp.w / 2 - cx * nz, vp.h / 2 - cy * nz, nz);
    x.set(nx); y.set(ny);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const step = 120, k = e.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(k)) return;
    e.preventDefault();
    const [nx, ny] = clamp(x.get() + (k === "ArrowLeft" ? step : k === "ArrowRight" ? -step : 0), y.get() + (k === "ArrowUp" ? step : k === "ArrowDown" ? -step : 0));
    animate(x, nx, { duration: 0.3 }); animate(y, ny, { duration: 0.3 });
  };

  const b = bounds();
  const product = selected ? products.find((p) => p.id === selected.id) : undefined;

  return (
    <section aria-label="Interactive pantry" className="relative h-[calc(100svh-84px)] min-h-[520px] overflow-hidden md:h-[calc(100svh-112px)]"
      style={{ background: "radial-gradient(120% 90% at 50% 0%, #F3E7D3 0%, #E6D3B5 60%, #D7BF9A 100%)" }}>
      <div ref={view} tabIndex={0} onKeyDown={onKey} onWheel={onWheel} aria-label="Pantry shelves. Drag or use arrow keys to explore, select a product to see details."
        className="absolute inset-0 cursor-grab touch-none outline-none active:cursor-grabbing">
        <motion.div
          drag dragMomentum dragElastic={0.08}
          dragConstraints={{ left: b.minX, right: b.maxX, top: b.minY, bottom: b.maxY }}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          onPointerDown={() => { moved.current = 0; }}
          onDrag={(_, i) => { moved.current += Math.abs(i.delta.x) + Math.abs(i.delta.y); if (moved.current > 6) setHinted(false); }}
          style={{ x, y, width: W * zoom, height: H * zoom }}
          className="relative"
        >
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${zoom})` }}>
            {/* back wall: soft tiles + a warm lamp glow */}
            <div className="grain absolute inset-0 opacity-70" />
            <div className="absolute inset-0 opacity-[.18]" style={{ backgroundImage: "linear-gradient(#fff6 1px, transparent 1px), linear-gradient(90deg, #fff6 1px, transparent 1px)", backgroundSize: "120px 120px" }} />
            <div className="absolute left-1/2 top-0 h-[700px] w-[1400px] -translate-x-1/2 rounded-full bg-[#FFF3D6] opacity-60 blur-[120px]" />
            {/* side posts */}
            <div className="absolute left-10 top-[120px] h-[1520px] w-5 bg-[#8C6640] shadow-lg" />
            <div className="absolute right-10 top-[120px] h-[1520px] w-5 bg-[#8C6640] shadow-lg" />
            {SHELVES.map((s) => <Shelf key={s} y={s} />)}

            {SLOTS.map((s, i) => {
              const bottom = SHELVES[s.shelf];
              if (s.kind === "decor") return <div key={i} className="pointer-events-none absolute" style={{ left: s.x - s.w / 2, width: s.w, bottom: H - bottom - 1 }}><Decor type={s.type} tone={s.tone} /></div>;
              const p = products.find((x) => x.id === s.id)!;
              const isSel = selected?.slot === i;
              return (
                <motion.button key={i} type="button" onClick={() => pick(i)} aria-label={`Discover ${p.name}`}
                  className="group absolute flex flex-col items-center outline-none" style={{ left: s.x - s.w / 2, width: s.w, bottom: H - bottom - 1 }}
                  animate={{ y: isSel ? -26 : 0, scale: isSel ? 1.08 : 1, opacity: selected && !isSel ? 0.55 : 1 }}
                  whileHover={{ y: isSel ? -26 : -12 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                  <span className="pointer-events-none mb-2 whitespace-nowrap rounded-full bg-forest px-3 py-1 text-[13px] text-ivory opacity-0 shadow-lift transition group-hover:opacity-100 group-focus-visible:opacity-100">{p.name}</span>
                  <Cutout product={p} className="mx-auto h-[250px] w-auto drop-shadow-[0_18px_14px_rgba(60,35,10,.4)]" />
                  {isSel && <motion.span layoutId="sel-ring" className="pointer-events-none absolute -bottom-3 h-3 w-3/4 rounded-[50%] bg-gold/70 blur-md" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* overlay title + hint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center bg-gradient-to-b from-[#F3E7D3] via-[#F3E7D3]/70 to-transparent pb-14 pt-6 text-center">
        <h1 className="font-serif text-4xl text-forest md:text-6xl">The MUKHWAS Pantry</h1>
        <p className="mt-2 flex items-center gap-3 text-[11px] uppercase tracking-[.28em] text-brown"><Hand className="h-3.5 w-3.5" />Drag to explore<span className="text-gold">·</span><MousePointerClick className="h-3.5 w-3.5" />Click to discover</p>
      </div>
      <AnimatePresence>
        {hinted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 grid place-items-center">
            <motion.div animate={{ x: [-40, 40, -40] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="grid h-16 w-16 place-items-center rounded-full bg-forest/85 text-ivory shadow-lift"><Hand className="h-6 w-6" /></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={cn("absolute bottom-5 flex gap-2 transition-all", product ? "left-5" : "right-5")}>
        <button onClick={() => doZoom(-0.1)} aria-label="Zoom out" className="grid h-11 w-11 place-items-center rounded-full bg-ivory/90 text-forest shadow-soft backdrop-blur hover:bg-ivory"><Minus className="h-4 w-4" /></button>
        <button onClick={() => doZoom(0.1)} aria-label="Zoom in" className="grid h-11 w-11 place-items-center rounded-full bg-ivory/90 text-forest shadow-soft backdrop-blur hover:bg-ivory"><Plus className="h-4 w-4" /></button>
      </div>

      <AnimatePresence>{product && <ProductPanel key="panel" product={product} onClose={() => setSelected(null)} onPick={pickById} />}</AnimatePresence>
    </section>
  );
}

