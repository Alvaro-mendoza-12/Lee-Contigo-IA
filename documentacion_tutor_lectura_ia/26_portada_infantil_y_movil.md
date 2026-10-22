# Portada infantil y simplificación móvil

Fecha: 22 de octubre de 2026. Continúa el corte 25, sin reconstruir el lector ni el creador.

## Dirección visual aplicada

- **Color:** verde de tela `#30735A`, verde de texto `#244E3E`, papel soleado `#FFFBED`, amarillo `#FFDB76`, celeste `#D9EFF7` y un pequeño marcador coral `#E79577`.
- **Tipografía:** se conserva Nunito Sans y la identidad LeeContigo. Título redondeado grande, alineado a la izquierda en escritorio y centrado en móvil. Párrafos periféricos cortos; el texto de los cuentos mantiene todos sus controles.
- **Estructura:** una portada grande con lomo verde y hojas apiladas. Una acción principal abre un cuento; debajo hay dos destinos, biblioteca y creador. Cada destino es un enlace completo con icono y etiqueta.
- **Movimiento:** apertura breve de portada mediante transformación, sin desvanecer el texto. Se conserva el carrusel de tres segundos con pausa, navegación manual y desactivación del movimiento automático ante la preferencia de movimiento reducido. No se añaden parpadeos, sonidos automáticos ni animaciones alrededor del texto de lectura.

La propuesta inicial se revisó para evitar una portada saturada de estrellas y mensajes flotantes: se conserva una estrella, una nota breve en escritorio y las propias portadas como ilustración principal. En móvil se eliminan las notas y las tres etiquetas secundarias del inicio.

## Cambios por pantalla

| Pantalla | Cambio |
|---|---|
| Inicio | «Abre un cuento. Empieza la aventura.», una frase de apoyo, botón Leer un cuento, libro protagonista, dos caminos con iconos y colores diferenciados. |
| Creador | Título y ejemplo más cortos, campo de tres líneas, descripciones de nivel de dos palabras, aviso de privacidad conciso y revisión adulta conservada. |
| Creador móvil | Dos niveles en una fila, sin adornos que repitan la selección; menos márgenes, menos altura y menos texto antes de escribir. |
| Biblioteca móvil | La portada y el título guían la elección. Se omite una instrucción redundante; los dos niveles y su explicación breve siguen disponibles. |
| Lector | Se conservan las voces, las páginas, los tamaños de letra, el cambio de nivel y la ayuda contextual del corte 25. No se recorta el cuento. |

## Diez heurísticas de Nielsen

1. **Estado visible:** nivel, página, voz, preparación del cuento y fuente de ayuda mantienen sus avisos.
2. **Lenguaje familiar:** biblioteca, cuento, leer e inventar; los iconos llevan texto para no depender de interpretaciones.
3. **Control:** navegación manual, pausa, detener voz, volver al libro y borrar libros.
4. **Consistencia:** se conserva el verde de marca, el botón de lectura y los componentes existentes.
5. **Prevención:** destinos distintos y sin botones superpuestos; revisión adulta y validaciones del servidor conservadas.
6. **Reconocimiento:** portadas y títulos juntos; una acción principal y dos destinos con nombre e icono.
7. **Flexibilidad:** ratón, teclado, controles táctiles, ayuda por selección o párrafo, varios tamaños y voces.
8. **Minimalismo:** se recortan frases periféricas, notas móviles y explicaciones repetidas; el cuento permanece completo.
9. **Recuperación:** los errores conservan la idea; las ayudas y los dibujos de respaldo permiten seguir leyendo.
10. **Ayuda:** acceso al párrafo desde el lector, ejemplos y pistas; información para familias y privacidad accesibles.

## Comprobaciones

- Capturas revisadas a 1440 y 390 px. Inicio, creador y lector sin desbordamiento horizontal en esa revisión; se añade un recorrido específico de portada y creador a 320 px.
- Se detectó contraste insuficiente durante el desvanecimiento de entrada y se eliminó ese desvanecimiento; se conserva la apertura mediante transformación.
- La prueba de navegación se actualiza para la nueva tarjeta «Explora la biblioteca»; la ruta y el catálogo de diez cuentos se mantienen.
- Se incluyen pruebas con axe, pausa del carrusel y movimiento reducido, además de los recorridos anteriores del lector.
- Resultado final de este corte: **29/29 pruebas unitarias, 44/44 recorridos de Playwright**, compilación y TypeScript aprobados. La comprobación automática de accesibilidad se integra en los recorridos; no sustituye una revisión con personas usuarias y dispositivos reales.

## Disponibilidad de IA e imágenes

La ruta de ilustraciones publicada generó **6/6 imágenes distintas** mediante Cloudflare, HTTP 200, en **17.023 ms**. Se comprimieron y se devolvieron como WebP, con el plan de escenas y sin claves en el navegador. Los libros conservan las ilustraciones de respaldo si el proveedor falla.

Cloudflare Workers AI se añade como último respaldo de texto con `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. Conserva las validaciones y el esquema de cada función; no añade chat ni captura de voz. AI Gateway y OpenRouter siguen disponibles. El presupuesto reserva al menos 8,5 segundos del total para este respaldo en las funciones breves; no suma un nuevo plazo fuera del límite del servidor. Ante un 429 de OpenRouter no se prueban otras claves para eludir la cuota.

Prueba real local de ayuda contextual: HTTP 200, `source: ai`, explicación de «diminuta», ejemplo y pregunta guiada, en **9.988 ms**. La calidad semántica sigue pendiente de revisión docente; se reforzó la instrucción para pedir evidencia concreta del pasaje y ejemplos realistas.

Se mantiene la asignación y las condiciones de la cuenta gratuita de Workers AI. No se compraron créditos ni se cambió la facturación. El uso de imágenes y texto comparte la cuota de esa cuenta; las solicitudes pueden fallar al agotarse.

## Archivos principales

`app/page.tsx`, `app/home-cover.css`, `components/story-showcase.tsx`, `components/story-creator.tsx`, `app/layout.tsx`, `lib/cloudflare-text.ts`, `lib/structured-ai.ts`, `app/privacidad/page.tsx` y pruebas en `tests/e2e/child-ux.spec.ts` y `tests/cloudflare-text.test.ts`.

Se aplicaron Frontend Design, Web Design Guidelines y React Best Practices. La página principal sigue siendo un componente de servidor; la interacción reutiliza el carrusel existente y CSS, sin una nueva biblioteca de animación.
