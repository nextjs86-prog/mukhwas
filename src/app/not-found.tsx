import { products } from "@/data/products";
import { Jar } from "@/components/ui/Visuals";
import { ButtonLink } from "@/components/ui/primitives";
import { AnnouncementBar, Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer, Toast } from "@/components/cart/Overlays";

export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="container grid min-h-[70vh] place-items-center py-16 text-center">
        <div>
          <Jar product={products[5]} className="mx-auto w-32 opacity-80" />
          <p className="mt-6 text-[11px] uppercase tracking-widest text-brown">Error 404</p>
          <h1 className="mt-2 font-serif text-5xl text-forest">This jar is empty</h1>
          <p className="mt-3 text-sm text-ink/60">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="mt-8 flex justify-center gap-3"><ButtonLink href="/">Go home</ButtonLink><ButtonLink href="/shop" variant="outline">Shop</ButtonLink></div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
