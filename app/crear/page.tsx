import type { Metadata } from "next";
import { StoryCreator } from "@/components/story-creator";

export const metadata: Metadata = {
  title: "Crea tu cuento con IA",
  description:
    "Imagina una historia, léela como un libro y descubre qué aprendiste.",
};

export default function CreateStoryPage() {
  return <StoryCreator />;
}
