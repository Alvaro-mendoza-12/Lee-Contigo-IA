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
