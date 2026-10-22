import { Library } from "@/components/library";
import { getLevel } from "@/lib/stories";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  return <Library key={getLevel(nivel)} initialLevel={getLevel(nivel)} />;
}
