import Image from "next/image";
import { brand } from "@/config/brand";
import type { Product } from "@/types";

/** Deterministic pseudo-random generator so SSR and client render identically. */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}
const hash = (str: string) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

type Pal = Product["palette"];

/** Speckled seed texture used inside jars, bowls and ingredient swatches. */
function Seeds({ pal, x, y, w, h, n, seed, shape = "long" }: { pal: Pal; x: number; y: number; w: number; h: number; n: number; seed: number; shape?: string }) {
  const r = rng(seed);
  const items = Array.from({ length: n }, (_, i) => {
    const cx = x + r() * w, cy = y + r() * h, rot = r() * 180;
    const c = i % 3 === 0 ? pal.seed : i % 3 === 1 ? pal.fill : "#ffffff";
    const op = i % 3 === 2 ? 0.35 : 0.9;
    if (shape === "round") return <circle key={i} cx={cx} cy={cy} r={2 + r() * 2.2} fill={c} opacity={op} />;
    if (shape === "petal") return <ellipse key={i} cx={cx} cy={cy} rx={6 + r() * 4} ry={3 + r() * 2} fill={c} opacity={op} transform={`rotate(${rot} ${cx} ${cy})`} />;
    if (shape === "flake") return <rect key={i} x={cx} y={cy} width={7 + r() * 5} height={2.2} rx={1} fill={c} opacity={op} transform={`rotate(${rot} ${cx} ${cy})`} />;
    if (shape === "pod") return <ellipse key={i} cx={cx} cy={cy} rx={6} ry={3.6} fill={c} opacity={op} transform={`rotate(${rot} ${cx} ${cy})`} />;
    if (shape === "drop") return <ellipse key={i} cx={cx} cy={cy} rx={2.6} ry={1.6} fill={c} opacity={op} transform={`rotate(${rot} ${cx} ${cy})`} />;
    return <ellipse key={i} cx={cx} cy={cy} rx={4.6} ry={1.5} fill={c} opacity={op} transform={`rotate(${rot} ${cx} ${cy})`} />;
  });
  return <g>{items}</g>;
}

/** Premium apothecary-style glass jar. */
export function Jar({ product, className, showLabel = true }: { product: Pick<Product, "name" | "palette" | "slug">; className?: string; showLabel?: boolean }) {
  const p = product.palette;
  const id = `j${hash(product.slug)}`;
  const words = product.name.replace(/ Mukhwas$/, "").split(" ");
  return (
    <svg viewBox="0 0 240 300" className={className} role="img" aria-label={`${product.name} jar`}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".08" />
          <stop offset=".8" stopColor="#000" stopOpacity=".02" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" x2="1">
          <stop offset="0" stopColor="#9C7F45" /><stop offset=".35" stopColor="#F7D774" />
          <stop offset=".6" stopColor="#E8B21E" /><stop offset="1" stopColor="#8A6E3A" />
        </linearGradient>
        <clipPath id={`${id}c`}><rect x="38" y="78" width="164" height="196" rx="26" /></clipPath>
        <radialGradient id={`${id}s`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#000" stopOpacity=".22" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="120" cy="286" rx="96" ry="10" fill={`url(#${id}s)`} />
      <rect x="38" y="78" width="164" height="196" rx="26" fill={p.jar} />
      <g clipPath={`url(#${id}c)`}>
        <rect x="38" y="112" width="164" height="170" fill={p.fill} opacity=".85" />
        <path d="M38 116 Q80 104 120 114 T202 110 V126 H38Z" fill={p.seed} opacity=".25" />
        <Seeds pal={p} x={40} y={112} w={160} h={160} n={120} seed={hash(product.slug)} />
      </g>
      <rect x="38" y="78" width="164" height="196" rx="26" fill={`url(#${id}g)`} />
      <rect x="38.5" y="78.5" width="163" height="195" rx="25.5" fill="none" stroke="#fff" strokeOpacity=".7" />
      <rect x="52" y="90" width="10" height="150" rx="5" fill="#fff" opacity=".35" />
      {/* neck + lid */}
      <rect x="58" y="62" width="124" height="20" rx="6" fill={p.jar} />
      <rect x="50" y="26" width="140" height="42" rx="10" fill={`url(#${id}l)`} />
      <rect x="50" y="56" width="140" height="4" fill="#000" opacity=".12" />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={56 + i * 6} y="30" width="1.2" height="24" fill="#fff" opacity=".18" />)}
      {showLabel && (
        <g>
          <rect x="62" y="150" width="116" height="92" rx="4" fill="#FFFDF8" />
          <rect x="66" y="154" width="108" height="84" rx="2" fill="none" stroke={p.label} strokeOpacity=".35" />
          <text x="120" y="172" textAnchor="middle" fontSize="7.5" letterSpacing="3" fill={p.label} fontFamily="var(--font-sans), sans-serif">{brand.name}</text>
          <line x1="104" x2="136" y1="179" y2="179" stroke="#E8B21E" />
          {words.slice(0, 2).map((w, i) => (
            <text key={i} x="120" y={198 + i * 15} textAnchor="middle" fontSize="14" fill={p.label} fontFamily="var(--font-serif), serif">{w}</text>
          ))}
          <text x="120" y="232" textAnchor="middle" fontSize="6" letterSpacing="2" fill={p.label} opacity=".7" fontFamily="var(--font-sans), sans-serif">SMALL BATCH</text>
        </g>
      )}
    </svg>
  );
}

