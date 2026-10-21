import type { Metadata } from "next";
import { Library } from "@/components/library";
export const metadata: Metadata = { title: "Elige una historia" };
export default function LibraryPage() {
  return <Library />;
}
