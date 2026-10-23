# 15. Procedencia de los recursos visuales

## Ilustraciones originales

Se generaron específicamente para LeeContigo IA con la herramienta integrada de generación de imágenes, en modo **text2im**. No se utilizaron imágenes de referencia, personajes de terceros, logotipos o fotos de menores. Los archivos originales se importaron al proyecto sin modificar su contenido. Esto documenta su procedencia; no constituye un registro de derechos o marca.

| Uso                         | Archivo en el proyecto                                 |
| --------------------------- | ------------------------------------------------------ |
| Bosque, luciérnaga y grillo | `D:\LeeContigo IA\public\images\bosque-luciernaga.png` |
| Semilla en una ventana      | `D:\LeeContigo IA\public\images\semilla-ventana.png`   |

Ambos archivos son PNG de 1536 × 1024. Se muestran mediante Next Image con variantes optimizadas, texto alternativo y recorte adaptable.

### Prompt final: bosque

> Use case: illustration-story. Asset: original landscape cover illustration for LeeContigo IA, a calm Spanish children's reading web app for ages 8–10. Create a richly textured storybook watercolor and gouache illustration of a tiny friendly firefly illuminating stepping stones across a narrow woodland stream, helping a small cricket cross. Dense but peaceful layered forest with ferns, soft moss and a pale crescent moon behind wispy clouds. Small warm firefly glow is the visual focus, gentle expressive insects with natural proportions, no humans. Muted sage greens, deep soft forest green, misty teal water, cream and warm amber light. Tactile hand-painted paper texture, subtle dimensional lighting, exquisite editorial children's book illustration, reassuring and curious, not scary, not oversaturated, not flat vector. Landscape 3:2 composition, important subject near center so the image can crop to 16:9. No text, no typography, no logo, no watermark, no copyrighted characters.

### Prompt final: semilla

> Use case: illustration-story. Asset: original landscape cover illustration for LeeContigo IA, a calm Spanish children's reading web app for ages 8–10. Create a richly textured storybook watercolor and gouache illustration of a small terracotta pot on a warm wooden windowsill, a fresh green seedling emerging from rich soil with the seed and roots subtly visible through a small natural soil cutaway. Gentle late-afternoon sunlight enters the window, a peaceful garden softly out of focus outside. A watering can rests beside the pot, quiet signs of care and patience. No people or faces. Muted sage greens, warm cream, soft peach terracotta, dusty ochre sunlight, low saturation, tactile hand-painted paper texture, subtle dimensional lighting, exquisite editorial children's book illustration, inviting and peaceful, not flat vector. Landscape 3:2 composition, important subject near center so the image can crop to 16:9. No text, no typography, no logo, no watermark, no copyrighted characters.

## Recursos de terceros

- **Iconos Lucide:** biblioteca `lucide-react`. Su aviso ISC y los avisos de los iconos derivados de Feather se conservan en `licencias/LUCIDE.txt`.
- **Tipografía Nunito Sans:** distribuida bajo SIL Open Font License; aviso conservado en `licencias/NUNITO-SANS-OFL.txt`. Fuente oficial: https://github.com/google/fonts/tree/main/ofl/nunitosans.
- **Capturas del producto:** producidas desde la propia aplicación para documentar el MVP y la presentación. No representan pruebas con usuarios reales.

No se descargaron fotografías de bancos de imágenes. La interfaz utiliza movimiento CSS opcional; con movimiento reducido se detienen los movimientos decorativos. El lector puede activar expresamente el cambio de página.

## Nuevas láminas de cuatro escenas

Herramienta integrada de generación de imágenes, modo predeterminado de texto a imagen. Sin imágenes de referencia. Cada lámina tiene una cuadrícula de 2 × 2; la interfaz recorta un cuadrante cada vez.

