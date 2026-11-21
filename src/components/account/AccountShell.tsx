"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart, LogOut, MapPin, Package, Truck, User } from "lucide-react";
import { useShop } from "@/lib/store";
import { useHydrated } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/orders/track", label: "Track order", icon: Truck },
];

/** Client-side gate for the DEMO. Real protection must use Supabase Auth + middleware/server checks. */
export function AccountShell({ children, title, allowGuest = false }: { children: React.ReactNode; title: string; allowGuest?: boolean }) {
  const hydrated = useHydrated();
  const user = useShop((s) => s.user);
  const logout = useShop((s) => s.logout);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (hydrated && !user && !allowGuest) router.replace(`/account/login?next=${encodeURIComponent(path)}`); }, [hydrated, user, allowGuest, router, path]);

  if (!hydrated || (!user && !allowGuest)) return <div className="container py-24 text-center text-sm text-ink/50">Loading your account…</div>;

  return (
    <div className="container py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-widest text-brown">{user ? `Namaste, ${user.name.split(" ")[0]}` : "Your account"}</p>
      <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">{title}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <nav aria-label="Account" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm transition lg:rounded-xl", path === href ? "bg-forest text-ivory" : "text-forest hover:bg-cream")}><Icon className="h-4 w-4" />{label}</Link>
          ))}
          {user && <button onClick={() => { logout(); router.push("/"); }} className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm text-ink/60 hover:bg-cream lg:rounded-xl"><LogOut className="h-4 w-4" />Log out</button>}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
