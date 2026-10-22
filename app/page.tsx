import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Pencil } from "lucide-react";
import { StoryShowcase } from "@/components/story-showcase";
import { ReadingFriend } from "@/components/reading-friend";
import { stories } from "@/lib/stories";
export default function Home() {
  return (
    <div className="storybook-home">
      <section
        className="hero container child-hero cover-welcome"
        aria-labelledby="home-title"
      >
        <div className="hero-copy">
          <h1 id="home-title">¿Leemos un cuento?</h1>
          <Link className="button" href="/leer/luz-del-bosque?nivel=paso">
            <BookOpen size={23} aria-hidden="true" /> Leer un cuento{" "}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
        <div className="cover-stage">
          <span className="cover-friend" aria-hidden="true">
            <ReadingFriend />
          </span>
          <StoryShowcase
            covers={stories
              .slice(0, 4)
              .map(({ id, title, art }) => ({ id, title, art }))}
          />
        </div>
      </section>
      <section className="container home-chapters" aria-label="Más aventuras">
        <div className="chapter-paths">
          <Link className="chapter-path chapter-library" href="/biblioteca">
            <span className="chapter-icon">
              <BookOpen size={30} aria-hidden="true" />
            </span>
            <span>
              <strong>Más cuentos</strong>
            </span>
            <ArrowRight size={24} aria-hidden="true" />
          </Link>
          <Link className="chapter-path chapter-create" href="/crear">
            <span className="chapter-icon">
              <Pencil size={30} aria-hidden="true" />
              <Sparkles size={15} aria-hidden="true" />
            </span>
            <span>
              <strong>Crear un cuento</strong>
            </span>
            <ArrowRight size={24} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
