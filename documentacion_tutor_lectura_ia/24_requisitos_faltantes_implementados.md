# Implementación de requisitos faltantes — LeeContigo IA

Fecha: 22 de octubre de 2026. Rama: `codex/requisitos-mvp`.

Se implementa la sección «¿Qué le falta?» del documento de mejoras, junto con la conexión de ElevenLabs solicitada durante el trabajo. Se conserva el creador, el guardado local de libros, el carrusel de portadas, los dos niveles, el libro ilustrado, las preguntas y las pistas. Las auditorías 19, 20 y 23 describen el estado anterior y propuestas adicionales; no todas esas propuestas forman parte de este alcance.

## Trazabilidad

| Requisito | Resultado | Archivos principales |
|---|---|---|
| RF-01 Acceso directo al cuento | «Leer un cuento» abre el lector desde el inicio en un toque. «Ver los 10 cuentos» abre el catálogo. El encabezado ofrece Biblioteca y Crea tu cuento, también en móvil; cada tarjeta es un solo enlace. | `app/page.tsx`, `components/library.tsx`, `components/primary-navigation.tsx`, `components/shell.tsx` |
| RF-02 Biblioteca con diez cuentos | Diez historias originales disponibles con dos versiones cada una, tres preguntas y dos pistas progresivas por pregunta. Se añaden seis cuentos y 24 escenas ilustradas. La biblioteca pasa a una cuadrícula compacta, con selección de nivel y sin vistas previas largas ni botones repetidos por tarjeta. | `lib/stories.ts`, `lib/collection-stories.ts`, `components/art.tsx`, `public/images/*-libro-4.png` |
| RF-03 Error claro con audio y color | Respuesta incorrecta marcada con borde y fondo cálidos, texto «Aún no es la respuesta. Busquemos una pista», pista editorial y botón «Escuchar ayuda». Sonido breve al comprobar, con control de silencio durante la sesión. El color y el sonido no son la única señal. Repetir el mismo clic no cuenta como otro intento y tres errores no revelan automáticamente la solución. | `components/practice.tsx`, `components/story-creator.tsx`, `components/answer-audio.tsx` |
| RF-04 Pruebas del lector de voz | Narración del texto visible, detener al pasar página/cambiar nivel, caché por página y respaldo del dispositivo. Pruebas automatizadas de audio y respaldo, y solicitud real a ElevenLabs con una frase editorial breve: HTTP 200, `audio/mpeg`, 54.377 bytes. | `components/use-narration.ts`, `lib/narration.ts`, `app/api/narrar/route.ts`, `tests/narration.test.ts`, `tests/e2e/child-ux.spec.ts` |
| RNF-01 Minimalismo infantil | Inicio más corto, una acción principal, textos periféricos reducidos, selección de nivel compacta, ideas opcionales dentro de un desplegable. Las instrucciones de privacidad y la revisión adulta siguen presentes. | `app/page.tsx`, `components/library.tsx`, `components/story-creator.tsx`, `app/child-ux.css` |
| RNF-02 Imagen y color atractivos | Ilustraciones originales con personajes expresivos; amarillo y celeste como acentos, verde de marca y papel claro para leer. El color más intenso se concentra en las portadas y las acciones. | `app/child-ux.css`, `components/art.tsx`, `licencias/ILUSTRACIONES-CATALOGO-10.md` |
| RNF-03 Adaptabilidad móvil | Navegación principal visible, tarjetas en dos columnas, controles táctiles y ajustes del libro. Revisión visual a 390 px y verificación de ausencia de desbordamiento a 320 px en inicio, biblioteca, creador, lector y práctica. Se corrigió un solapamiento de navegación con el texto. | `app/child-ux.css`, `tests/e2e/child-ux.spec.ts` |

## Catálogo

1. Una luz en el bosque.
2. La semilla viajera.
3. El camino al faro.
4. La cometa que aprendió a volar.
5. El puente de las ardillas.
6. La nube que se perdió.
7. El tambor de la lluvia.
8. El mapa de los sonidos.
9. El pan de la abuela.
10. La botella del mar.

Los textos nuevos de Paso a paso y Un nuevo reto son distintos. Las preguntas se apoyan en párrafos existentes de ambas versiones; cada respuesta correcta tiene explicación y dos pistas. Esta revisión editorial técnica no equivale a validación de un docente ni a evidencia de eficacia con estudiantes.

## Narración con ElevenLabs

