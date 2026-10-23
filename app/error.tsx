"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container empty-page">
      <h1>Hagamos una pequeña pausa.</h1>
      <p>
        No pudimos abrir esta página. Puedes volver a intentarlo o elegir otra
        historia.
      </p>
      <button className="button" onClick={reset}>
        Intentar de nuevo
      </button>
      <Link className="text-button" href="/">
        Volver a las historias
      </Link>
    </div>
  );
}
