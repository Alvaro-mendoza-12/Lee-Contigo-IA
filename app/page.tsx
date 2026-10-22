import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Pencil,
  Star,
  Headphones,
  Lightbulb,
} from "lucide-react";
import { StoryShowcase } from "@/components/story-showcase";
import { stories } from "@/lib/stories";
export default function Home() {
  return (
    <div className="storybook-home">
      <section
        className="hero container child-hero cover-welcome"
        aria-labelledby="home-title"
      >
        <div className="hero-copy">
          <div className="cover-bookmark">
            <Star size={17} fill="currentColor" aria-hidden="true" /> Tu rincón
            de historias
          </div>
          <h1 id="home-title">
            Abre un cuento.
            <br />
            Empieza la aventura.
          </h1>
          <p>Pequeños lectores, grandes descubrimientos.</p>
          <Link className="button" href="/leer/luz-del-bosque?nivel=paso">
            <BookOpen size={23} aria-hidden="true" /> Leer un cuento{" "}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
          <ul
            className="cover-reading-tools"
            aria-label="Tu cuento te acompaña"
          >
            <li>
              <BookOpen size={19} aria-hidden="true" /> Lee
            </li>
            <li>
              <Headphones size={19} aria-hidden="true" /> Escucha
            </li>
            <li>
              <Lightbulb size={19} aria-hidden="true" /> Descubre
            </li>
          </ul>
        </div>
        <div className="cover-stage">
          <span className="cover-sun" aria-hidden="true">
            <Star size={32} fill="currentColor" />
          </span>
          <StoryShowcase
            covers={stories
              .slice(0, 4)
              .map(({ id, title, art }) => ({ id, title, art }))}
          />
        </div>
      </section>
      <section
        className="container home-chapters"
        aria-labelledby="home-chapters-title"
      >
        <h2 id="home-chapters-title">¿Qué aventura eliges?</h2>
        <div className="chapter-paths">
          <Link className="chapter-path chapter-library" href="/biblioteca">
            <span className="chapter-icon">
              <BookOpen size={30} aria-hidden="true" />
            </span>
            <span>
              <strong>Explora la biblioteca</strong>
              <small>10 cuentos para descubrir</small>
            </span>
            <ArrowRight size={24} aria-hidden="true" />
          </Link>
          <Link className="chapter-path chapter-create" href="/crear">
            <span className="chapter-icon">
              <Pencil size={30} aria-hidden="true" />
              <Sparkles size={15} aria-hidden="true" />
            </span>
            <span>
              <strong>Inventa tu cuento</strong>
              <small>Tu idea se convierte en un libro</small>
            </span>
            <ArrowRight size={24} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
