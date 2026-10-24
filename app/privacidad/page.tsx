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
        modelos gratuitos. Si ambos servicios fallan y hay cuota disponible, el
        servidor puede usar Llama 3.3 70B mediante Cloudflare Workers AI con las
        mismas validaciones de formato y contenido. En OpenRouter se solicita
        excluir proveedores que declaran usar el contenido para entrenamiento;
        esto no garantiza que no exista retención técnica. Consulta su{" "}
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
        Antes de crear el cuento, OpenRouter también revisa la idea para
        detectar contenido infantil inadecuado expresado de forma directa o
        indirecta; después revisa el cuento completo. Estas revisiones usan
        modelos configurados con precio máximo cero y recopilación de datos
        denegada. Si no están disponibles, no generamos el cuento. OpenRouter
        procesa esos textos según sus propias condiciones. Cloudflare Workers AI
        puede actuar como último respaldo para escribir el cuento, preparar sus
        escenas o explicar un pasaje. En ese caso recibe la idea ficticia o el
        texto necesario para esa función, el nivel y las instrucciones
        pedagógicas. No se envían respuestas elegidas ni un perfil del
        estudiante. Consulta la{" "}
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
        según sus propias condiciones. Las ilustraciones se preparan
        automáticamente mediante el recorrido descrito más abajo.
      </p>
      <h2>Mis libros: guardado temporal en este dispositivo</h2>
      <p>
        Los libros que creas se guardan automáticamente en una base local del
        navegador (IndexedDB), junto con su nivel e ilustraciones. Están
        disponibles durante siete días desde su creación. Al volver a abrir este
        espacio se eliminan los registros vencidos. Si no abres la web, el
        navegador puede conservar físicamente esos registros hasta la siguiente
        visita o hasta que borres sus datos.
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
        La creación combina avisos locales mientras escribes, validación del
        servidor, revisión semántica de la idea y revisión del cuento generado.
        Intenta bloquear datos personales, malas palabras, contenido adulto,
        violencia y solicitudes que intenten disfrazarlos. Puede equivocarse o
        no reconocer todos los nombres, datos ni formas de expresión. No
        escribas información real: inventa personajes y lugares. Una persona
        adulta debe revisar la idea y leer el resultado junto contigo. Si el
        cuento incluye algo extraño, cierra la página y crea otro.
      </p>
      <h2>Ayuda para una palabra, frase o párrafo</h2>
      <p>
        Seleccionar texto no hace una llamada a la IA. Al pulsar «Ayúdame con
        esta parte» o «Ayuda con este párrafo», el servidor reconstruye el
        pasaje del catálogo o verifica la autorización de un párrafo de un libro
        creado. Puede enviar a AI Gateway u OpenRouter el párrafo, la parte
        seleccionada, el nivel y la etapa de ayuda. No enviamos una respuesta
        libre ni grabamos voz. La explicación, el ejemplo y la pregunta guiada
        pueden contener errores y deben contrastarse con el relato. Si el
        servicio falla, mostramos una ayuda preparada identificada como tal. Los
        fragmentos de cuentos creados no se guardan en la caché de ayuda del
        servidor; los resultados de catálogo se reutilizan por un periodo corto.
        No guardamos un historial personal de las consultas.
      </p>
      <h2>Ilustraciones con personajes</h2>
      <p>
        Los libros nuevos muestran de inmediato composiciones vectoriales de
        personajes, objetos y lugares. El servidor puede pedir un plan de seis
        escenas a la IA y, cuando Cloudflare Workers AI está configurado, enviar
        los párrafos autorizados y la descripción ficticia de los personajes a
        FLUX.1 schnell para generar seis imágenes. No enviamos la idea original,
        las respuestas ni identificadores del estudiante a Cloudflare. Las
        imágenes generadas pueden no representar exactamente el relato y no
        sustituyen su texto. Si el proveedor falla o se agota su cuota,
        conservamos las composiciones vectoriales. Las imágenes y el plan se
        guardan con el libro en este navegador durante el periodo indicado. Los
        libros anteriores conservan sus ilustraciones. Consulta las{" "}
        <a
          href="https://developers.cloudflare.com/workers-ai/platform/data-usage/"
          target="_blank"
          rel="noreferrer"
        >
          condiciones de datos de Workers AI
        </a>
        ; no prometemos retención cero de todos los proveedores implicados.
      </p>
      <h2>Escuchar una página o una ayuda</h2>
      <p>
        Al pulsar «Escuchar», el texto de esa página puede enviarse a ElevenLabs
        para generar una narración en español. Puedes elegir entre George, Sarah
        y Daniel; la preferencia de voz se recuerda localmente hasta que borres
        los datos del sitio. No enviamos la voz del niño, sus respuestas ni
        identificadores de estudiante. Los párrafos de libros nuevos llevan una
        autorización del servidor; los libros antiguos pueden usar directamente
        la voz del dispositivo. Las grabaciones de los niños no se solicitan ni
        se capturan.
      </p>
      <p>
        En «No entendí», «Escuchar ayuda» puede enviar a ElevenLabs la
        explicación, el ejemplo y la pregunta guiada que acabas de recibir.
        Utiliza la misma voz elegida para el libro. El servidor autoriza ese
        texto exacto durante diez minutos; no admite texto libre para narrar. Si
        no hay autorización o el servicio falla, se intenta la voz del
        dispositivo. No se añade un perfil ni se guardan las dudas del niño.
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
      <h2>Preferencias de lectura y guía</h2>
      <p>
        Este navegador recuerda el tamaño de letra, la voz elegida, si activaste
        los sonidos o la música y si ya viste la guía de la luciérnaga. Los
        sonidos y la música empiezan apagados; puedes cambiarlos en Ajustes.
        Estas preferencias no contienen nombres ni respuestas y no se envían a
        los modelos de IA. La música se genera en el dispositivo y baja de
        volumen durante la narración. Puedes borrar las preferencias desde los
        datos del sitio en tu navegador y volver a abrir la guía con «?» o desde
        Ajustes.
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
      <Link className="button button-outline" href="/">
        Volver a las historias
      </Link>
    </article>
  );
}
