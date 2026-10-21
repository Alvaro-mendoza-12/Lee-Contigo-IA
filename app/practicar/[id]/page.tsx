import { notFound } from "next/navigation";
import { getStory, getLevel } from "@/lib/stories";
import { Practice } from "@/components/practice";
export const metadata = { title: "Explora lo que leíste" };
export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nivel?: string }>;
}) {
  const [{ id }, { nivel }] = await Promise.all([params, searchParams]);
  const story = getStory(id);
  if (!story) notFound();
  return (
    <Practice
      key={id + getLevel(nivel)}
      story={story}
      level={getLevel(nivel)}
    />
  );
}
