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
export const metadata = { title: "Guía para acompañar" };
export default function Guide() {
  return (
    <div className="container guide-page">
      <header className="page-heading">
        <span className="small-label">PARA FAMILIAS Y DOCENTES</span>
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
            Formula pistas según el relato, la pregunta y el nivel elegidos. Si
            se pide ayuda tras un error, propone otra forma de buscar la
            evidencia, sin recibir la respuesta seleccionada. No es un chat
            abierto ni hace diagnósticos. Si la IA no está disponible, aparece
            una pista preparada y se indica su procedencia.
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
          primaria alcanzó el nivel satisfactorio en Lectura. Es una razón para
          seguir explorando apoyos educativos, no una prueba de que este
          prototipo mejora el aprendizaje.
        </p>
        <a
          href="https://umc.minedu.gob.pe/resultadosenla2024/"
          className="inline-link"
          target="_blank"
          rel="noreferrer"
        >
          Consultar la fuente oficial de ENLA 2024 <ArrowRight size={15} />
        </a>
      </section>
      <div className="guide-cta">
        <Check size={20} />
        <p>Sin cuentas, sin anuncios y con espacio para volver a intentarlo.</p>
        <Link href="/biblioteca" className="button">
          Explorar las historias <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
