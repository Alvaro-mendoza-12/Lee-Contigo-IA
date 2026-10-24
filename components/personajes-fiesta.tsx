// Personajes originales de LeeContigo IA para celebrar un cuento terminado.
// Dibujados como SVG simples en este proyecto (ver licencias/PERSONAJES-CELEBRACION.md).

/** Búho lector que levanta un libro abierto. */
export function BuhoLector() {
  return (
    <svg viewBox="0 0 100 110" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="104" rx="26" ry="4" fill="#23204a" opacity=".12" />
      <path d="M30 22 L36 8 L44 20 Z M70 22 L64 8 L56 20 Z" fill="#8a5a2b" />
      <ellipse cx="50" cy="62" rx="30" ry="38" fill="#a8703a" />
      <ellipse cx="50" cy="72" rx="19" ry="24" fill="#f1d3a2" />
      <circle cx="39" cy="40" r="11" fill="#fff" />
      <circle cx="61" cy="40" r="11" fill="#fff" />
      <circle cx="40" cy="41" r="5" fill="#23204a" />
      <circle cx="60" cy="41" r="5" fill="#23204a" />
      <circle cx="41.5" cy="39.5" r="1.6" fill="#fff" />
      <circle cx="61.5" cy="39.5" r="1.6" fill="#fff" />
      <path d="M46 49 L54 49 L50 56 Z" fill="#f2a13a" />
      <g className="fiesta-brazo-izq">
        <path
          d="M22 58 C10 46 12 30 20 24"
          stroke="#8a5a2b"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g className="fiesta-brazo-der">
        <path
          d="M78 58 C90 46 88 30 80 24"
          stroke="#8a5a2b"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <path d="M36 84 L50 80 L64 84 L64 96 L50 92 L36 96 Z" fill="#6a3fd6" />
      <path d="M50 80 L50 92" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

/** Gota de lluvia sonriente que salta. */
export function GotaAlegre() {
  return (
    <svg viewBox="0 0 100 110" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="104" rx="22" ry="4" fill="#23204a" opacity=".12" />
      <path
        d="M50 8 C62 30 80 48 80 70 C80 88 66 100 50 100 C34 100 20 88 20 70 C20 48 38 30 50 8 Z"
        fill="#6cc4f0"
        stroke="#2f86b8"
        strokeWidth="3"
      />
      <ellipse cx="38" cy="54" rx="5" ry="9" fill="#fff" opacity=".6" />
      <circle cx="41" cy="70" r="4" fill="#23204a" />
      <circle cx="59" cy="70" r="4" fill="#23204a" />
      <circle cx="34" cy="80" r="4" fill="#ff9fc4" opacity=".7" />
      <circle cx="66" cy="80" r="4" fill="#ff9fc4" opacity=".7" />
      <path
        d="M42 82 Q50 90 58 82"
        stroke="#23204a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <g className="fiesta-brazo-izq">
        <path
          d="M21 72 L8 56"
          stroke="#2f86b8"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="fiesta-brazo-der">
        <path
          d="M79 72 L92 56"
          stroke="#2f86b8"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Semilla con dos hojitas que baila. */
export function SemillaBailarina() {
  return (
    <svg viewBox="0 0 100 110" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="104" rx="24" ry="4" fill="#23204a" opacity=".12" />
      <path
        d="M50 30 C50 20 50 14 50 10"
        stroke="#3f9a54"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M50 16 C38 4 24 8 22 16 C32 22 44 22 50 16 Z" fill="#7ccf6f" />
      <path d="M50 16 C62 4 76 8 78 16 C68 22 56 22 50 16 Z" fill="#5bb85a" />
      <ellipse
        cx="50"
        cy="64"
        rx="26"
        ry="34"
        fill="#c88a4a"
        stroke="#8a5a2b"
        strokeWidth="3"
      />
      <circle cx="41" cy="58" r="4" fill="#23204a" />
      <circle cx="59" cy="58" r="4" fill="#23204a" />
      <path
        d="M42 72 Q50 80 58 72"
        stroke="#23204a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <g className="fiesta-brazo-izq">
        <path
          d="M25 66 L10 52"
          stroke="#8a5a2b"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g className="fiesta-brazo-der">
        <path
          d="M75 66 L90 52"
          stroke="#8a5a2b"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M40 97 L38 104 M60 97 L62 104"
        stroke="#8a5a2b"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
