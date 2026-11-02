import { BibliotecaXP } from "@/components/biblioteca-xp";
import { getLevel, stories } from "@/lib/stories";
import { storyCatalogue } from "@/lib/story-catalogue";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  return (
    <BibliotecaXP
      key={getLevel(nivel)}
      initialLevel={getLevel(nivel)}
      catalogue={storyCatalogue(stories)}
    />
  );
}
