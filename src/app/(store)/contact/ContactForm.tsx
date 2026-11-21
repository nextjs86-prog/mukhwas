"use client";
import { useSearchParams } from "next/navigation";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export function ContactForm() {
  const type = useSearchParams().get("type") ?? "general";
  return <EnquiryForm key={type} defaultType={type} showQty={type === "bulk"} types={["general", "order", "business", "bulk", "corporate"]} />;
}
