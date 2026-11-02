# Auditoría responsive de LeeContigo

Fecha: 1 de noviembre de 2026, America/Bogota.

## Versión auditada

- Producción: https://lee-contigo-ia.vercel.app.
- Proyecto de Vercel: `lee-contigo-ia`.
- Despliegue Ready: `dpl_7o1Bur2gczLAaCzR1SPzJWRUhF5K`.
- URL inmutable: https://lee-contigo-65bleh0ph-alvaro-s-projects1.vercel.app.
- Rama de origen: `main`.
- Commit: `c0b2a7cf82405095e145fccbc7fed12f4e75b2bd`.
- Rama de las correcciones: `codex/auditoria-responsive-produccion`, creada desde ese commit después de actualizar las referencias de GitHub.

Se verificó la asociación del dominio público con el despliegue mediante `vercel inspect` y la rama y el commit mediante `vercel list --environment production --format=json`. La carpeta estaba inicialmente en `Alvaro/lector`; las comprobaciones de esa versión antigua se descartaron como evidencia de producción. Sus cambios de dependencias se retiraron antes de cambiar de rama. Los dos PDF ajenos a esta tarea permanecen intactos.

## Problemas reproducidos y correcciones

1. **Hueco y texto cortado durante el giro móvil.** Una regla antigua imponía imagen de 135 px y `top: 135px` al texto. La copia animada ya empleaba una cuadrícula con una fila de imagen de 180 px: el desplazamiento se sumaba a esa fila. La prueba midió el inicio del texto en 315 px con imagen de 135 px. Se retiraron los desplazamientos antiguos y se unificaron filas, márgenes e interlineado de la hoja real, la copia animada y los textos invisibles que calculan la altura. El texto comienza ahora inmediatamente después de la imagen, con 24 px hasta la etiqueta del capítulo.
2. **Espacio antes del párrafo en reposo.** El centrado vertical en el alto del párrafo más largo dejaba una zona vacía antes de escenas más cortas. En móvil el contenido se alinea arriba. Se conserva la altura estable del libro para que las flechas no salten al pasar de página.
3. **Ilustraciones que se mueven solas.** La versión publicada todavía heredaba `art-drift`, un zoom infinito. Se desactiva dentro del lector, incluidas las copias de las hojas. El giro de página solicitado por el niño y su interruptor en Ajustes siguen disponibles.
4. **Controles pequeños.** Los botones de letra medían 32 × 40 px en teléfonos; ahora miden al menos 44 × 44 px y sus etiquetas pasan a 14 px. Las flechas de las estanterías pasan de 42 a 44 px; «Necesito una idea» tiene un área de 44 px de alto. El botón de guía conserva 48 px y no se estrecha al compartir fila con el título.
5. **Verificaciones de código ausentes.** Se incorpora `npm run lint`, con reglas de Next.js y TypeScript, y se añaden lint y tipos a GitHub Actions. Se corrige el uso de una referencia durante el renderizado del giro, se conserva el elemento del diálogo durante su limpieza y se ordena el reinicio del creador antes de su registro como manejador.
6. **Retorno del foco en Safari.** La prueba de WebKit confirmó que Ajustes intentaba enfocar el botón exterior mientras el diálogo nativo todavía lo mantenía inactivo. Ahora se cierra primero el diálogo y después se devuelve el foco. Se controla también la cancelación con Escape para evitar un segundo cierre automático del navegador.

No se cambian el catálogo, los niveles, las recompensas, la guía, las preguntas, la ayuda de lectura, las voces ni el guardado local de los cuentos creados.

## Pruebas y cobertura

El proyecto usa `tests/*.test.ts` con Node Test Runner y `tests/e2e/*.spec.ts` con Playwright y axe. No usa Jest ni React Testing Library. Los casos de otro producto solo sirvieron como referencia de comportamientos; no se copiaron sus pruebas ni su cifra de declaraciones.

| Comprobación | Resultado |
| --- | --- |
| Unitarias sobre el código de producción y al finalizar | 107 aprobadas, 0 fallidas |
| Suite existente contra el dominio público de Vercel | 185 aprobadas, 1 omitida, 0 fallidas |
| Nuevas regresiones ejecutadas contra producción antes de corregir | 3 fallidas: separación del texto, geometría del giro e ilustración en movimiento |
| Primera comprobación de las correcciones de diseño en Chrome | 34 aprobadas, 0 fallidas |
| Suite completa de Chrome sobre la compilación corregida | 223 aprobadas, 1 omitida, 0 fallidas |
| Revalidación de los controles y diálogos de Chrome tras el ajuste de Safari | 26 aprobadas, 0 fallidas |
| Primera comprobación de WebKit | 15 aprobadas, 2 fallidas, 1 omitida; ver corrección y revalidación más abajo |
| Comprobación final de WebKit sobre la compilación corregida | 17 aprobadas, 1 omitida, 0 fallidas |
| Lint | Aprobado, 0 errores y 0 advertencias |
| Tipos (`npm run typecheck`) | Aprobado |
| Compilación de producción (`npm run build`) | Aprobada |

La omisión de la suite existente es `G1 · los 19 cuentos abren en ambos niveles con texto y 3 preguntas`: se ejecuta una vez en escritorio y se omite expresamente su repetición en móvil. Los cuentos también cuentan con otros recorridos móviles. La inyección de gestos con CDP se ejecuta en Chrome y se omite en WebKit, que no proporciona CDP; no se considera aprobada allí.

Se añaden 19 escenarios propios: 18 en `responsive-audit.spec.ts` y uno para el libro creado a 320 px en `story-creator.spec.ts`. Los dos proyectos de Chrome los ejecutan en escritorio y móvil: 38 ejecuciones adicionales. WebKit vuelve a ejecutar la matriz responsive con su configuración separada.

