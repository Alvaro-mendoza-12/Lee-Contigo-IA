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
        Solo identificadores de relato, pregunta, nivel, número de pista y un
        modo de apoyo: explorar o volver a intentarlo. Este modo indica qué
        ayuda se solicita; no incluye la respuesta seleccionada. El servidor
        puede enviar el relato original y la pregunta a un modelo mediante
        Vercel AI Gateway. En este recorrido no enviamos el nombre, la voz, una
        respuesta libre ni un identificador de estudiante.
      </p>
      <h2>Crear un cuento y su portada con IA</h2>
      <p>
        Si usas «Crea tu cuento», la idea breve y el nivel elegido se envían a un
        modelo de IA para escribir la historia y sus preguntas. Vercel AI
        Gateway enruta esa solicitud a los proveedores disponibles para Gemini;
        consulta la{" "}
        <a href="https://cloud.google.com/privacy" target="_blank" rel="noreferrer">
          política de privacidad de Google Cloud
        </a>
        . Después, otra solicitud usa únicamente la descripción visual generada para pedir una
        portada; no necesita volver a enviar la idea original. La aplicación no
        guarda la idea, el cuento ni la imagen en una cuenta, base de datos o
        almacenamiento del navegador: permanecen en memoria mientras la página
        está abierta. El proveedor de IA y el alojamiento pueden procesar las
        solicitudes y datos técnicos según sus propias condiciones. Esta versión no fuerza el
        filtro de «no entrenamiento» porque los proveedores elegidos no ofrecen
        una ruta compatible con ese control. Vercel indica que AI Gateway no usa
        las solicitudes para entrenar, pero las condiciones de los proveedores
        que las reciben pueden variar.
      </p>
      <p>
        Esta función intenta bloquear correos, teléfonos, enlaces y algunas
        frases que parecen datos personales, pero no puede reconocer todos los
        nombres ni todos los datos sensibles. No escribas información real:
        inventa personajes y lugares. Una persona adulta debe revisar la idea y
        leer el resultado junto contigo. La portada es opcional y solo se envía
        después de una segunda confirmación adulta. Se genera con FLUX 3 Image,
        de Black Forest Labs. Su política indica que puede usar prompts e
        imágenes para mejorar sus modelos. El precio publicado actualmente por
        Vercel es USD 0.05 por imagen y puede cambiar; se descuenta de los
        créditos disponibles. Lee la{" "}
        <a
          href="https://bfl.ai/legal/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          política de privacidad de Black Forest Labs
        </a>
        . Si el cuento incluye algo extraño, cierra la página y crea otro.
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
        Los límites de creación se aplican por instancia y durante un periodo
        corto; no equivalen a una cuota global ni a un control parental.
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
        Recarga la página o cierra la web para borrar el estado local de la
        historia. No hay una cuenta que debas eliminar.
      </p>
      <Link className="button button-outline" href="/biblioteca">
        Volver a las historias
      </Link>
    </article>
  );
}
