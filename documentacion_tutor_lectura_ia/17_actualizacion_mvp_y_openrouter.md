# 17. Actualización del MVP: lectura, ilustraciones y respaldo gratuito

Fecha del corte: 21 de octubre de 2026. Este documento actualiza las descripciones anteriores de portada opcional y biblioteca de dos cuentos.

## Experiencia disponible

- Cuatro cuentos originales: Una luz en el bosque, La semilla viajera, El camino al faro y La cometa que aprendió a volar.
- Dos versiones de cada cuento. Los botones cambian el texto real, las preguntas y la ruta; no son filtros decorativos.
- Los dos cuentos nuevos tienen seis párrafos por nivel y cuatro escenas ilustradas. La escena cambia conforme avanza el relato.
- Libro de dos caras en escritorio; diseño apilado y páginas más breves en móvil. Once tamaños de letra, voz del navegador, texto continuo y ampliación con cierre por Escape y control del foco.
- Cambio de página de 750 ms. Con movimiento reducido comienza desactivado; el lector puede activarlo expresamente. Las animaciones decorativas permanecen desactivadas con esa preferencia del dispositivo.
- Pausas opcionales para imaginar, buscar una señal, relacionar y resumir. «Ya lo pensé» marca la pausa en esta sesión, sin enviar respuestas.
- El planificador para adultos conserva historia, nivel y objetivo al comenzar la lectura acompañada.

## Crear un cuento en una sola acción

1. Se elige una idea ficticia y un nivel. Una persona adulta revisa la idea.
2. La IA escribe seis párrafos, tres preguntas de habilidades diferentes, dos pistas por pregunta y citas de evidencia.
3. El servidor valida estructura, longitudes, contenido básico y que cada cita exista en el párrafo indicado.
4. La página abre el libro y añade automáticamente una lámina de cuatro paisajes de nuestra colección. No hay una segunda pregunta sobre si se quieren imágenes ni información de facturación en el recorrido infantil.
5. La lectura avanza por páginas. Las preguntas permiten reintentar, consultar pistas y regresar al fragmento; las respuestas no se envían al modelo.

**Alcance de las imágenes:** en el modo gratuito actual son paisajes decorativos originales incluidos en el proyecto. No se generan a partir de la idea, no retratan necesariamente los hechos y no deben usarse como evidencia para las preguntas. La interfaz y la política de privacidad informan su origen. No se presenta una imagen de colección como una generación personalizada.

La integración de imágenes personalizadas queda detrás de `AI_IMAGE_MODE=generated`. Las pruebas reales con FLUX 3 Image, FLUX 3 Image Klein y Gemini 3.1 Flash Image recibieron HTTP 403: el proveedor indicó que esos modelos no estaban disponibles para usuarios del nivel gratuito. La configuración activa conserva `collection`; no se compraron créditos ni se activó recarga automática.

## Uso real de IA y recuperación ante fallos

```text
Solicitud validada
  → Vercel AI Gateway: Gemini y respaldo configurado
  → si falla o tarda demasiado: OpenRouter con modelos gratuitos
  → validación Zod y controles de contenido/evidencia
  → pista validada o cuento validado
  → ante fallo: pista editorial o formulario conservado y biblioteca
```

Para la pista, el modelo recibe relato, pregunta, habilidad, nivel, evidencia y momento de apoyo. No recibe las opciones ni la respuesta elegida. Debe devolver una acción de lectura y una pregunta de reflexión; se rechazan enlaces, formato inválido y repeticiones literales de opciones suficientemente largas. Esto reduce errores, pero no garantiza que nunca dé pistas demasiado reveladoras o poco útiles: falta revisión docente.

### OpenRouter

- Solo en el servidor: `OPENROUTER_API_KEY`, `_2`, `_3` y `_4`. Ninguna variable usa `NEXT_PUBLIC_`.
- Modelos permitidos: `openrouter/free` o identificadores con sufijo `:free`. La lista se configura con `OPENROUTER_MODELS`.
- Se exige formato JSON Schema, se pide `data_collection=deny` y se fija precio máximo cero para entrada y salida. Si no hay un proveedor compatible, se conserva la alternativa editorial.
- OpenRouter puede probar modelos alternativos dentro de una misma solicitud. Las claves secundarias se prueban ante HTTP 401 o un límite 402 identificado expresamente como propio de clave.
- Un 429 general, un rechazo 403 o saldo de cuenta agotado no provoca cambio de clave. No se usa la rotación para evitar límites generales. Varias claves no multiplican la cuota de una cuenta.
- El plazo de la llamada abarca todos los intentos de clave; no se abre un nuevo plazo por cada una.
- Las claves compartidas en un chat deben revocarse y sustituirse en las variables secretas de Vercel. No se incluyen valores en código, documentación ni Git.

La disponibilidad gratuita puede cambiar o agotarse. El modo de biblioteca permanece operativo sin proveedores de IA.

## Verificación de este corte

| Comprobación                                              | Resultado                                                                                      |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| TypeScript y compilación de producción                    | Aprobados                                                                                      |
| Pruebas unitarias                                         | 17 aprobadas, incluidos límites y cambio de credencial con respuestas simuladas                |
| Navegación, móvil y escritorio                            | 20 recorridos aprobados contra el servidor de producción local                                 |
| Cambio real de nivel y animación con movimiento reducido  | Aprobados en ambos tamaños                                                                     |
| Accesibilidad automática y desbordamiento                 | Sin infracciones en las rutas verificadas con axe; no equivale a certificación                 |
| Creador: ilustración automática y preguntas con evidencia | Recorrido simulado aprobado; no confirma disponibilidad de modelos                             |
| Cuento real por IA                                        | Una respuesta de seis párrafos, tres preguntas y 381 palabras verificada                       |
| OpenRouter real                                           | Respuesta estructurada de acción y reflexión verificada; también se observó un 429 transitorio |
| Credenciales en cliente                                   | Cero coincidencias de las cuatro claves en 31 archivos públicos de la compilación              |
| Imágenes personalizadas en nivel gratuito                 | No disponibles en los modelos probados; se usa colección                                       |
| Piloto, mejora del aprendizaje y ventas                   | Pendientes; no se afirman resultados                                                           |

Las pruebas técnicas no sustituyen una evaluación pedagógica ni garantizan ganar el concurso. La sustentación debe mostrar el problema, una generación real de IA, cómo las pistas invitan a volver al texto, usabilidad y un modelo de sostenibilidad por validar. Las bases mantienen los pesos: solución 50 %, pitch 20 %, facilidad de uso 20 % y difusión 10 %. Se requieren URL web y pitch de tres a cinco diapositivas; el registro y envío corresponden al equipo.

## Fuentes primarias

- Bases locales: `fuentes/bases_hackathon_futurx_2026.pdf`.
- OpenRouter, límites: https://openrouter.ai/docs/api/reference/limits
- OpenRouter, modelos de respaldo: https://openrouter.ai/docs/guides/routing/model-fallbacks
- OpenRouter, salidas estructuradas: https://openrouter.ai/docs/guides/features/structured-outputs
- OpenRouter, políticas de proveedores: https://openrouter.ai/docs/guides/privacy/provider-logging
- IES, recursos para comprensión lectora: https://ies.ed.gov/ncee/wwc/literacyresources2
- Vercel, imágenes: https://vercel.com/docs/ai-gateway/modalities/image-generation/ai-sdk
