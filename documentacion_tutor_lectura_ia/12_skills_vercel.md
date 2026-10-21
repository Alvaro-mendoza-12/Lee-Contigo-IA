# 12. Skills del repositorio Vercel que convienen

Repositorio consultado: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills). Es una colección de instrucciones para agentes de desarrollo. Las skills no son modelos de IA ni componentes que se agregan al producto; guían tareas de documentación, revisión, diseño o despliegue.

## Las más útiles para LeeContigo

| Skill | Uso recomendado |
|---|---|
| **writing-guidelines** | Revisar esta documentación y luego los textos de la web y el pitch para mejorar claridad, estructura y consistencia. |
| **web-design-guidelines** | Revisar la interfaz cuando exista; pertinente para usabilidad, accesibilidad web, navegación, controles y formularios. |
| **react-best-practices** | Al construir en React o Next.js, revisar rendimiento, carga de datos y estructura de componentes. |
| **composition-patterns** | Si la interfaz crece y necesita componentes reutilizables para relatos, preguntas, pistas y panel docente. |
| **vercel-optimize** | Después de publicar y tener métricas, revisar costo, rendimiento, funciones y caché en Vercel. |
| **vercel-deploy-claimable** | Solo si el equipo usa ese mecanismo de publicación y transferencia de propiedad de Vercel. No sirve para crear documentación. |

## Menos relevantes ahora

- **react-native-guidelines:** se refiere a React Native o Expo; las bases piden una URL web, no una app nativa.
- **react-view-transitions:** guía animaciones; no es prioridad frente a lectura, seguridad y accesibilidad.
- **vercel-optimize:** no tiene métricas que analizar antes de publicar una aplicación.
- **vercel-deploy-claimable:** requiere una aplicación construida, no publica esta carpeta documental.

## Cuándo aplicarlas

1. **Ahora:** writing-guidelines para editar y revisar documentación.
2. **Diseño de web:** web-design-guidelines para accesibilidad y facilidad de uso.
3. **Desarrollo React/Next.js:** react-best-practices; composition-patterns si la interfaz escala.
4. **Después de desplegar:** vercel-optimize si se usa Vercel y hay métricas.
5. **Publicación:** una skill de despliegue si el equipo elige ese mecanismo.

El repositorio describe instalación mediante el comando npx skills add vercel-labs/agent-skills. No instalé ni ejecuté skills; aquí identifiqué cuáles encajan con tu solicitud.
