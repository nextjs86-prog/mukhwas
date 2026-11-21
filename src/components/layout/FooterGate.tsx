"use client";
import { usePathname } from "next/navigation";

/** Hides the footer on the homepage so only the product carousel shows. */
export function FooterGate({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
