import type { Metadata } from "next";
import { Pantry } from "@/components/pantry/Pantry";
export const metadata: Metadata = { title: "The Pantry", description: "Drag to explore our mukhwas pantry and click any jar to discover it." };
export default function PantryPage() { return <Pantry />; }
