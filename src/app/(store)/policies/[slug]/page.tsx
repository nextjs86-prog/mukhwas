import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { PageHero } from "@/components/ui/primitives";

const policies: Record<string, { title: string; body: [string, string][] }> = {
  shipping: { title: "Shipping Policy", body: [["Dispatch", "Orders are typically dispatched within 1–2 business days."], ["Charges", `Free shipping on orders above ₹${brand.commerce.freeShippingThreshold}. Otherwise a flat ₹${brand.commerce.shippingFee} applies.`], ["Delivery times", "Delivery estimates depend on your PIN code and courier partner."]] },
  returns: { title: "Returns & Refunds", body: [["Food products", "For hygiene reasons, opened food products cannot be returned."], ["Damaged items", "If your order arrives damaged, contact us within 48 hours with photos and we'll arrange a replacement or refund."], ["Refund timelines", "Approved refunds are processed to the original payment method."]] },
  privacy: { title: "Privacy Policy", body: [["What we collect", "Name, contact details and address required to fulfil your order."], ["How we use it", "To process orders, provide support and — if you opt in — send updates."], ["Payments", "Card and UPI details are handled by our payment partner and never stored on our servers."]] },
  terms: { title: "Terms of Service", body: [["Use of site", "By using this site you agree to these terms."], ["Pricing", "Prices and availability may change without notice."], ["Liability", "Please check ingredient lists for allergens before consuming."]] },
  faq: { title: "Frequently Asked Questions", body: [["Do your products contain tobacco or supari?", "No. Our paan blend is made without tobacco or supari."], ["How should I store mukhwas?", "In a cool, dry place with the lid tightly closed."], ["Do you ship across India?", "We aim to ship to most serviceable PIN codes. Use the checker on any product page."], ["Can I order in bulk?", "Yes — visit our Contact or Gift Hampers page to send a bulk enquiry."]] },
};

export function generateStaticParams() { return Object.keys(policies).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = policies[(await params).slug]; return p ? { title: p.title } : {};
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = policies[(await params).slug];
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow="Customer care" title={p.title} intro="Template content — have this reviewed and finalised before launch." />
      <article className="container max-w-3xl space-y-8 py-14 md:py-20">
        {p.body.map(([h, t]) => <section key={h}><h2 className="font-serif text-2xl text-forest">{h}</h2><p className="mt-2 text-[15px] leading-relaxed text-ink/70">{t}</p></section>)}
        <p className="border-t border-forest/10 pt-6 text-sm text-ink/55">Questions? Email <a href={`mailto:${brand.contact.email}`} className="text-forest underline">{brand.contact.email}</a>.</p>
      </article>
    </>
  );
}