/** Product image: uses real photography if provided, otherwise the rendered jar on a soft backdrop. */
export function ProductVisual({ product, index = 0, className = "", sizes = "(max-width:768px) 50vw, 25vw", priority }: { product: Product; index?: number; className?: string; sizes?: string; priority?: boolean }) {
  if (product.combo && index === 0) return <div className={`absolute inset-0 flex items-center justify-center bg-cream ${className}`}><ComboBox product={product} className="w-[86%]" /></div>;
  const img = product.combo ? product.images?.[index - 1] : product.images?.[index];
  if (img) return <div className={`absolute inset-0 bg-white ${className}`}><Image src={img} alt={product.name} fill sizes={sizes} priority={priority} className="object-contain p-[4%]" /></div>;
  const p = product.palette;
  const isBox = product.category === "gift-hampers";
  const variants = [
    { bg: `radial-gradient(120% 90% at 50% 20%, #FFFDF8 0%, ${p.jar} 70%)`, jar: "w-[62%]" },
    { bg: `linear-gradient(160deg, ${p.jar}, #F7F2E8)`, jar: "w-[48%]" },
    { bg: `radial-gradient(90% 80% at 30% 30%, ${p.fill}33, #F7F2E8)`, jar: "w-[72%]" },
  ];
  const vv = variants[index % variants.length];
  return (
    <div className={`absolute inset-0 flex items-end justify-center overflow-hidden ${className}`} style={{ background: vv.bg }}>
      <svg className="absolute inset-0 h-full w-full opacity-[.35]" aria-hidden><Seeds pal={p} x={0} y={260} w={400} h={140} n={index === 2 ? 120 : 40} seed={hash(product.slug) + index} /></svg>
      {isBox ? <GiftBox product={product} className={`relative mb-[8%] ${vv.jar}`} /> : <Jar product={product} className={`relative mb-[6%] ${vv.jar} drop-shadow-sm`} />}
    </div>
  );
}

export function GiftBox({ product, className }: { product: Pick<Product, "palette" | "name" | "slug">; className?: string }) {
  return (
    <svg viewBox="0 0 300 240" className={className} role="img" aria-label={`${product.name} gift box`}>
      <ellipse cx="150" cy="226" rx="130" ry="10" fill="#000" opacity=".12" />
      <rect x="20" y="90" width="260" height="134" rx="6" fill="#9E1B1F" />
      <rect x="20" y="90" width="260" height="134" rx="6" fill="url(#gbsh)" />
      <defs><linearGradient id="gbsh" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".08" /><stop offset="1" stopColor="#000" stopOpacity=".15" /></linearGradient></defs>
      <rect x="12" y="66" width="276" height="34" rx="5" fill="#D7262E" />
      <rect x="138" y="66" width="24" height="158" fill="#E8B21E" />
      <rect x="12" y="74" width="276" height="0" />
      <path d="M150 66 C120 30 86 36 100 60 C108 70 138 68 150 66Z" fill="#E8B21E" />
      <path d="M150 66 C180 30 214 36 200 60 C192 70 162 68 150 66Z" fill="#B8975A" />
      <circle cx="150" cy="64" r="8" fill="#F7D774" />
      <text x="80" y="170" textAnchor="middle" fontSize="11" letterSpacing="3" fill="#F7D774" fontFamily="var(--font-sans), sans-serif">{brand.name}</text>
      <text x="222" y="170" textAnchor="middle" fontSize="13" fill="#F7D774" fontFamily="var(--font-serif), serif" fontStyle="italic">Gift</text>
    </svg>
  );
}

