# 04. Requerimientos funcionales y no funcionales

Los requisitos describen lo que se debe construir; no significan que ya esté implementado. Los marcados MVP son los necesarios para una demostración. Los demás corresponden a piloto o versiones posteriores.

## Requerimientos funcionales

| ID    | Requisito                                       | Prioridad | Criterio de aceptación                                                                                                                    |
| ----- | ----------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| RF-01 | Explicar utilidad y límites del tutor en inicio | MVP       | La persona entiende que es práctica y no diagnóstico o profesor.                                                                          |
| RF-02 | Iniciar sin cuenta de menor                     | MVP       | No se pide nombre, correo, teléfono ni colegio.                                                                                           |
| RF-03 | Elegir una banda de lectura                     | MVP       | Las opciones se entienden y pueden cambiarse.                                                                                             |
| RF-04 | Mostrar una biblioteca breve                    | MVP       | Cada relato indica tema, duración, nivel y objetivo.                                                                                      |
| RF-05 | Presentar texto adaptable                       | MVP       | Se lee en móvil y escritorio; permite ampliar letra y pausar.                                                                             |
| RF-06 | Ofrecer preguntas de comprensión                | MVP       | En los cuentos generados hay una pregunta para localizar información, una de inferencia y otra de idea principal.                         |
| RF-07 | Entregar pista gradual                          | MVP       | Cada pregunta generada ofrece dos pistas vinculadas a un párrafo; no revelan directamente la respuesta y permiten volver a intentarlo.    |
| RF-08 | Ajustar pista a nivel de práctica               | MVP       | La misma habilidad se presenta con dos formulaciones de dificultad.                                                                       |
| RF-09 | Validar la respuesta del modelo                 | MVP       | El cuento cubre las tres habilidades, cada pregunta tiene dos pistas y evidencia válida; una salida inválida activa reintento o respaldo. |
| RF-10 | Cerrar con comentario motivador                 | MVP       | No emite notas escolares ni etiquetas.                                                                                                    |
| RF-11 | Mantener contenido si la IA falla               | MVP       | La sesión se puede completar usando pistas predefinidas.                                                                                  |
| RF-12 | Explicar uso de IA y datos                      | MVP       | La explicación está visible antes de empezar.                                                                                             |
| RF-13 | Guardar progreso individual                     | Posterior | Solo después de definir consentimiento, acceso, retención y borrado.                                                                      |
| RF-14 | Mostrar tendencias agregadas a docentes         | Piloto    | No expone nombres en vistas colectivas.                                                                                                   |
| RF-15 | Crear y revisar contenido                       | Posterior | Publica solo editor autorizado con fuente y revisión registrada.                                                                          |
| RF-16 | Añadir audio de lectura                         | Posterior | No guarda grabaciones del estudiante.                                                                                                     |
| RF-17 | Reportar respuesta errónea o inapropiada        | MVP       | Un adulto puede enviar un reporte.                                                                                                        |
| RF-18 | Exportar resumen agregado                       | Posterior | El informe no incluye identificadores de estudiantes.                                                                                     |
| RF-19 | Explicar la evidencia de una pista              | MVP       | El lector puede abrir el párrafo que la pregunta señala como evidencia.                                                                   |
| RF-20 | Evitar enviar la respuesta infantil al modelo   | MVP       | Las opciones y los intentos se comparan en la página; no generan llamadas adicionales ni se guardan.                                      |

## Requerimientos no funcionales

| ID                          | Requisito                                         | Objetivo de diseño                                                                                                                     |
| --------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 Usabilidad           | Recorrido entendible por un niño de primaria      | Una acción principal por pantalla y mensajes breves.                                                                                   |
| RNF-02 Accesibilidad        | WCAG 2.2 AA como objetivo                         | Contraste, foco visible, teclado, controles etiquetados y soporte para tecnología asistiva. La conformidad debe comprobarse.           |
| RNF-03 Adaptabilidad        | Pantallas pequeñas y conexión móvil               | Diseño mobile-first, pocas imágenes y dependencias.                                                                                    |
| RNF-04 Rendimiento          | Mantener un flujo ágil                            | Meta inicial: contenido en menos de 2 s; respuesta IA en menos de 8 s en percentil 95 o mostrar alternativa. Son metas, no resultados. |
| RNF-05 Privacidad           | Minimizar datos de menores                        | Sin cuenta ni perfil persistente en el MVP; no pedir nombre, ubicación, escuela, voz ni datos sensibles.                               |
| RNF-06 Seguridad            | Proteger claves y servicio de IA                  | Secretos en servidor, validación de entradas, límites de solicitudes y protección de rutas adultas.                                    |
| RNF-07 Seguridad infantil   | IA limitada al aprendizaje                        | Sin chat abierto, consejos personales, temas no relacionados ni marketing dirigido al niño.                                            |
| RNF-08 Confiabilidad        | No bloquear por falla del modelo                  | Fallback revisado, reintento limitado y mensaje claro.                                                                                 |
| RNF-09 Precisión pedagógica | Alinear textos y pistas con objetivos             | Una persona responsable de pedagogía puede revisarlos.                                                                                 |
| RNF-10 Transparencia        | Explicar uso y falibilidad de IA                  | Aviso visible de que la pista usa IA y debe revisarse contra el texto.                                                                 |
| RNF-11 Costo                | Evitar generación ilimitada                       | Limitar solicitudes y respuestas; medir costo por sesión.                                                                              |
| RNF-12 Mantenibilidad       | Separar contenido, interfaz y reglas de IA        | Cambiar modelo o lecturas sin rediseñar toda la web.                                                                                   |
| RNF-13 Portabilidad         | Evitar dependencia innecesaria de una institución | El contenido y futuras métricas pueden exportarse sin datos personales.                                                                |
| RNF-14 Idioma               | Español apropiado para la comunidad piloto        | Evitar regionalismos sin validar y preparar adaptaciones locales.                                                                      |
| RNF-15 Equidad de acceso    | No asumir dispositivo propio ni conexión estable  | Verificar acceso real y permitir uso compartido en aula con guía docente.                                                              |

## Criterios de aceptación del MVP

- El recorrido completo funciona sin crear una cuenta.
- Lectura y preguntas siguen disponibles aunque la IA esté apagada.
- La pista corresponde al relato y a la pregunta visibles.
- Cada cuento generado incluye una pregunta explícita, una inferencial y una de idea principal, con dos pistas graduadas por pregunta.
- Una respuesta incorrecta ofrece una pista y el párrafo de apoyo; la explicación final aparece tras acertar o agotar tres intentos.
- No se envía nombre, edad exacta, escuela ni información personal a la IA.
- Las respuestas seleccionadas no se envían a la IA ni se conservan al salir de la página.
- La web se usa en móvil sin desplazamiento horizontal.
- Un adulto encuentra información sobre IA y privacidad antes de iniciar.
- La web y las diapositivas de hackathon no muestran nombres personales, universidades ni países del equipo.