- La clave se configura exclusivamente en `.env.local` y en los secretos de Vercel; no se incorpora a Git ni a variables `NEXT_PUBLIC_`.
- La ruta cerrada `/api/narrar` acepta identificadores y rangos de palabras del catálogo. Para los libros creados, `/api/crear` firma cada párrafo con una autorización de siete días. No acepta texto arbitrario sin una firma válida.
- La firma se conserva con el libro local, sin perfiles ni respuestas. Al cambiar la clave, autorizaciones anteriores dejan de servir y el libro puede usar la voz del dispositivo. Los libros previos sin autorización también conservan ese respaldo.
- Modelo: `eleven_flash_v2_5`, idioma `es`, velocidad 0,85 y voz configurable mediante `ELEVENLABS_VOICE_ID`. No se captura micrófono ni se clonan voces.
- Presupuestos de voz: proveedor 12 s, cliente 14 s, función 20 s. El cliente puede cancelar; cambiar de página detiene la reproducción y descarta respuestas tardías. En el tutor de preguntas el cliente ahora espera 14 s frente al presupuesto de servidor de 12,5 s.
- Se limita la voz por instancia a 24 solicitudes nuevas y 8.000 caracteres por conexión/ventana de diez minutos. Estos límites son de demostración, no una cuota global distribuida. La cuota de la clave en ElevenLabs es el límite adicional que controla la cuenta.
- Audio editorial reutilizado temporalmente en servidor: máximo 24 entradas y 30 minutos. Audio de libros creados no se guarda en la caché del servidor. El navegador reutiliza hasta seis páginas de audio durante la sesión y revoca las URL al salir.
- La interfaz del niño no muestra una etiqueta técnica «Voz: elevenlabs.io» junto a los controles. La atribución del audio y la divulgación del proveedor se conservan en sus metadatos y en Privacidad. El plan gratuito no implica retención cero ni licencia comercial. No se cambiaron planes, facturación ni permisos de administración.
- Las pruebas de interfaz usan una señal WAV sintética o una voz simulada para ser repetibles y evitar consumo de créditos. La prueba real a ElevenLabs se registra separadamente; no se confunden ambas evidencias.

## Heurísticas de Nielsen aplicadas

| Heurística | Aplicación |
|---|---|
| Estado visible | Nivel, página, espera de voz, error, pista y origen de narración tienen un estado visible o anunciado. |
| Lenguaje familiar | Acciones directas: Leer, Biblioteca, Escuchar, Comprobar respuesta y Escuchar ayuda. |
| Control | Detener voz, cambiar nivel, volver al cuento y silenciar sonidos; animación activada por defecto, control manual disponible. |
| Consistencia | Navegación común y mismo patrón de error/ayuda en cuentos del catálogo y creados. |
| Prevención de errores | Una tarjeta por destino, confirmación de respuesta, validación de rangos, autorización del texto generado y límites de uso. |
| Reconocimiento | Portada y título juntos, nivel visible, frase de error y pista junto a la respuesta. |
| Flexibilidad | Teclado, controles táctiles, tamaño de letra y lectura en voz alta. |
| Minimalismo | Se retiran explicaciones repetidas, tarjetas con muchos botones y bloques promocionales largos. |
| Recuperación | La voz del dispositivo sustituye al servicio si falla; el niño puede cambiar respuesta sin perder el cuento. |
| Ayuda | Pistas, evidencia textual, lectura de la ayuda y guía para familias en el pie de página. |

## Verificación y límites

- Compilación Next.js y TypeScript: correctas.
- 21 pruebas unitarias: correctas, incluidas la integridad de diez cuentos y las firmas de narración.
- 32 recorridos de Playwright: correctos en escritorio de 1440 × 1000 y móvil emulado de 390 × 844, con comprobaciones axe de accesibilidad. También se repitió el recorrido de cuento creado en ambos tamaños al añadir la comprobación de autorización de voz.
- Revisión visual y comprobación de desbordamiento a 320 × 740: sin desbordamiento en los cinco recorridos principales.
- La comprobación automática no sustituye pruebas con un teléfono físico, auriculares, un lector de pantalla real o un piloto con niños/docentes. La pronunciación, naturalidad de la voz y comodidad deben revisarse con personas usuarias.
- Las imágenes nuevas se generaron con la herramienta integrada; los prompts y rutas finales están en `licencias/ILUSTRACIONES-CATALOGO-10.md`.
- Los artefactos de captura y los diagnósticos de ejecución están en `output/playwright/`, excluidos de Git. Ningún archivo de diagnóstico debe contener secretos.

## Demostración sugerida de estos requisitos

Inicio → Leer un cuento → ajustar letra → Escuchar → detener/pasar página → terminar la lectura → elegir una respuesta incorrecta → observar aviso, sonido y pista → Escuchar ayuda → responder de nuevo → volver a Biblioteca → elegir uno de los seis cuentos nuevos en Un nuevo reto. Abrir Crea tu cuento para mostrar que el generador y Mis libros siguen disponibles.
