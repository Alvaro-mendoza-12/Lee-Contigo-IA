import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { StoryShowcase } from "@/components/story-showcase";
import { stories } from "@/lib/stories";
export default function Home() {
  return (
    <>
      <section className="hero container child-hero">
        <div className="hero-copy">
          <span className="welcome-mark" aria-hidden="true">
            <BookOpen size={25} />
          </span>
          <h1>
            Leer se disfruta
            <br />
            más <span>contigo.</span>
          </h1>
          <p>
            Abre un cuento. Imagina, descubre y encuentra pistas a tu ritmo.
          </p>
          <Link className="button" href="/leer/luz-del-bosque?nivel=paso">
            Leer un cuento <ArrowRight size={20} aria-hidden="true" />
          </Link>
          <Link className="home-library-link" href="/biblioteca">
            Ver los 10 cuentos <BookOpen size={18} aria-hidden="true" />
          </Link>
        </div>
        <StoryShowcase
          covers={stories
            .slice(0, 4)
            .map(({ id, title, art }) => ({ id, title, art }))}
        />
      </section>
      <section className="container imagination-invite">
        <Sparkles size={25} aria-hidden="true" />
        <div>
          <h2>¿Y si el cuento empieza con tu idea?</h2>
          <p>Imagina un personaje y descubre su aventura.</p>
        </div>
        <Link className="button button-outline" href="/crear">
          Crear mi cuento <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
