import { notFound } from "next/navigation";
import { getStory, getLevel, stories } from "@/lib/stories";
import { Reader } from "@/components/reader";
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
  searchParams: Promise<{ nivel?: string }>;
}) {
  const [{ id }, { nivel }] = await Promise.all([params, searchParams]);
  const story = getStory(id);
  if (!story) notFound();
  return <Reader story={story} level={getLevel(nivel)} />;
}
