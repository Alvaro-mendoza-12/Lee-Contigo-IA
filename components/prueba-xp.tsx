"use client";
// TEMPORAL: página para probar el sistema de experiencia. Se borra en la Fase 4.
import { useEffect, useRef, useState } from "react";
import { BarraXP } from "@/components/barra-xp";
import { AvisoNivel } from "@/components/aviso-nivel";
import {
  DESBLOQUEOS,
  EVENTO_XP,
  RECOMPENSAS,
  cuentoDesbloqueado,
  modoDemo,
  nivelParaCuento,
  obtenerProgreso,
  reiniciarProgreso,
  retoDesbloqueado,
  sumarXP,
  type MotivoXP,
} from "@/lib/progreso";

const botones: { motivo: MotivoXP; texto: string }[] = [
  { motivo: "pregunta-primer-intento", texto: "Pregunta al primer intento" },
  { motivo: "pregunta-con-pista", texto: "Pregunta con pista" },
  { motivo: "cuento-terminado", texto: "Terminar un cuento" },
  { motivo: "preguntas-completas", texto: "Terminar las 3 preguntas" },
  { motivo: "cuento-creado", texto: "Crear un cuento" },
];
const cuentos = Object.values(DESBLOQUEOS).flat();

export default function PruebaXP() {
  const contador = useRef(0);
  const [estado, setEstado] = useState<{
    demo: boolean;
    reto: boolean;
    abiertos: string[];
  } | null>(null);

  useEffect(() => {
    const leer = () =>
      setEstado({
        demo: modoDemo(),
        reto: retoDesbloqueado(),
        abiertos: cuentos.filter(cuentoDesbloqueado),
      });
    leer();
    window.addEventListener(EVENTO_XP, leer);
    return () => window.removeEventListener(EVENTO_XP, leer);
  }, []);

  function simular(motivo: MotivoXP) {
    // Un identificador nuevo por clic para que la recompensa no se repita.
    const id = `prueba-${Date.now()}-${contador.current++}`;
    return sumarXP(
      motivo,
      id,
      "paso",
      motivo.startsWith("pregunta-") ? "q1" : undefined,
    );
  }

  function subirDeNivel() {
    let resultado;
    do resultado = simular("cuento-terminado");
    while (!resultado.subioDeNivel && obtenerProgreso().siguiente);
  }

  return (
    <div className="container xp-prueba">
      <h1>Prueba del sistema de experiencia</h1>
      <p>
        Página temporal para el equipo. Modo demo aislado: el progreso real no
        cambia. <a href="/?demo=0">Salir del demo</a>
      </p>

      <h2>Barra grande (inicio)</h2>
      <BarraXP variante="grande" />
      <h2>Barra compacta (lector simulado)</h2>
      <div className="xp-prueba-lector">
        <div className="xp-prueba-herramientas">
          <span>Página 2 de 6</span>
          <BarraXP variante="compacta" />
        </div>
        <p>
          Lina caminó despacio entre los árboles. La noche era tranquila y las
          hojas brillaban con la luz de la luna. A lo lejos, una luciérnaga
          pequeña encendía y apagaba su luz, como si quisiera decir algo. Lina
          se acercó con cuidado para no asustarla y descubrió que la luciérnaga
          estaba buscando a sus amigas.
        </p>
      </div>

      <h2>Simular recompensas</h2>
      <div className="xp-prueba-botones">
        {botones.map(({ motivo, texto }) => (
          <button
            key={motivo}
            type="button"
            className="button"
            onClick={() => simular(motivo)}
          >
            {texto} (+{RECOMPENSAS[motivo]})
          </button>
        ))}
        <button type="button" className="button" onClick={subirDeNivel}>
          Subir de nivel ahora
        </button>
        <button
          type="button"
          className="button button-outline"
          onClick={reiniciarProgreso}
        >
          Reiniciar progreso
        </button>
      </div>

      <h2>Desbloqueos</h2>
      <p>«Un nuevo reto»: {estado?.reto ? "desbloqueado" : "bloqueado"}</p>
      <ul className="xp-prueba-lista">
        {cuentos.map((id) => (
          <li key={id}>
            {estado?.abiertos.includes(id) ? "✅" : "🔒"} {id}
            <small> · nivel {nivelParaCuento(id)?.numero}</small>
          </li>
        ))}
      </ul>
      <AvisoNivel />
      <style>{`
        .xp-prueba { padding-block: 24px 48px; display: grid; gap: 12px; }
        .xp-prueba h2 { margin: 16px 0 0; font-size: 1.2rem; }
        .xp-prueba-botones { display: flex; flex-wrap: wrap; gap: 10px; }
        .xp-prueba-lista { columns: 2 200px; padding-left: 18px; }
        .xp-prueba-lector { padding: 16px; background: #fff; border-radius: 18px; }
        .xp-prueba-lector > p { margin: 12px 0 0; font-size: 1.15rem; line-height: 1.6; }
        .xp-prueba-herramientas { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
      `}</style>
    </div>
  );
}
