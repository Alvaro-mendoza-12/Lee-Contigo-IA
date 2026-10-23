# Mejoras visuales infantiles y selección de reto

22 de octubre de 2026. Rama: `codex/requisitos-mvp`.

## Problema comunicado: «Un nuevo reto» en «Elige tu cuento»

Se reprodujo el recorrido en producción, en móvil y escritorio. El selector modificaba el parámetro `nivel` y los enlaces de las diez portadas. El texto y las preguntas del libro abierto correspondían al nivel seleccionado. Sin embargo, la descripción de la biblioteca estaba oculta visualmente y la selección apenas cambiaba el aspecto del control. Para un niño podía parecer que no ocurría nada.

La corrección se publicó primero en el commit `3ca9eab`:

- Cada nivel explica su efecto: **Frases cortas** o **Más vocabulario**.
- Al elegir el reto aparece **«Reto listo. Elige una portada para empezar.»**, con icono y anuncio accesible.
- Las diez portadas reciben una marca **Reto** y un borde diferenciado.
- Abrir una portada carga su texto y sus preguntas de reto.
- La elección continúa al recargar y se puede volver a Paso a paso, retirando las marcas.

Es un selector de nivel previo a elegir el cuento. El recorrido queda explícito: **elegir nivel → tocar portada → leer → explorar las preguntas correspondientes**.

## Dirección visual

Se aplicaron las skills `frontend-design`, `web-design-guidelines` y `vercel-react-best-practices`, conservando la tipografía Nunito Sans y la identidad del libro.

Paleta: tinta bosque `#245b48`, papel `#fffdf5`, azul suave `#e9f3f5`, verde hoja `#edf3e1`, amarillo papel `#fff2cf` y amarillo de reto `#ffdf7a`. Los colores claros se usan como fondos y las etiquetas conservan tinta oscura. El personaje y las cubiertas son los focos visuales; el texto de lectura permanece tranquilo y legible.

### Cambios

1. **Luciérnaga lectora:** ilustración vectorial original, en el inicio, la cabecera del creador y la biblioteca personal vacía. Reemplaza adornos anteriores; no es un botón ni reproduce animaciones continuas. Está oculta para tecnologías de asistencia porque es decorativa.
2. **Estantes por tema:** Amigos, Naturaleza y Aventuras. Cada grupo tiene un fondo suave y un icono sobre una pieza de papel. «Aventuras» sustituye el título más largo para facilitar su lectura y cabida en móvil.
3. **Cubiertas con lomo:** borde lateral de color, esquinas de libro y sombra corta. El foco de teclado sigue visible. El desplazamiento táctil y las flechas se conservan. La respuesta al hover es breve y respeta movimiento reducido.
4. **Ideas ilustradas:** dentro de «Necesito una idea» se muestran una tortuga, una nube y una semilla, usando las imágenes existentes. Tocar una completa el campo, señala la selección y devuelve el foco al texto. La creación sigue requiriendo pulsar Crear mi cuento y mantener la revisión adulta.

No se añadieron pantallas, cuentas, servicios, dependencias ni solicitudes de IA al elegir una imagen. Los cuentos, las imágenes por escena, las voces, los gestos de tablet, la ayuda contextual, la práctica y el guardado temporal conservan su funcionamiento.

## Accesibilidad y diez heurísticas

| Heurística            | Aplicación en este bloque                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Estado visible        | Confirmación de reto, portadas marcadas y selección de idea con una señal de verificación.                                   |
| Lenguaje familiar     | Frases cortas, más vocabulario, amigos, naturaleza, aventuras y personajes ilustrados.                                       |
| Control y libertad    | Se puede cambiar de nivel y editar la idea sugerida antes de crear.                                                          |
| Consistencia          | Las marcas de reto corresponden al parámetro de nivel usado por el lector y la práctica.                                     |
| Prevención de errores | Elegir una imagen solo rellena el campo; mantiene la revisión adulta y el envío explícito.                                   |
| Reconocimiento        | Miniaturas junto a etiquetas cortas, más fáciles de explorar que ideas largas sin imágenes.                                  |
| Flexibilidad          | Ratón, dedo y teclado; texto editable y sugerencias opcionales.                                                              |
| Minimalismo           | Los dibujos sustituyen adornos; las ideas se despliegan a petición. La nueva frase explica una acción que resultaba confusa. |
| Recuperación          | Cambiar a Paso a paso retira las marcas; los errores y apoyos existentes permanecen.                                         |
| Ayuda                 | Instrucción breve para el siguiente paso, etiquetas de nivel y ayudas contextuales conservadas.                              |

Los controles tienen nombres accesibles vinculados a sus títulos y descripciones. El color no es la única señal de selección. La luciérnaga no añade un foco de teclado y los adornos no cubren acciones.

## Archivos

- `components/library.tsx`: elección de nivel y confirmación visible.
- `components/story-shelf-row.tsx`: marca de reto y categorías.
- `components/reading-friend.tsx`: ilustración vectorial original, sin descarga de terceros.
- `app/page.tsx`, `components/book-shelf.tsx`: uso de la ilustración.
- `components/story-creator.tsx`: sugerencias con miniaturas y estado seleccionado.
- `app/child-minimal.css`: estantes, libros, personaje y adaptación móvil.
- `tests/e2e/reading.spec.ts`, `mobile-library.spec.ts`, `story-creator.spec.ts`: regresiones del recorrido.

## Verificación

- Compilación de producción y TypeScript correctos.
- 30 pruebas unitarias y 54 pruebas de navegador en escritorio y móvil.
- La prueba de reto comprueba confirmación, diez marcas, enlaces del nivel correcto, persistencia al recargar, cambio de vuelta y preguntas de reto.
- La prueba de ideas verifica tres opciones, campo completado, foco, selección visible y ausencia de envío automático.
- Comprobaciones automáticas de accesibilidad con axe en los recorridos, incluidas las ideas desplegadas y el catálogo en reto.
- Revisión visual a 320, 390 y 1.440 px. Se corrigió el desbordamiento de la cabecera de categoría a 320 px y se añadió una comprobación de regresión para ese ancho.
- Capturas locales en `output/visual-child/`, excluidas de Git.

La verificación de móvil y tablet usa emulación de Chrome. Sigue pendiente un estudio de usabilidad con niños y personas adultas acompañantes; la estética y las pruebas técnicas no demuestran una mejora pedagógica por sí solas. No se modificó la arquitectura de IA en este bloque.

## Referencias

- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines): foco, etiquetas, estados, movimiento y respuesta de los controles.
- [W3C: Use Icons that Help the User](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p07-icons-used/): símbolos familiares acompañados por palabras.
- [NN/g: Designing for Kids — Cognitive Considerations](https://www.nngroup.com/articles/kids-cognition/): vocabulario e instrucciones adaptados a las habilidades de lectura.
