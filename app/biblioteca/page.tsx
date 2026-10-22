import type { Metadata } from "next";
import { Library } from "@/components/library";
import { getLevel } from "@/lib/stories";
export const metadata: Metadata = { title: "Elige una historia" };
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  return <Library key={getLevel(nivel)} initialLevel={getLevel(nivel)} />;
}
