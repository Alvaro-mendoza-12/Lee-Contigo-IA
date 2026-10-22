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
        reinicia el progreso de las preguntas. Los libros creados tienen un
        guardado temporal independiente, descrito más abajo.
      </p>
      <h2>Qué se envía al solicitar una pista</h2>
      <p>
        El navegador envía solo identificadores de relato y pregunta, nivel,
        número de pista y modo de apoyo: explorar o volver a intentarlo. El
        servidor recupera el título, relato, pregunta, habilidad y fragmento de
        evidencia del catálogo y puede enviarlos a un modelo mediante Vercel AI
        Gateway. No envía las opciones ni la respuesta seleccionada. La
        solicitud permite usar Gemini y, si no responde, GPT-5.4 Nano. Gemini
        puede servirse mediante Google o Google Vertex AI; GPT-5.4 Nano,
        mediante OpenAI o Azure. La selección depende de las rutas disponibles
        en AI Gateway. Como respaldo, el servidor puede usar OpenRouter con
        modelos gratuitos. En OpenRouter se solicita excluir proveedores que
        declaran usar el contenido para entrenamiento; esto no garantiza que no
        exista retención técnica. Consulta su{" "}
        <a
          href="https://openrouter.ai/docs/guides/privacy/provider-logging"
          target="_blank"
          rel="noreferrer"
        >
          política de proveedores
        </a>
        . El catálogo de AI Gateway consultado no marca estas rutas como
        compatibles con el filtro de no entrenamiento, así que no lo activamos.
        Revisa las políticas de cada proveedor; no prometemos que sus datos se
        excluyan de otros usos ni que no se conserven. En este recorrido no
        enviamos el nombre, la voz, una respuesta libre ni un identificador de
        estudiante.
      </p>
      <h2>Crear un libro ilustrado</h2>
      <p>
        Si usas «Crea tu cuento», la idea breve y el nivel elegido se envían a
        un modelo de IA para escribir la historia y sus preguntas. Vercel AI
        Gateway intenta Gemini 3.8 Flash y, si no está disponible, puede probar
        GPT-5.4 Nano. Google o Google Vertex AI pueden servir el primer modelo;
        OpenAI o Azure pueden servir el respaldo. Las políticas y condiciones de
        cada proveedor pueden variar. Si AI Gateway falla, puede intentarse
        mediante OpenRouter con modelos gratuitos y las mismas validaciones.
        Consulta la{" "}
        <a
          href="https://cloud.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          política de privacidad de Google Cloud
        </a>
        ,{" "}
        <a
          href="https://developers.openai.com/api/docs/guides/your-data"
          target="_blank"
          rel="noreferrer"
        >
          controles de datos de la API de OpenAI
        </a>
        , la{" "}
        <a
          href="https://privacy.microsoft.com/privacystatement"
          target="_blank"
          rel="noreferrer"
        >
          política de privacidad de Microsoft
        </a>{" "}
        y las políticas del proveedor seleccionado. El filtro de no
        entrenamiento no se activa y no se fuerza retención cero. El proveedor
        de IA y el alojamiento pueden procesar las solicitudes y datos técnicos
        según sus propias condiciones. En el modo gratuito activo, el servidor
        elige ilustraciones de la colección incluida; no llama a un proveedor de
        imágenes.
      </p>
      <h2>Mis libros: guardado temporal en este dispositivo</h2>
      <p>
        Los seis libros más recientes se guardan automáticamente en una base
        local del navegador (IndexedDB), junto con su nivel e ilustraciones.
        Están disponibles durante siete días desde su creación. Al volver a
        abrir este espacio se eliminan los registros vencidos y los que superan
        el límite de seis. Si no abres la web, el navegador puede conservar
        físicamente esos registros hasta la siguiente visita o hasta que borres
        sus datos.
      </p>
      <p>
        El guardado no incluye la idea original, respuestas, intentos ni un
        perfil del niño. No sincroniza libros entre dispositivos ni los sube a
        una cuenta. Otras personas que usen el mismo navegador pueden abrirlos.
        Puedes borrar un libro o todos desde «Mis libros», o borrar los datos
        del sitio en tu navegador. La navegación privada, la falta de espacio o
        la limpieza del navegador pueden impedir el guardado o eliminar los
        libros antes. Si falla, podrás seguir leyendo mientras la página esté
        abierta.
      </p>
      <p>
        El cuento incluye tres tipos de preguntas —buscar información, inferir y
        encontrar la idea principal— y dos pistas graduadas por pregunta. Estas
        se generan junto con el cuento. Al elegir una respuesta, la página la
        compara en memoria; no la envía a la IA ni hace otra llamada al modelo.
        Si la respuesta no coincide, el tutor muestra una pista y el párrafo que
        puede ayudar. Las respuestas y los intentos no se guardan.
      </p>
      <p>
        Esta función intenta bloquear correos, teléfonos, enlaces y algunas
        frases que parecen datos personales, pero no puede reconocer todos los
        nombres ni todos los datos sensibles. No escribas información real:
        inventa personajes y lugares. Una persona adulta debe revisar la idea y
        leer el resultado junto contigo. Al pulsar «Crear mi cuento» se añaden
        ilustraciones originales de la colección: son paisajes decorativos, no
        imágenes generadas a partir de esa idea ni evidencia para responder las
        preguntas. En este modo gratuito no se envía la historia a un proveedor
        de imágenes. Si el cuento incluye algo extraño, cierra la página y crea
        otro.
      </p>
      <h2>Escuchar una página</h2>
      <p>
        Al pulsar «Escuchar», el texto de esa página puede enviarse a ElevenLabs
        para generar una narración en español. No enviamos la voz del niño, sus
        respuestas ni identificadores de estudiante. Los párrafos de libros
        nuevos llevan una autorización del servidor; los libros antiguos pueden
        usar directamente la voz del dispositivo. Las grabaciones de los niños
        no se solicitan ni se capturan.
      </p>
      <p>
        ElevenLabs puede procesar y conservar el texto y el audio según sus
        condiciones; el plan de demostración no ofrece una garantía de retención
        cero. El servidor reutiliza temporalmente audio de cuentos del catálogo,
        y el navegador reutiliza hasta seis páginas durante la sesión. Si el
        servicio falla o llega a su límite, se intenta la síntesis de voz del
        dispositivo. El estado del lector indica cuándo usa esa alternativa.
        Narración con ElevenLabs: elevenlabs.io. Consulta su{" "}
        <a
          href="https://elevenlabs.io/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          política de privacidad
        </a>
        . El audio de esta demo se utiliza bajo las condiciones del plan
        configurado; el uso comercial necesita la licencia correspondiente.
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
      <p>
        Para resolver fallos de IA, los registros técnicos pueden conservar el
        modelo, el tipo de error, el código de estado, el uso de tokens y un
        identificador de generación del proveedor. En errores de formato también
        se conserva la longitud de la salida, no su texto. No registramos con
        esos eventos la idea del cuento, el relato, las opciones que elegiste ni
        el texto de la pista.
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
        Recargar la página reinicia las respuestas y los intentos. Tus libros
        permanecen en «Mis libros» durante el periodo indicado; usa sus botones
        de borrado para quitarlos antes. No hay una cuenta que debas eliminar.
      </p>
      <Link className="button button-outline" href="/biblioteca">
        Volver a las historias
      </Link>
    </article>
  );
}