/** Ingredient close-up "photograph" stand-in: a bowl of seeds on linen. */
export function IngredientVisual({ tone, seed, shape, label }: { tone: string; seed: string; shape: string; label: string }) {
  const pal = { jar: tone, fill: tone, seed, label: seed };
  const h = hash(label);
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label={label}>
      <rect width="300" height="300" fill="#EFE7D8" />
      {Array.from({ length: 30 }, (_, i) => <line key={i} x1="0" x2="300" y1={i * 10} y2={i * 10 + 4} stroke="#000" strokeOpacity=".025" />)}
      <ellipse cx="150" cy="190" rx="128" ry="34" fill="#000" opacity=".08" />
      <ellipse cx="150" cy="150" rx="120" ry="120" fill="#FBF8F1" />
      <ellipse cx="150" cy="150" rx="102" ry="102" fill={tone} />
      <clipPath id={`ic${h}`}><circle cx="150" cy="150" r="100" /></clipPath>
      <g clipPath={`url(#ic${h})`}><Seeds pal={pal} x={40} y={40} w={220} h={220} n={shape === "petal" ? 120 : 420} seed={h} shape={shape} /></g>
      <circle cx="150" cy="150" r="102" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
      <g opacity=".9"><Seeds pal={pal} x={10} y={250} w={120} h={40} n={18} seed={h + 3} shape={shape} /></g>
    </svg>
  );
}

/** Editorial scene: jars arranged on a table — stand-in for brand photography. */
export function EditorialScene({ items, dark = false, className = "" }: { items: Product[]; dark?: boolean; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: dark ? "radial-gradient(100% 80% at 50% 10%, #D7262E 0%, #9E1B1F 70%)" : "radial-gradient(100% 80% at 50% 10%, #FFFDF8 0%, #EFE6D6 80%)" }}>
      <div className="absolute inset-x-0 bottom-0 h-[30%]" style={{ background: dark ? "#7A1216" : "#E5D9C3" }} />
      <div className="absolute inset-x-0 bottom-[30%] h-px bg-black/10" />
      <div className="absolute inset-0 flex items-end justify-center gap-[3%] pb-[18%]">
        {items.slice(0, 3).map((p, i) => (
          <Jar key={p.id} product={p} className={i === 1 ? "w-[34%]" : "mb-[1%] w-[26%]"} />
        ))}
      </div>
    </div>
  );
}

/**
 * Product "cutout" for scenes (carousel, pantry, product hero).
 * Photos have white backgrounds, so mix-blend-multiply makes the white disappear on light backdrops.
 * Falls back to the drawn jar/box when no photo exists.
 */
export function Cutout({ product, className = "", priority }: { product: Product; className?: string; priority?: boolean }) {
  if (product.combo) return <ComboBox product={product} className={className} />;
  const src = product.cutout;
  if (src) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={product.name} draggable={false} loading={priority ? "eager" : "lazy"} decoding="async"
      className={`pointer-events-none select-none ${className}`} />
  );
  return product.category === "gift-hampers" ? <GiftBox product={product} className={className} /> : <Jar product={product} className={className} />;
}

/** Open gift tray with 4 product bottles standing inside — built from the real cutouts. */
export function ComboBox({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`relative aspect-[1.35/1] ${className}`} role="img" aria-label={`${product.name} gift box`}>
      {/* back wall with handle */}
      <div className="absolute inset-x-[4%] bottom-[28%] top-[6%] rounded-t-[10px] bg-[#F4EEE2] shadow-inner" style={{ backgroundImage: "radial-gradient(#d9cdb4 1px, transparent 1.4px)", backgroundSize: "10px 10px" }}>
        <div className="mx-auto mt-[5%] h-[12%] w-[30%] rounded-full bg-[#FBF5EC] shadow-[inset_0_2px_6px_rgba(0,0,0,.25)]" />
      </div>
      {/* bottles */}
      <div className="absolute inset-x-[9%] bottom-[16%] top-[18%] flex items-end justify-center gap-[1%]">
        {(product.images ?? []).map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src.replace("/products/", "/products/cut/").replace(".jpg", ".png")} alt="" draggable={false} className="h-full w-auto object-contain" />
        ))}
      </div>
      {/* front panel */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] rounded-b-[12px] shadow-[0_-6px_14px_-6px_rgba(0,0,0,.25)]" style={{ backgroundColor: "#F6EFE1", backgroundImage: "radial-gradient(#ddd0b4 1px, transparent 1.4px), linear-gradient(#FFFDF8, #EADFC9)", backgroundSize: "9px 9px, 100% 100%" }}>
        <p className="absolute inset-0 grid place-items-center font-serif text-[clamp(11px,2.6vw,30px)] font-semibold italic text-forest">{product.name}</p>
      </div>
      <span className="absolute -right-[4%] -top-[4%] grid aspect-square w-[24%] rotate-12 place-items-center rounded-full bg-[#D9472B] text-center font-serif text-[clamp(8px,1.6vw,18px)] uppercase leading-none text-white shadow-lg ring-2 ring-dashed ring-white/60">Combo<br />of 4</span>
    </div>
  );
}