| Archivo                                                   | Uso                                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `D:\LeeContigo IA\public\images\tortuga-faro-escenas.png` | Mara consulta el mapa, elige sendero, descubre una concha y llega al faro                  |
| `D:\LeeContigo IA\public\images\cometa-escenas.png`       | Teo y Ada preparan una cometa, observan su caída, alargan la cola y la ven volar           |
| `D:\LeeContigo IA\public\images\lectura-paisajes.png`     | Paisajes decorativos que acompañan automáticamente los cuentos creados en el modo gratuito |

Especificaciones de los prompts de tortuga y cometa: cuatro paneles cuadrados iguales en cuadrícula 2 × 2, sin separaciones; personajes consistentes; escenas en el orden narrativo de la tabla; gouache minimalista con verdes salvia, crema y azul suave; composición clara, amigable para niños de 8 a 10 años; sin texto, logotipos, marcas de agua ni personajes de terceros.

### Prompt final: paisajes de lectura

> Use case: illustration-story. Create one original square image atlas for a calm children's reading web app. Exactly FOUR equal square panels in a perfectly aligned 2 by 2 grid, no gaps or borders. Four quiet imaginary landscapes used as decorative reading companions, no plot, NO characters: top left a curved path through rounded sage trees and warm morning sky, top right a calm river with smooth stones and tiny flowers, bottom left rolling hills under soft sunset clouds, bottom right a peaceful garden under a crescent moon and a few stars. Minimalist hand-painted gouache on warm cream paper, large simple shapes, clear composition, restrained sage green, dusty blue and warm ochre. Friendly and peaceful for children 8–10, tasteful professional picture-book artwork. No typography, letters, watermarks, logos, people, animals or recognizable copyrighted elements. Fill each panel completely so it can be cropped independently.

Estos recursos fueron generados durante el desarrollo e incluidos como archivos estáticos. Su presencia no significa que la API gratuita produzca imágenes personalizadas durante el uso.

## Láminas editoriales de ocho escenas

Modo: **herramienta integrada de generación de imágenes**, texto a imagen, sin imágenes de referencia. Cuatro archivos nuevos incorporados al proyecto; no sustituyen ni sobrescriben los originales.

| Archivo final                                        | Contenido                             |
| ---------------------------------------------------- | ------------------------------------- |
| `D:\LeeContigo IA\public\images\bosque-libro-8.png`  | Ocho momentos de Lina y Tomás         |
| `D:\LeeContigo IA\public\images\semilla-libro-8.png` | Ocho momentos de Nico y la semilla    |
| `D:\LeeContigo IA\public\images\faro-libro-8.png`    | Ocho momentos de Mara y el faro       |
| `D:\LeeContigo IA\public\images\cometa-libro-8.png`  | Ocho momentos de Teo, Ada y la cometa |

Cada prompt final se forma concatenando la base común y su variante, tal como sigue.

### Base común

> Use case: illustration-story. Original picture-book art for LeeContigo IA. Create ONE TALL atlas with exactly EIGHT separate square panels in a precisely aligned grid of TWO columns by FOUR rows, no margins, gutters, captions or borders. Canvas ratio 1:2, every cell equal square. Reading order row by row. Keep identical characters and colors across all eight scenes. Minimalist editorial gouache, warm ivory paper, muted sage, dusty blue and soft amber, big simple shapes, very clear central action, only a few background details. Calm inviting expressive characters for ages 8–10. NOT photorealistic, not crowded, no lettering, text, watermarks, logos, copyrighted characters. Each panel must depict its listed different narrative moment and fill its square.

### Variante: bosque

> Story: a tiny warm golden firefly with translucent wings helps a small olive-green cricket cross a moonlit woodland stream. These insects are friendly, gentle and consistently recognizable, not humanoid. Panels: 1 firefly alone glowing softly at dusk beside the stream, 2 firefly looking at her little light with tall calm trees behind, 3 cricket arrives under leaves as clouds hide the moon, 4 cricket looks at barely visible stepping stones and pauses, 5 firefly lights the first round stone while cricket watches, 6 cricket carefully hops behind firefly halfway across, 7 both reach the opposite riverbank safely, 8 grateful cricket and softly glowing firefly together on moss beside the stream. Distinct camera compositions with ample breathing space.

