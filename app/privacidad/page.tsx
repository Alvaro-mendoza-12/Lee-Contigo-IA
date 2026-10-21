import Link from "next/link";
export const metadata = { title: "Privacidad y uso de IA" };
export default function Privacy() {
  return (
    <article className="container legal-page">
      <span className="small-label">UN ESPACIO PARA LEER CON TRANQUILIDAD</span>
      <h1>Privacidad y uso de IA</h1>
      <p className="legal-lead">
        Este prototipo permite practicar lectura sin crear una cuenta. No
        introduzcas datos personales.
      </p>
      <h2>Qué ocurre durante una lectura</h2>
      <p>
        El nivel y las respuestas seleccionadas se usan en memoria para mostrar
        el recorrido. No guardamos perfiles ni respuestas en una base de datos o
        en el almacenamiento del navegador. Al recargar o salir de la sesión se
        reinicia el progreso.
      </p>
      <h2>Qué se envía al solicitar una pista</h2>
      <p>
        Solo identificadores de relato, pregunta, nivel y número de pista. El
        servidor puede enviar el relato original y la pregunta a un modelo
        mediante Vercel AI Gateway. No enviamos el nombre, la voz, una respuesta
        libre ni un identificador de estudiante. El proveedor y el hosting
        pueden procesar información técnica de conexión según sus condiciones.
      </p>
      <h2>Pistas con IA y pistas preparadas</h2>
      <p>
        Cada pista indica su origen. Las pistas con IA pueden contener errores:
        compruébalas con el relato. Ante un fallo se muestra una pista
        preparada. No es una herramienta de diagnóstico ni una evaluación
        escolar.
      </p>
      <h2>Seguridad y datos técnicos</h2>
      <p>
        El alojamiento procesa las solicitudes necesarias para servir la web. El
        servidor limita solicitudes con una huella temporal de la dirección de
        conexión; no guarda la dirección original ni la vincula a respuestas. No
        usamos publicidad, rastreadores de marketing ni cookies de perfilado.
      </p>
      <h2>Acompañamiento y pruebas</h2>
      <p>
        El contenido es de demostración y está pendiente de revisión pedagógica.
        Un piloto que recoja información personal de menores requerirá un
        protocolo, revisión de privacidad y consentimiento aplicable. El botón
        para descartar una pista solo actúa en esta sesión y no envía un
        reporte.
      </p>
      <h2>Volver a empezar</h2>
      <p>
        Recarga la página para borrar el estado de la sesión. Puedes cerrar la
        web en cualquier momento. No hay una cuenta que debas eliminar.
      </p>
      <Link className="button button-outline" href="/biblioteca">
        Volver a las historias
      </Link>
    </article>
  );
}
