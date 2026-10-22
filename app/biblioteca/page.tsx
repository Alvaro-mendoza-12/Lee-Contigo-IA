import { redirect } from "next/navigation";
import { getLevel } from "@/lib/stories";
// The library now lives on the home page; keep old links working.
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  redirect(`/?nivel=${getLevel(nivel)}`);
}
