import { Suspense } from "react";
import type { Metadata } from "next";
import { Building2, Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Package, Phone, Youtube } from "lucide-react";
import { brand } from "@/config/brand";
import { PageHero, Reveal } from "@/components/ui/primitives";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact Us", description: `Get in touch with ${brand.name} for orders, business enquiries and bulk gifting.` };

export default function ContactPage() {
  const cards = [
    { icon: Mail, t: "Email", v: brand.contact.email, href: `mailto:${brand.contact.email}` },
    { icon: Phone, t: "Phone", v: brand.contact.phone, href: `tel:${brand.contact.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, t: "WhatsApp", v: "Chat with us", href: `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}, I have a question.`)}` },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title={<>We&apos;d love to <em className="text-emerald">hear from you</em></>} intro="Questions about an order, a business partnership or a large gifting requirement — write to us and we'll get back within 1–2 business days." />
      <section className="container grid gap-10 py-14 md:py-20 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <div className="space-y-4">
          {cards.map(({ icon: Icon, t, v, href }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-5 rounded-[24px] bg-cream p-6 transition hover:shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-gold"><Icon className="h-5 w-5" /></span>
                <span><span className="block text-[11px] uppercase tracking-widest text-brown">{t}</span><span className="font-serif text-xl text-forest">{v}</span></span>
              </a>
            </Reveal>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <a href="#form" className="rounded-[24px] border border-forest/10 p-5"><Building2 className="h-5 w-5 text-gold" /><p className="mt-3 font-serif text-lg text-forest">Business enquiry</p><p className="text-xs text-ink/55">Retail, distribution & collaborations</p></a>
            <a href="/contact?type=bulk#form" className="rounded-[24px] border border-forest/10 p-5"><Package className="h-5 w-5 text-gold" /><p className="mt-3 font-serif text-lg text-forest">Bulk orders</p><p className="text-xs text-ink/55">Weddings, events & corporate</p></a>
          </div>
          <div className="rounded-[24px] border border-forest/10 p-6 text-sm text-ink/65">
            <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{brand.contact.address}</p>
            <p className="mt-3 flex items-center gap-3"><Clock className="h-4 w-4 text-gold" />{brand.contact.hours}</p>
            <div className="mt-5 flex gap-2">
              {[[Instagram, brand.social.instagram, "Instagram"], [Facebook, brand.social.facebook, "Facebook"], [Youtube, brand.social.youtube, "YouTube"]].map(([I, h, l]) => {
                const Icon = I as typeof Instagram;
                return <a key={l as string} href={h as string} target="_blank" rel="noopener noreferrer" aria-label={l as string} className="grid h-10 w-10 place-items-center rounded-full border border-forest/15 text-forest hover:bg-forest hover:text-ivory"><Icon className="h-4 w-4" /></a>;
              })}
            </div>
            <p className="mt-4 text-[11px] text-ink/40">Contact details are placeholders — update in src/config/brand.ts.</p>
          </div>
        </div>
        <div id="form" className="scroll-mt-28 rounded-[28px] bg-ivory p-6 shadow-lift md:p-10">
          <h2 className="font-serif text-3xl text-forest">Send us a message</h2>
          <p className="mb-8 mt-2 text-sm text-ink/60">All fields marked * are required.</p>
          <Suspense><ContactForm /></Suspense>
        </div>
      </section>
    </>
  );
}
