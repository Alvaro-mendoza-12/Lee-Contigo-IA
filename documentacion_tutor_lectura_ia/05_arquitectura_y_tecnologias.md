# 05. Arquitectura y tecnologías sugeridas

## Arquitectura conceptual

El sistema tiene cinco partes:

1. **Interfaz web:** muestra relatos, preguntas, controles de accesibilidad y pistas.
2. **Servicio de aplicación:** valida la sesión, ubica el relato y pregunta y solicita una pista segura.
3. **Contenido revisado:** conserva relatos, objetivos, respuestas esperadas, referencias al texto y pistas de respaldo.
4. **Servicio de IA:** genera una pista acotada a la historia y a la habilidad de lectura.
5. **Vista adulta y medición:** en una fase posterior, da métricas agregadas a docentes u organizaciones autorizadas.

**Flujo de una pista:** el usuario elige “Pedir una pista” → el servidor recibe el relato, pregunta y nivel → recupera contenido aprobado → solicita una pista breve a la IA → valida la salida → la presenta. Si falla, muestra una alternativa preparada. El navegador nunca recibe la clave privada del proveedor.

## Stack sugerido

| Capa | Recomendación | Motivo y límite |
|---|---|---|
| Sitio web | Next.js con App Router y TypeScript | Organiza páginas y rutas servidoras en el mismo proyecto. La documentación oficial describe App Router como el sistema de navegación basado en archivos. |
| Interfaz | React y componentes accesibles | Adecuado para lectura, respuestas, progreso y cierre. Priorizar claridad sobre animaciones. |
| Coordinación de IA | Vercel AI SDK o integración equivalente desde el servidor | Ayuda a conectar interfaz y proveedores de modelos. El SDK no es el modelo ni garantiza precisión. |
| Modelo | Proveedor elegido después de comparar calidad, costo y términos de datos | Revisar idioma, latencia, retención de prompts, uso de datos para entrenamiento y costo por sesión. |
| Almacenamiento MVP | Sin base persistente de sesiones de niños; relatos aprobados como contenido del proyecto | Reduce complejidad, gasto y exposición de datos. |
| Almacenamiento piloto | Base PostgreSQL administrada, solo si hace falta y con acceso de adultos | Añadir después de justificar qué se guarda y aprobar protección de datos. |
| Hosting de demo | Vercel u otro hosting compatible con Next.js | Publica la URL que piden las bases. Verificar condiciones y límites del plan. |
| Accesibilidad | WCAG 2.2 AA como objetivo | Amplía usabilidad; la conformidad se debe comprobar con revisión y usuarios. |
| Observabilidad | Registro técnico mínimo, sin respuestas libres de menores | Medir errores, latencia y gasto sin guardar contenido de estudiantes. |

## Consideración sobre Vercel y comercialización

La documentación oficial limita el plan Hobby a proyectos personales y no comerciales. Puede servir para una demostración personal de hackathon si las condiciones vigentes lo permiten. Para vender el servicio, elegir un plan comercial adecuado u otro proveedor que autorice ese uso. El costo de IA es aparte del hosting y debe medirse por sesión.

## Decisiones que pueden cambiar después del MVP

- Proveedor y modelo de IA.
- Textos adaptados previamente por docentes o en tiempo real.
- Guardar métricas en base de datos o conservar solo indicadores agregados.
- Incorporar audio de lectura.
- Hosting comercial, región de datos y retención.
- Integración con currículos o plataformas educativas locales.

## Evitar en el primer prototipo

- Llamar a la API de IA directamente desde el navegador.
- Permitir chat general.
- Conectar sistemas escolares o importar listas de alumnos.
- Recoger audio, fotografías, ubicación o perfiles sociales.
- Depender de mensajería para demostrar la web pedida.
- Presentar la IA como autoridad que califica, diagnostica o decide apoyos escolares.
