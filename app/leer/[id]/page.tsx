import { notFound } from "next/navigation";
import { getStory, getLevel, stories } from "@/lib/stories";
import { Reader } from "@/components/reader";
import { GuardiaCuento } from "@/components/guardia-cuento";
import { getReadingGoal } from "@/lib/reading";
export function generateStaticParams() {
  return stories.map((story) => ({ id: story.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: getStory(id)?.title ?? "Historia no encontrada" };
}
export default async function StoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nivel?: string; juntos?: string; objetivo?: string }>;
}) {
  const [{ id }, { nivel, juntos, objetivo }] = await Promise.all([
    params,
    searchParams,
  ]);
  const story = getStory(id);
  if (!story) notFound();
  return (
    <GuardiaCuento storyId={story.id} level={getLevel(nivel)}>
      <Reader
        key={id + getLevel(nivel) + (juntos ?? "") + (objetivo ?? "")}
        story={story}
        initialLevel={getLevel(nivel)}
        accompanied={juntos === "1"}
        goal={getReadingGoal(objetivo)}
      />
    </GuardiaCuento>
  );
}
