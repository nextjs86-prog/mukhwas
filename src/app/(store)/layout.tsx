import { AnnouncementBar, Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer, QuickView, Toast } from "@/components/cart/Overlays";
import { PageTransition } from "@/components/layout/PageTransition";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { FooterGate } from "@/components/layout/FooterGate";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
      <AnnouncementBar />
      <Header />
      <main id="main"><PageTransition>{children}</PageTransition></main>
      <FooterGate><Footer /></FooterGate>
      <CartDrawer />
      <QuickView />
      <Toast />
      <WhatsAppFab />
    </>
  );
}
