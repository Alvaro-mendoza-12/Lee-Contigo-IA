import { BibliotecaXP } from "@/components/biblioteca-xp";
import { getLevel } from "@/lib/stories";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  return <BibliotecaXP key={getLevel(nivel)} initialLevel={getLevel(nivel)} />;
}
