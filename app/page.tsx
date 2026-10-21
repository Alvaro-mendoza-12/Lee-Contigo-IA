import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Sprout,
  HeartHandshake,
  Check,
  Clock3,
  Leaf,
} from "lucide-react";
import { StoryArt } from "@/components/art";
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-leaf">
              <Leaf size={15} />
            </span>{" "}
            UN MUNDO EN CADA HISTORIA
          </div>
          <h1>
            Leer se disfruta
            <br />
            más <span>contigo.</span>
            <span className="heading-spark" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p>
            Historias para imaginar, preguntas para descubrir
            <br className="desktop-break" /> y una pequeña pista cuando la
            necesites.
            <br className="desktop-break" /> Todo, a tu ritmo.
          </p>
          <Link className="button" href="/biblioteca">
            Elige tu primera historia <ArrowRight size={19} />
          </Link>
          <div className="hero-reassurance">
            <span>
              <Check size={16} /> Sin crear una cuenta
            </span>
            <span>
              <Clock3 size={16} /> Unos minutos para ti
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-note note-top">
            <span className="note-icon">
              <Sparkles size={18} />
            </span>
            <span>
              La curiosidad empieza
              <br />
              <strong>con una historia.</strong>
            </span>
          </div>
          <div className="hero-story">
            <div className="hero-art">
              <StoryArt variant="night" />
            </div>
            <div className="hero-book-caption">
              <div>
                <span className="small-label">TU PRÓXIMA AVENTURA</span>
                <h2>Una luz en el bosque</h2>
              </div>
              <Link
                href="/leer/luz-del-bosque?nivel=paso"
                className="circle-link"
                aria-label="Leer Una luz en el bosque"
              >
                <ArrowRight size={23} />
              </Link>
            </div>
          </div>
          <div className="floating-note note-bottom">
            <span className="note-icon warm">
              <BookOpen size={18} />
            </span>
            <span>
              Un paso a la vez.
              <br />
              <strong>Vas muy bien.</strong>
            </span>
          </div>
          <span className="visual-dots" aria-hidden="true">
            ···
          </span>
        </div>
      </section>
      <section className="promise-strip">
        <div className="container promises">
          <span>
            <Sprout size={21} /> Lecturas que crecen contigo
          </span>
          <span>
            <Sparkles size={21} /> Pistas que te ayudan a pensar
          </span>
          <span>
            <HeartHandshake size={21} /> Un espacio tranquilo y sin anuncios
          </span>
        </div>
      </section>
      <section className="container how-section" id="como-funciona">
        <div className="section-heading">
          <div>
            <span className="small-label">ASÍ DE SENCILLO</span>
            <h2>Tu aventura, en tres pequeños pasos.</h2>
          </div>
          <span className="handwritten">¡Tú marcas el ritmo!</span>
        </div>
        <div className="how-grid">
          {[
            {
              n: "01",
              title: "Encuentra tu historia",
              text: "Elige lo que te dé curiosidad. Tenemos un pequeño mundo para ti.",
              icon: BookOpen,
            },
            {
              n: "02",
              title: "Lee sin prisa",
              text: "Acomoda la letra y disfruta. Puedes volver a leer cuando quieras.",
              icon: Sprout,
            },
            {
              n: "03",
              title: "Descubre un poco más",
              text: "Explora lo que leíste. Si te atoras, una pista te acompaña.",
              icon: Sparkles,
            },
          ].map(({ n, title, text, icon: Icon }) => (
            <article className="how-card" key={n}>
              <div className="how-card-top">
                <span className="how-icon">
                  <Icon size={23} />
                </span>
                <span className="how-number">{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container adult-banner">
        <div className="adult-icon">
          <HeartHandshake size={34} />
        </div>
        <div>
          <span className="small-label">PARA QUIENES ACOMPAÑAN</span>
          <h2>Una ayuda para leer juntos.</h2>
          <p>
            Conoce cómo acompañamos la comprensión lectora y qué puede hacer la
            IA.
          </p>
        </div>
        <Link href="/acompanar" className="button button-outline">
          Conocer el proyecto <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