### Variante: semilla

> Story: a curious fictional child Nico, about 9 years old, medium brown skin, short dark hair, simple muted sage shirt and cream trousers, learns to care patiently for a seed. No real person. Panels: 1 child finds a tiny brown seed in coat pocket by the door, 2 child examines seed in palm beside a bright window, 3 child chooses a small terracotta pot and soft soil, 4 child carefully puts seed in soil and covers it, 5 child gives pot a little water with a small blue watering can, 6 child patiently observes the unchanged soil on another day, 7 a small fresh green shoot emerges while child smiles, 8 thriving little seedling on sunlit windowsill and child quietly admiring it. No labels or scientific diagrams.

### Variante: faro

> Story: a friendly small sage-green turtle Mara, little terracotta satchel, travels a coastal path to a lighthouse, with a simple white gull friend. Panels: 1 turtle unfolds a map in garden overlooking sea, 2 turtle packs a red apple in satchel, 3 turtle studies a fork with a leaf symbol on one plain sign and a white conch symbol on the other, no letters, 4 gull and turtle look at the coastal conch path, 5 turtle pauses where wind-blown sand has covered the trail, 6 turtle brushes sand from a white conch with one foot, 7 turtle arrives in the lighthouse garden with gull, 8 turtle and gull rest near the lighthouse as its light glows at dusk. Calm coast, simple elegant shapes.

### Variante: cometa

> Story: Teo a friendly cream rabbit wearing a muted sage vest and Ada a small russet squirrel wearing a soft ochre scarf build a BLUE diamond kite together. Panels: 1 rabbit carefully joins blue kite on a simple wooden table outdoors, 2 squirrel arrives carrying long soft fabric ribbons, 3 rabbit tries to launch kite which tilts toward grass safely, 4 both stop to examine the little short kite tail, 5 rabbit holds kite while squirrel observes the wind and tail, 6 both attach a longer ribbon tail, 7 rabbit takes a few steps as squirrel helps blue kite rise, 8 friends admire the blue kite steady high over a quiet meadow. Keep kite blue in every scene, clear distinct actions.

En el lector se intercambian los paneles quinto y sexto de cometa para mantener el orden «añadir cola, probar el vuelo» que muestran las imágenes finales. Los recortes de las láminas se hacen en la interfaz, manteniendo proporción y sin editar los archivos originales.

## Dos relatos añadidos el 22 de octubre de 2026

Modo: generación original de ilustración con la herramienta integrada `image_gen`. No se descargaron imágenes de otros sitios. Se conservaron las láminas originales y el lector muestra cada cuadrante mediante CSS.

| Relato | Archivo incorporado | Escenas |
| --- | --- | --- |
| El sendero de las huellas | `public/images/sendero-libro-4.png` | Bifurcación; huellas en el barro; pluma bajo las hojas; encuentro junto al estanque |
| El buzón del bosque | `public/images/buzon-libro-4.png` | Preparar el buzón; viento y sobres; añadir una tapa con abertura; leer juntos la invitación |

Brief de generación para Sendero: lámina infantil 2 × 2 sin títulos, letras ni marcas, estilo de cuento ilustrado, mismos personajes en las cuatro escenas. Nina es una coneja de bufanda verde y bolso; Beto, un erizo de gorra amarilla. Solo en el encuentro final aparece Teo, un pato dorado. Las acciones deben distinguirse y coincidir con las cuatro partes del relato.

Brief para Buzón: lámina infantil 2 × 2 sin texto ni marcas, colores luminosos y acciones claras. Fito es un zorro naranja con overol azul y Alma una nutria de bufanda verde. Mantener el mismo buzón azul, mostrar cartas que vuelan, la solución de la tapa con ranura y el encuentro final. Evitar herramientas peligrosas.

Los textos y preguntas se escribieron para este catálogo. La correspondencia entre escena y pasaje se revisó visualmente; queda pendiente una revisión editorial y docente externa.
