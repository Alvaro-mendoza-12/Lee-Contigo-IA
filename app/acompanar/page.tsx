import Link from "next/link";
import { CompanionPlanner } from "@/components/companion-planner";
import { stories } from "@/lib/stories";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Check,
  Leaf,
} from "lucide-react";
export const metadata = { title: "Acompañar" };
export default function Guide() {
  return (
    <div className="container guide-page">
      <header className="page-heading">
        <span className="small-label">
          ACOMPAÑAR · PARA FAMILIAS Y DOCENTES
        </span>
        <h1>
          Un pequeño rato.
          <br />
          Una gran conversación.
        </h1>
        <p>
          Una experiencia para practicar la comprensión, con el acompañamiento
          de una persona adulta cuando haga falta.
        </p>
      </header>
      <CompanionPlanner
        stories={stories.map(({ id, title }) => ({ id, title }))}
      />
      <section className="guide-intro">
        <span className="guide-intro-icon">
          <HeartHandshake size={38} />
        </span>
        <div>
          <h2>Acompañar sin dar todas las respuestas.</h2>
          <p>
            Pregunta qué imagina, escucha su explicación y anímale a buscar una
            frase del relato. No hay notas, carreras ni comparaciones. Cada
            intento es una oportunidad para comprender.
          </p>
        </div>
      </section>
      <div className="guide-grid">
        <section className="guide-card">
          <BookOpen size={26} />
          <h2>¿Cómo usarlo?</h2>
          <ol>
            <li>Elijan una historia y un nivel de práctica.</li>
            <li>Lean con calma. Pueden ampliar la letra o escucharla.</li>
            <li>Exploren las tres preguntas. El relato sigue a mano.</li>
            <li>Pidan una pista y conversen sobre lo descubierto.</li>
          </ol>
        </section>
        <section className="guide-card">
          <Sparkles size={26} />
          <h2>¿Qué hace la IA?</h2>
          <p>
            En los cuentos creados a partir de una idea, prepara un relato al
            nivel elegido, preguntas para localizar información, inferir y
            encontrar la idea principal y dos pistas por pregunta. La página
            añade paisajes ilustrados de nuestra colección para acompañar la
            lectura. Si una respuesta no coincide, la página muestra la pista
            siguiente y el párrafo de apoyo; no envía la respuesta del niño a
            otra llamada. En las historias de biblioteca, formula pistas a
            partir del relato y la pregunta. No es un chat abierto ni hace
            diagnósticos. Si la IA no está disponible, aparece una pista
            preparada y se indica su procedencia.
          </p>
          <p>Comprueba las pistas contra el texto: la IA puede equivocarse.</p>
        </section>
        <section className="guide-card">
          <ShieldCheck size={26} />
          <h2>Privacidad desde el comienzo.</h2>
          <p>
            El recorrido no pide nombres, correos, colegio ni grabaciones. Las
            respuestas se mantienen en memoria durante la sesión y no se guardan
            en una base de datos.
          </p>
          <Link className="inline-link" href="/privacidad">
            Leer el aviso de privacidad <ArrowRight size={15} />
          </Link>
        </section>
        <section className="guide-card">
          <Leaf size={26} />
          <h2>Un prototipo que puede crecer.</h2>
          <p>
            Los textos son originales de demostración y aún necesitan validación
            docente. Antes de un piloto con menores, hacen falta revisión
            pedagógica y las autorizaciones correspondientes.
          </p>
          <p>
            El modelo de sostenibilidad propuesto es una licencia institucional
            o un acceso patrocinado, sin publicidad para niños.
          </p>
        </section>
      </div>
      <section className="evidence-note">
        <span className="small-label">POR QUÉ PRACTICAR LA COMPRENSIÓN</span>
        <h2>Leer también es conectar ideas.</h2>
        <p>
          La ENLA 2024 reportó que el 32,8 % de estudiantes de cuarto de
          primaria alcanzó el nivel satisfactorio en Lectura. En 2025, los
          resultados nacionales fueron similares a los de 2023 y 2024. Es una
          razón para seguir explorando apoyos educativos, no una prueba de que
          este prototipo mejora el aprendizaje.
        </p>
        <div className="evidence-links">
          <a
            href="https://umc.minedu.gob.pe/resultadosenla2024/"
            className="inline-link"
            target="_blank"
            rel="noreferrer"
          >
            Consultar resultados de ENLA 2024 <ArrowRight size={15} />
          </a>
          <a
            href="https://umc.minedu.gob.pe/enla-2025-se-mantienen-avances-en-lectura-y-matematica-con-mejoras-en-las-zonas-rurales/"
            className="inline-link"
            target="_blank"
            rel="noreferrer"
          >
            Consultar nota de ENLA 2025 <ArrowRight size={15} />
          </a>
        </div>
      </section>
      <div className="guide-cta">
        <Check size={20} />
        <p>Sin cuentas, sin anuncios y con espacio para volver a intentarlo.</p>
        <Link href="/" className="button">
          Explorar las historias <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
