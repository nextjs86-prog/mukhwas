"use client";
import { usePathname } from "next/navigation";

/** CSS-only page fade: content is never hidden if JS is slow or disabled. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div key={path} className="page-enter">{children}</div>;
}
