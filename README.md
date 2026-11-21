# MUKHWAS — Premium Mukhwas E-commerce (Milestone 1: Frontend)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion · Zustand · Lucide.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Rebrand
Everything brand-related lives in `src/config/brand.ts` (name, colours, contact, socials, shipping thresholds, announcements). Colour tokens are mirrored in `tailwind.config.ts`.

## Structure
- `src/app/(store)/…` storefront: home, shop, categories, product, cart, checkout, account/*, orders/track, orders/confirmation, about, contact, gifts, policies
- `src/app/admin/[[...section]]` admin dashboard (overview, products, orders, inventory, categories, coupons, customers, reviews, banners, enquiries, reports)
- `src/app/api/*` orders (server-side re-pricing), payments/verify (Razorpay HMAC), payments/webhook, enquiries, newsletter
- `src/data/*` DEMO products, reviews, coupons, orders — all clearly marked as sample
- `src/components/ui/Visuals.tsx` rendered jar/ingredient visuals used until real photography exists. Add photos via `images: [...]` on a product.

## What is demo-only (NOT production-ready)
- **Auth** (customer + admin) is a local, insecure demo gate. Replace with Supabase Auth, middleware + server-side role checks, and RLS.
- **Cart, wishlist, orders, addresses, admin edits** are stored in browser localStorage. Admin edits don't affect the storefront.
- **Razorpay**: order creation + signature verification + webhook routes exist but are untested until keys are set in `.env.local` (see `.env.example`). Without keys, online payment returns a clear "not configured" error; COD works.
- **Shiprocket**: PIN checker and tracking are simulated (`estimateDelivery`, demo tracking events).
- **Enquiries / newsletter / reviews** are validated server-side but not stored or emailed.
- Fonts load from Google Fonts at runtime (build-time `next/font` fetch failed in this environment).
- Brand claims, About-page history, certifications, policies and contact details are placeholders to verify.
