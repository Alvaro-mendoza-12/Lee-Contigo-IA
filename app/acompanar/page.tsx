import Link from "next/link";
import { CompanionPlanner } from "@/components/companion-planner";
import { stories } from "@/lib/stories";
import styles from "./guide.module.css";
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
            En la biblioteca, propone pistas sobre el texto. Al crear un cuento,
            prepara la historia, sus preguntas y un plan de escenas. La página
            muestra dibujos de respaldo y puede solicitar ilustraciones con IA.
            Una persona adulta debe revisar la idea y acompañar la lectura del
            resultado. Las respuestas del niño se comparan en el navegador; no
            se envían a otra llamada de IA.
          </p>
          <p>
            No es un chat ni hace diagnósticos. Cada ayuda indica su origen.
            Comprueben las pistas contra el texto: la IA puede equivocarse.
          </p>
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
        <span className="small-label">LEER Y CONVERSAR</span>
        <h2>Una historia que puedan contar.</h2>
        <p>
          Dejen que el niño elija un cuento. Al terminar, invítenlo a contar qué
          ocurrió o a dibujarlo. Pregunten qué parte del texto le ayudó a pensar
          eso. Pueden hacer una pausa y seguir otro día: los puntos no son una
          nota ni una medida de comprensión.
        </p>
        <details className={styles.sources}>
          <summary>Fuentes y contexto para acompañar</summary>
          <ul>
            <li>
              <a
                href="https://ies.ed.gov/ncee/wwc/PracticeGuide/14"
                target="_blank"
                rel="noreferrer"
              >
                IES: estrategias de comprensión y conversación sobre el texto
              </a>
            </li>
            <li>
              <a
                href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/literacy-ks2"
                target="_blank"
                rel="noreferrer"
              >
                EEF: lectura y lenguaje entre los 7 y 11 años
              </a>
            </li>
            <li>
              <a
                href="https://www.pnl2027.gov.pt/np4/leituraemfamilia.html"
                target="_blank"
                rel="noreferrer"
              >
                Portugal: lectura en familia y elección de historias
              </a>
            </li>
            <li>
              <a
                href="https://www.unicef.org/innocenti/reports/policy-guidance-ai-children"
                target="_blank"
                rel="noreferrer"
              >
                UNICEF: privacidad, inclusión y bienestar en la IA para niños
              </a>
            </li>
            <li>
              <a
                href="https://www.apa.org/news/press/releases/2026/09/education-technology-engagement"
                target="_blank"
                rel="noreferrer"
              >
                APA: disfrutar una aplicación no demuestra aprendizaje
              </a>
            </li>
          </ul>
          <h3>El contexto de Perú</h3>
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
        </details>
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
