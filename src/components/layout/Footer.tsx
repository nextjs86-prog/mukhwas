import Link from "next/link";
import { Facebook, Instagram, Mail, MessageCircle, Phone, Youtube } from "lucide-react";
import { brand } from "@/config/brand";
import { Logo } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const cols = [
  { title: "Shop", links: [["All Products", "/shop"], ["Best Sellers", "/shop?filter=bestseller"], ["Categories", "/categories"], ["Gift Hampers", "/gifts"], ["New Arrivals", "/shop?sort=newest"]] },
  { title: "Customer Care", links: [["My Account", "/account"], ["Track Order", "/orders/track"], ["Contact Us", "/contact"], ["Bulk Orders", "/contact?type=bulk"], ["FAQs", "/policies/faq"]] },
  { title: "Policies", links: [["Shipping Policy", "/policies/shipping"], ["Returns & Refunds", "/policies/returns"], ["Privacy Policy", "/policies/privacy"], ["Terms of Service", "/policies/terms"]] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest text-ivory">
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full border border-gold/10" />
      <div className="container relative grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo light className="!items-start" />
          <p className="mt-6 text-sm leading-relaxed text-ivory/65">{brand.description}</p>
          <p className="mt-8 text-[11px] uppercase tracking-widest text-gold">Join our letter</p>
          <p className="mt-2 text-sm text-ivory/65">New blends, festive edits and recipes — no spam.</p>
          <div className="mt-4"><NewsletterForm dark /></div>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="mb-5 text-[11px] uppercase tracking-widest text-gold">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map(([l, h]) => <li key={h}><Link href={h} className="text-sm text-ivory/75 transition hover:text-ivory">{l}</Link></li>)}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3">
            <p className="mb-4 text-[11px] uppercase tracking-widest text-gold">Customer Support</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ivory/75">
              <a href={`mailto:${brand.contact.email}`} className="flex items-center gap-2 hover:text-ivory"><Mail className="h-4 w-4 text-gold" />{brand.contact.email}</a>
              <a href={`tel:${brand.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-ivory"><Phone className="h-4 w-4 text-gold" />{brand.contact.phone}</a>
              <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ivory"><MessageCircle className="h-4 w-4 text-gold" />WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-ivory/50 md:flex-row">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved. Demo storefront — prices, ratings and reviews are sample content.</p>
          <div className="flex gap-2">
            {[[Instagram, brand.social.instagram, "Instagram"], [Facebook, brand.social.facebook, "Facebook"], [Youtube, brand.social.youtube, "YouTube"]].map(([Icon, href, label]) => {
              const I = Icon as typeof Instagram;
              return <a key={label as string} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="grid h-9 w-9 place-items-center rounded-full border border-ivory/15 text-ivory/70 transition hover:border-gold hover:text-gold"><I className="h-4 w-4" /></a>;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