En la primera pasada de WebKit fallaron el retorno del foco de Ajustes y el tiempo total del caso de giro. El primero se corrigió en el componente. La traza del segundo mostró que el primer clic de letra consumió 23 segundos y que los giros sí terminaban en aproximadamente 1,2 segundos; al caso se le asignan 60 segundos y se espera la carga de las fuentes antes de interactuar, conservando el límite de 10 segundos de cada aserción. La repetición aislada de ambos casos pasó después de la corrección. La revalidación posterior en Chrome cubre ajuste de nivel, guía, audio, ampliación y cierre de los diálogos, sin repetir innecesariamente todo el catálogo.

La primera validación de publicación en GitHub aprobó instalación, lint, tipos, unitarias y compilación, pero falló una prueba táctil por usar la ilustración renderizada en el servidor antes de finalizar la hidratación (222 recorridos aprobados, 1 fallido y 1 omitido). La prueba ahora comprueba que Ajustes abre y cierra antes del gesto, y espera las fuentes. Esto evita que el cambio inicial a la disposición compacta desmonte el elemento durante `scrollIntoViewIfNeeded`; no se omite la prueba ni se cambian sus aserciones de desplazamiento.

- Anchos de la nueva matriz: **320, 360, 390, 430, 600, 601, 768, 1024 y 1440 px**. La suite existente añade **1366 y 1920 px**.
- Pantallas: inicio, biblioteca y su redirección, creador, guía de acompañamiento, privacidad, lector y práctica.
- Lectura: todas las páginas de «El puente de las ardillas» con letras de 18, 22 y 26 px; ambas caras del libro; seis páginas de un cuento creado con letra grande a 320 px; catálogo en ambos niveles mediante los casos existentes.
- Interacción: botones, deslizamiento vertical y horizontal, teclado, cambio de letra, ajustes, ayuda, ampliación, retorno del foco, narración, preguntas, XP, guía y guardado local mediante la suite propia.
- La nueva regresión mide el hueco antes del texto, la posición de la copia **durante** el giro, el margen inferior y la ausencia de animaciones infinitas. Medir solo `scrollWidth` no habría detectado el defecto de las capturas.
- Se comprueban teléfonos de poca altura (568 px), ampliación y diálogos desplazables. Las auditorías existentes de axe continúan cubriendo los recorridos principales.

Comandos reproducibles:

```powershell
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium webkit
npm run test:e2e
npm run test:e2e:webkit
```

Para comprobar la web ya publicada:

```powershell
$env:TEST_BASE_URL = 'https://lee-contigo-ia.vercel.app'
npm run test:e2e
```

Las nuevas regresiones reprodujeron los fallos del commit base antes de publicar la corrección. Se pueden ejecutar de nuevo contra el dominio público para verificar el despliegue corregido. Para comprobar una compilación local en otro puerto, se usa `npm run start -- --hostname 127.0.0.1 --port 4183` y `TEST_BASE_URL=http://127.0.0.1:4183`.

Los efectos que restauran preferencias después del renderizado del servidor o reinician estado al navegar tienen una excepción localizada a `react-hooks/set-state-in-effect`. Las imágenes locales generadas y los atlas tienen una excepción localizada a `no-img-element`. No se desactivan globalmente las reglas de Hooks ni de imágenes; las excepciones se explican en `eslint.config.mjs`.

## Evidencia y límites

Las capturas y registros locales están en `output/playwright/` (ignorados por Git):

- `production-before-*`: capturas de Vercel, incluida la copia desplazada durante el giro.
- `production-regressions.log`: las tres regresiones que fallaron contra producción.
- `production-baseline-tests.log`: resultado de la suite existente sobre Vercel.
- `corrected-*`: capturas y mediciones de la compilación corregida.
- `e2e-final.log`, `unit-final.log` y `webkit-final.log`: ejecuciones completas.
- `dialog-regression.log`: revalidación de Chrome posterior al arreglo de Safari.
- `webkit-before-focus-fix.log` y `webkit-focus-fixed.log`: fallos de WebKit y repetición de los dos casos corregidos.
- `output/playwright/webkit-report/index.html`: informe de WebKit; los recorridos completos de Chrome se registraron con el reportero de texto.

Se utiliza navegador real con emulación de tamaños y entrada táctil. No se probó un iPhone o un Android físico. WebKit en Windows no equivale a una certificación de Safari en un iPhone. Las respuestas de generación, ilustraciones y voz se simulan en los recorridos que necesitan resultados deterministas; esos recorridos no certifican disponibilidad de los servicios externos ni calidad pedagógica del contenido generado.

Las correcciones se integran en `main` para publicarse en el mismo dominio de Vercel. El despliegue y el commit indicados al principio corresponden a la versión base auditada. La publicación corregida se comprueba con el estado Ready de Vercel y con las regresiones del lector ejecutadas sobre el dominio público; su registro local se conserva en `output/playwright/publication.json`.

## Mejoras posibles, sin rediseñar

- Evaluar si el indicador de XP puede ocupar menos alto durante la lectura, manteniendo siempre el acceso al progreso.
- Ofrecer «Seguir leyendo» para recuperar la página de un cuento al volver, con un control sencillo para empezar de nuevo.
- Probar con niños de 6 a 10 años si «No entendí» y «Pensemos» se distinguen bien y si encuentran la flecha siguiente sin ayuda. Ajustar solo etiquetas y orden según esa observación.
- Antes de publicar, revisar el lector y el teclado de los formularios en un iPhone y un Android físicos, especialmente al girar el dispositivo.
