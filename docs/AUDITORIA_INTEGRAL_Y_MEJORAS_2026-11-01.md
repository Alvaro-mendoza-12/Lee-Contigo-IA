# Auditoría integral y mejoras de LeeContigo

Fecha de consulta: 1 de noviembre de 2026, America/Bogota.

## Conclusión

La interfaz actual es una base adecuada para seguir probando: tres destinos principales, cuentos ilustrados, letra ajustable, voz a petición, ayudas graduales y ausencia de publicidad. Conviene mejorar la continuidad, la autonomía y la claridad de la información antes de añadir más botones o actividades.

Se implementan mejoras puntuales en una vista previa de la rama remota `mejoras`: recordar dónde se dejó un libro, respetar la preferencia de movimiento, confirmar borrados, simplificar el aviso de privacidad y ofrecer una conversación opcional al terminar. Se conserva la identidad visual y el sistema de cuentos, preguntas, ayudas, niveles y recompensas.

Esta auditoría comprueba diseño y funcionamiento y consulta investigación educativa. **No demuestra eficacia de aprendizaje, no es una evaluación clínica ni una certificación legal internacional.** Una revisión de todas las páginas de internet o de cada país sería inabarcable. La cobertura y sus límites se enumeran expresamente.

## Procedencia y alcance

- Base: producción de [LeeContigo](https://lee-contigo-ia.vercel.app), rama `main`, commit `76b7436109a8f95ca7caf1f00d7f89ac5ac95f01`.
- Despliegue base verificado en Vercel: `dpl_36qGdR4H8evASS98HbMx9qkXoEaU`, estado Ready.
- Se revisan inicio y biblioteca, lector, preguntas, creador y libros guardados, acompañamiento, privacidad, navegación, diálogos, preferencias, recompensas y las rutas de IA, imágenes, voz y estado.
- La matriz de diseño comprende 320, 360, 390, 430, 600, 601, 768, 1024 y 1440 px; los recorridos existentes añaden 1366 y 1920 px.
- Implementación publicada: commit `b7fbcf7e79436f79d83b337aa3bc169c7866a773`, rama remota `mejoras`. [Vista previa de la rama](https://lee-contigo-ia-git-mejoras-alvaro-s-projects1.vercel.app), [despliegue de la implementación auditada](https://lee-contigo-pl2om146t-alvaro-s-projects1.vercel.app). Vercel confirmó estado Ready y destino Preview; producción continúa en el commit base. Una actualización posterior de este informe no cambia el código comprobado.
- Durante el trabajo aparecieron cambios simultáneos de otra tarea en la carpeta original. Se preservaron y se continuó en `D:\LeeContigo-auditoria-mejoras`, desde el mismo commit de producción. La auditoría no incorpora la nueva mascota de esa otra tarea. La rama local aislada es `codex/mejoras-auditoria`; la rama publicada para revisión es `mejoras`.
- Los dos PDF ajenos a esta solicitud permanecen intactos. Las capturas proporcionadas por el usuario se tratan como evidencia visual.

## Criterios de investigación

Se priorizan fuentes primarias: organismos de infancia, asociaciones profesionales, guías de evidencia, universidades, ministerios y estándares de accesibilidad. Se distingue entre síntesis científica, investigación empírica, recomendaciones profesionales, política educativa y posición ética. Un programa nacional o un texto religioso no se presenta como un ensayo psicológico.

La selección abarca referencias de Perú, Chile, Estados Unidos, Reino Unido, Portugal, Suecia, Finlandia, Rusia, India, Japón, China, Irán, Corea del Norte, Australia, Sudáfrica y el Vaticano, además de organismos internacionales. La ficha de Corea del Norte está archivada; de la referencia rusa se pudo consultar la ficha institucional, no el artículo completo. No se deducen reglas de interfaz de esas dos referencias.

Se mantiene el español y se adapta la ayuda al nivel de lectura, sin pedir la edad o datos del niño. Los resultados sobre otros idiomas, sistemas escolares o edades no se trasladan automáticamente a LeeContigo.

### Decisiones que orienta la evidencia

| Principio | Aplicación a LeeContigo | Límite de la inferencia |
| --- | --- | --- |
| La participación y las recompensas no equivalen a aprender. | Añadir una invitación opcional a explicar o dibujar lo leído, fuera del cuestionario. | Es una oportunidad de conversación; no mide transferencia ni acredita aprendizaje. [APA](https://www.apa.org/news/press/releases/2026/09/education-technology-engagement). |
| Estrategias de comprensión, lenguaje y conversación necesitan apoyo explícito. | Mantener pistas, evidencia del texto y acompañamiento adulto. | Las guías evalúan prácticas educativas, no esta app. [IES](https://ies.ed.gov/ncee/wwc/PracticeGuide/14), [EEF, 7–11 años](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/literacy-ks2). |
| El bienestar incluye autonomía, competencia, inclusión y relaciones. | Permitir seguir otro día, volver al inicio y conservar un libro al cancelar su borrado. | Los resultados de juego digital orientan el diseño; no prueban mejora lectora de un marcador. [UNICEF RITEC](https://www.unicef.org/innocenti/reports/responsible-innovation-technology-children). |
| La IA infantil requiere privacidad y explicaciones comprensibles. | Resumen breve de privacidad y detalle adulto; almacenamiento limitado de páginas, sin nuevas respuestas. | El resumen no sustituye revisar las condiciones de proveedores y el contexto de uso. [UNICEF, guía 3.0](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children). |
| La accesibilidad requiere navegación clara y control del movimiento. | Preferencia recordada, respeto inicial de movimiento reducido, nombres accesibles y foco al cancelar. | Axe y la emulación no sustituyen pruebas con lectores de pantalla y dispositivos físicos. [W3C COGA](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/). |

No se impone un tiempo universal de atención o una cuenta atrás. Por ejemplo, las recomendaciones suecas consultadas sobre ocio digital excluyen expresamente los libros electrónicos y el uso escolar: no corresponde convertir su cifra de ocio en un límite automático para este lector. [Agencia de Salud Pública de Suecia, 2024](https://www.folkhalsomyndigheten.se/contentassets/ab9cc71603f84f048dadf4c2851032f6/recommendations-childrens-adolescents-digital-media-use.pdf).

## Hallazgos y cambios implementados

| Hallazgo | Corrección y comprobación |
| --- | --- |
| Al recargar o reabrir se vuelve a la primera página. | Se recuerdan hasta ocho posiciones de catálogo y libros creados durante siete días. Se valida origen, identificador, nivel y posición; si el texto ya no admite la posición se vuelve al inicio. Los niveles y el modo demo mantienen marcas separadas. |
| El inicio no ofrece continuidad. | Cuando existe una lectura pendiente válida y abierta, el destino «Cuentos» pasa a «Seguir leyendo», con el título del libro. Se mantienen los tres destinos y el catálogo completo debajo. |
| No hay una forma explícita de empezar otra vez conservando el libro. | «Leer desde el inicio» se incorpora dentro de Ajustes, sin añadir controles a la barra principal. Al terminar un cuento se retira su marca pendiente. |
| El control de animación vuelve a activarse al recargar e inicialmente ignora la preferencia del dispositivo. | Se comparte una preferencia entre lectores. El inicio respeta movimiento reducido; una elección expresa del lector puede activar o desactivar los giros. No se cambia la ausencia de movimiento continuo en las ilustraciones. |
| WebKit permite escribir antes de que React atienda los cambios y puede perder la idea. | El formulario habilita sus controles al quedar interactivo. Una prueba retiene los archivos de JavaScript, comprueba que la entrada espera y después crea el cuento conservando la idea escrita. |
| Un toque en «Borrar» elimina un libro creado. | Diálogo de confirmación para uno o todos los libros. «No, conservar» recibe el foco; Escape conserva el contenido y devuelve el foco. El borrado confirmado limpia sus marcas y comunica fallos sin fingir éxito. |
| El aviso es extenso y omite explicar los puntos locales que ya existían. | Cinco mensajes breves visibles; detalle conservado para familias y docentes. Se describen recompensas, marcas, plazos, uso compartido del navegador y borrado. Se añaden las nuevas preferencias de movimiento. |
| Las letras decorativas A/B/C forman parte del nombre accesible de cada respuesta. | Se ocultan a la tecnología asistiva; el nombre del control corresponde al texto de la opción. La presentación visual se conserva. |
| El cierre de la práctica se limita al cuestionario y las recompensas. | «Cuéntalo a tu manera» es un desplegable opcional, con una pregunta breve según el nivel y la alternativa de contar o dibujar. No añade formularios, grabaciones, puntuación ni solicitudes de IA. |
| La instrucción del tutor menciona 8–10 años, aunque el producto atiende 6–10. | Se alinea el rango y se pide adaptar el lenguaje al nivel indicado sin inferir edad o capacidad. Se conserva el filtrado y el respaldo preparado. |
| El cliente importa el catálogo completo para mostrar portadas y etiquetas. | Se separan metadatos y textos. El inicio recibe solo los campos necesarios para la estantería y las longitudes de las páginas. La búsqueda de los 166 párrafos de los 19 cuentos en los 22 archivos JavaScript públicos de la compilación no encontró coincidencias. Los textos de cada libro siguen entregándose al abrir su lectura. |
| Acompañamiento y README describen funciones antiguas. | Se corrige la explicación de ilustraciones, se incorporan referencias internacionales y se actualizan catálogo, tamaños, guardado y continuidad en la documentación. |

El nuevo guardado contiene solo origen, identificador, nivel, párrafo, palabra y momento del guardado. No contiene título, cuento, idea original ni respuesta. Las marcas caducadas se eliminan al consultarlas; sin una nueva visita el navegador puede conservarlas físicamente. «Borrar mi progreso» elimina puntos y marcas; borrar libros no elimina las marcas del catálogo. Una restricción de almacenamiento no impide leer.

## Evaluación del conjunto de la aplicación

| Área | Valoración y acción |
| --- | --- |
| Identidad y orientación | Se conservan colores, Nunito Sans, ilustraciones y tres destinos. No hay fundamento para aumentar controles o imponer otra estética por considerarla universalmente infantil. |
| Lectura | Se conservan una escena por página, tamaños de 18, 22 y 26 px, voz opcional, selección para pedir ayuda y navegación con botones, teclado y gesto. Se mantiene la corrección responsive de producción. |
| Aprendizaje | El texto de evidencia y las ayudas son una buena base. La actividad oral complementa las preguntas. Faltan revisión docente de los textos y comprobaciones de aprendizaje fuera de la app. |
| Motivación | Se conserva XP y los desbloqueos como función existente. Conviene probar si los candados limitan innecesariamente la elección; cambiar ese sistema requiere observar su uso con niños. XP no se presenta como nota de comprensión. |
| Creación con IA | Hay validación de entrada, revisión de seguridad y coherencia, citas contrastadas y alternativas visuales. La revisión automática no garantiza idoneidad pedagógica ni calidad de los píxeles generados. |
| Privacidad | No se añaden cuentas, nombres, micrófono ni analítica. Se explican los datos locales existentes y nuevos. Las llamadas de IA y voz siguen dependiendo de proveedores externos y sus condiciones. |
| Accesibilidad | Se amplía la comprobación a contenido desplegado, reflexión y confirmación de borrado. Las preferencias son utilizables con almacenamiento bloqueado. Quedan pendientes lector de pantalla y dispositivos físicos. |
| Backend | Las rutas revisadas validan esquema, tipo y longitud de entrada; comprueban origen, autorizan textos generados y usan límites y plazos. Los límites son por instancia y no constituyen protección distribuida. No se realizó un pentest intrusivo. |
| Operación | Se usa compilación de producción y un navegador aislado coherente con CI. La disponibilidad de un proveedor o de una clave no se deduce del resultado de las pruebas simuladas. |

## Rendimiento y dependencias

En la medición base aislada del inicio móvil, Lighthouse obtuvo **64 en rendimiento, 100 en accesibilidad automática y 100 en buenas prácticas**; LCP 6,3 s, TBT 270 ms, CLS 0,142 y transferencia aproximada de 1.765 KiB. Son mediciones de laboratorio de una visita, no resultados de usuarios reales ni un certificado de accesibilidad. Las imágenes de los atlas dominan la transferencia; conviene optimizar las portadas y revisar CSS histórico en una siguiente intervención medida.

En la vista previa, otra medición aislada obtuvo **52 en rendimiento, 100 en accesibilidad automática y 100 en buenas prácticas**; LCP 6,9 s, TBT 660 ms, CLS 0,142 y unos 1.745 KiB. No se demuestra una mejora de velocidad con estas mediciones: la transferencia bajó ligeramente, pero los tiempos fueron peores. Son dos visitas de laboratorio, insuficientes para aislar una causa o estimar la experiencia real. El rendimiento móvil permanece como deuda explícita de esta entrega.

Se descartaron dos mediciones iniciales de rendimiento porque el Chrome del equipo añadía solicitudes a AdBlock360. El código del producto no referencia ese dominio; la carga inicial en el navegador de Playwright aislado solo observó el dominio de LeeContigo y no realizó POST. No se modificó la configuración personal del navegador. La prueba que comprueba ausencia de llamadas a IA observa específicamente las rutas de la aplicación.

`npm audit --omit=dev` no detectó vulnerabilidades conocidas de producción. La auditoría completa detectó 15 paquetes de desarrollo afectados por **un mismo aviso moderado de minimatch**, no 15 avisos independientes. La solución publicada es 11.0.1, pero el arreglo automático del árbol propone degradar ESLint y la configuración de Next a versiones incompatibles. Se deja como pendiente una actualización compatible de esa cadena. No se aplican degradaciones forzadas ni se presenta la auditoría completa como limpia. [Aviso primario GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).

## Verificación

| Comprobación | Estado de esta entrega |
| --- | --- |
| Regresiones nuevas contra producción antes de modificar | 3 fallidas, confirmando pérdida de página y reinicio de movimiento |
| Unitarias tras los cambios | 117 aprobadas, 0 fallidas |
| Lint y tipos | Aprobados |
| Compilación de producción | Aprobada |
| Recorridos completos Chromium, copia local | 249 aprobados, 0 fallidos, 1 omitido por duplicar en móvil el recorrido completo del catálogo |
| GitHub Actions de la implementación | Aprobado: lint, tipos, 117 unitarias, compilación y 249 recorridos Chromium; 1 omitido. [Ejecución](https://github.com/Alvaro-mendoza-12/Lee-Contigo-IA/actions/runs/41387224334) |
| WebKit: responsive, mejoras y creador | 37 aprobados, 1 fallido al recuperar la página tras recargar y 1 omitido porque la inyección del gesto usa CDP de Chromium. No se considera aprobada la suite completa |
| Repetición dirigida de la recarga WebKit | El mismo caso, sin modificar: 5 aprobados de 5. Además, cinco diagnósticos con lectura del almacenamiento conservaron la marca. La intermitencia inicial sigue pendiente de confirmar en Safari físico |
| Vista previa de Vercel | Ready; los 9 recorridos nuevos aprobaron en Chromium móvil contra el enlace público |
| Inspección visual de la vista previa | A 320 px: libro con texto junto a la imagen, tres destinos con «Seguir leyendo», resumen de privacidad y detalle adulto desplegado sin desbordamiento horizontal. Capturas revisadas visualmente |
| Creación real en la vista previa | HTTP 200, seis párrafos en 16,5 s; esquema válido y sin incidencias en el validador de calidad del proyecto. No valida ilustraciones, narración ni eficacia educativa |

En la primera pasada móvil, 24 recorridos aprobaron y dos fallaron. Se corrigió el nombre accesible de las opciones y se separaron las llamadas de la app del tráfico añadido por el navegador del equipo. La siguiente pasada aprobó ocho casos nuevos y detectó que axe se ejecutaba durante la salida de las estrellas de XP: se espera ahora su retirada antes de auditar el estado final, conservando todas las reglas de contraste.

La primera suite completa aprobó 240 recorridos y omitió uno; fallaron un caso de catálogo que reunía 114 combinaciones bajo un único plazo y dos ejecuciones del gesto nativo. Se separó el catálogo por ancho conservando sus verificaciones. Los gestos ahora avanzan por cuadros y esperan el fin del desplazamiento; se comprueba el retroceso sin asumir la misma distancia de inercia para dos deslizamientos. La revalidación dirigida aprobó los cuatro casos de catálogo y navegación.

La primera ampliación de WebKit aprobó 27 casos, falló diez del creador y omitió el gesto exclusivo de Chromium. La pérdida de entrada temprana se corrigió; la repetición dirigida aprobó la carga deliberadamente lenta y la política de ilustración. El recorrido que lee y practica dos veces alcanzó su plazo total de 30 segundos, por lo que dispone de 60 segundos, manteniendo las aserciones individuales de 10 segundos.

Una pasada posterior simultánea con Chromium se interrumpió y no se cuenta como aprobada. La pasada final de WebKit se ejecutó sola y obtuvo los resultados indicados en la tabla. No se aumentó el plazo ni se retiró la aserción del caso intermitente de recarga para ocultarlo. La marca se conservó en los diagnósticos, pero no se identificó la causa de la diferencia con la primera ejecución; por ello no se atribuye el fallo al navegador o a la aplicación con certeza.

La creación real utilizó una idea ficticia sobre una tortuga y una ardilla que reparan un puente. Se leyó el resultado y se validó su estructura con el esquema del proyecto; no se enviaron datos de niños. Se solicitó únicamente el texto del cuento, sin generar un juego adicional de imágenes o voz. Las pruebas del creador que sí simulan esos servicios permanecen identificadas como tales.

Los registros y capturas se guardan en `output/playwright/` de la copia aislada, ignorados por Git. El informe de publicación con el commit, despliegue y resultados del enlace público se conserva en `output/playwright/mejoras-publication.json`.

Comandos reproducibles:

```powershell
npm ci
npx playwright install chromium webkit
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e:webkit
```

Para comprobar un despliegue concreto, definir `TEST_BASE_URL` con su URL antes de ejecutar Playwright. Las pruebas que simulan IA, imágenes y voz verifican comportamiento y manejo de fallos; no validan la calidad o disponibilidad permanente de esos servicios.

## Próximas mejoras, por prioridad

1. **Validación con lectores reales y docentes.** Incluir niños de 6–7 y 8–10 años, distintos niveles y necesidades, con acompañamiento y el protocolo aplicable. Observar comprensión de etiquetas, elección, errores y autonomía; evaluar después un texto nuevo y una explicación oral, sin usar XP como medida de aprendizaje.
2. **Rendimiento en conexión limitada.** Optimizar la entrega de portadas, revisar CSS acumulado y medir de nuevo inicio y lectura. Evaluar una lectura sin conexión para el catálogo; hoy no se promete funcionamiento offline.
3. **Preparación para más tráfico.** Límites compartidos entre instancias, observación de disponibilidad sin registrar contenido infantil y un mecanismo real de revisión de contenido. El descarte actual de una pista es solo local.
4. **Actualización de herramientas de desarrollo.** Resolver el aviso de minimatch mediante versiones compatibles, manteniendo el lint de Next y la comprobación de tipos.
5. **Revisión editorial y cultural.** Revisar vocabulario, representaciones, narración y dificultad de ambos niveles con educadores de las comunidades destinatarias. No traducir automáticamente a múltiples idiomas sin esa revisión.
6. **Dispositivos y accesibilidad manual.** Confirmar primero la recuperación tras recarga en Safari, por la incidencia intermitente de WebKit. Probar iPhone y Android físicos, rotación, teclado móvil, lectores de pantalla y ampliación. La emulación no certifica esas combinaciones.

## Referencias internacionales consultadas

Las referencias siguientes no avalan ni certifican LeeContigo. Las descripciones son síntesis breves y las decisiones de producto son inferencias de esta auditoría.

| Referencia y ámbito | Tipo y utilidad; límite |
| --- | --- |
| [UNICEF: Guidance on AI and Children 3.0, 2025](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children) | Orientación global de derechos: seguridad, privacidad, transparencia e inclusión. No es una evaluación de esta app. |
| [UNICEF: RITEC, 2024](https://www.unicef.org/innocenti/reports/responsible-innovation-technology-children) y [toolbox](https://www.unicef.org/childrightsandbusiness/workstreams/responsible-technology/online-gaming/ritec-design-toolbox) | Investigación multinacional sobre bienestar en juego digital y herramientas de diseño. Se usa para autonomía y control; no como prueba de comprensión lectora. |
| [UNESCO: GEM, tecnología educativa](https://www.unesco.org/gem-report/en/articles/what-are-appropriate-uses-technology-education) | Síntesis global: pertinencia, equidad, sostenibilidad y apoyo docente. Requiere considerar el contexto local. |
| [APA: EdTech y aprendizaje, 2026](https://www.apa.org/news/press/releases/2026/09/education-technology-engagement), Estados Unidos | Informe de expertos presentado por la asociación de psicología: distingue actividad, desempeño y aprendizaje. No ofrece una receta universal de botones o colores. |
| [AAP: Digital Ecosystems, 2026](https://publications.aap.org/pediatrics/article/157/2/e2025075320/206129/Digital-Ecosystems-Children-and-Adolescents), Estados Unidos | Recomendación profesional sobre diseño y bienestar. Abarca edades y contextos más amplios que este lector. |
| [Harvard: funciones ejecutivas, 2014](https://developingchild.harvard.edu/resources/handouts-tools/activities-guide-enhancing-and-practicing-executive-function-skills/), Estados Unidos | Actividades por grupos de edad y acompañamiento. No demuestra que una app de cuentos entrene funciones ejecutivas. |
| [IES: comprensión K–3](https://ies.ed.gov/ncee/wwc/PracticeGuide/14), Estados Unidos | Guía que gradúa la fuerza de evidencia de sus recomendaciones; estrategias de lectura y discusión del texto. |
| [EEF: 5–7 años](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/literacy-ks-1/) y [7–11 años](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/literacy-ks2), Reino Unido | Guías de evidencia sobre lenguaje y alfabetización; la adaptación por habilidad no equivale a diagnosticar al niño. |
| [PNL: Leitura em Família](https://www.pnl2027.gov.pt/np4/leituraemfamilia.html), Portugal | Programa oficial: acompañamiento, diversidad y elección de libros. Descripción de programa, no efecto demostrado de LeeContigo. |
| [Salud Pública: medios digitales, 2024](https://www.folkhalsomyndigheten.se/contentassets/ab9cc71603f84f048dadf4c2851032f6/recommendations-childrens-adolescents-digital-media-use.pdf), Suecia | Recomendaciones para familias; su alcance distingue ocio de lectura electrónica y uso escolar. |
| [Jyväskylä: FLUENT](https://research.jyu.fi/fluent/), Finlandia y socios europeos | Proyecto sobre práctica inicial de lectura y apoyo a dificultades en varios idiomas. No se generalizan sus resultados a este producto; una publicación posterior localizada no pudo recuperarse completa. |
| [NDL: quinto plan de lectura 2023–2027](https://www.kodomo.go.jp/en/info/book/2023-E003), Japón | Política de acceso, materiales accesibles y participación infantil; no ensayo psicológico. |
| [NIPUN Bharat](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1807639&lang=2&reg=48), India | Misión oficial de lectura con comprensión en los primeros grados. Contexto curricular y lingüístico propio. |
| [Ministerio de Educación: acción de lectura, 2025](https://www.moe.gov.cn/srcsite/A06/s3321/202506/t20250605_1193064.html), China | Política que incluye continuidad y herramientas digitales. No se importan sus metas de tiempo ni su propuesta de seguimiento individual. |
| [UNICEF: educación inclusiva](https://www.unicef.org/iran/en/education-refugees), Irán | Contexto de acceso para niños refugiados y con discapacidad. No es una investigación de interfaz o de eficacia lectora. |
| [HSE: comportamiento en pruebas lectoras, 2023](https://publications.hse.ru/articles/831427658), Rusia | Ficha institucional localizada; el enlace al texto completo no fue accesible. No se atribuyen resultados no leídos. |
| [UNESCO: perfil educativo de Corea del Norte](https://gem-report-education-profiles.unesco.org/eastern-and-south-eastern-asia/democratic-peoples-republic-of-korea/_non-state-actors-in-education.html) | Ficha archivada de política educativa. No se presenta como información actual exhaustiva ni evidencia psicológica aplicable. |
| [eSafety: Safety by Design](https://www.esafety.gov.au/industry/safety-by-design), Australia | Orientación de responsabilidad, autonomía y transparencia en productos digitales; no certifica seguridad del producto. |
| [DBE: Early Grade Reading Study](https://www.education.gov.za/Programmes/EarlyGradeReadingStudy.aspx), Sudáfrica | Evaluaciones de intervenciones y apoyo docente; sus resultados no se extrapolan al uso autónomo de una app. |
| [MINEDUC: leer y comprender en 1.º básico](https://www.curriculumnacional.cl/614/w3-article-21130.html), Chile | Referencia curricular sobre narraciones y participación oral; no es un ensayo de esta función de reflexión. |
| [UMC: prácticas docentes y lectura en 4.º](https://umc.minedu.gob.pe/perfiles-de-practicas-docentes-en-la-ensenanza-de-la-lectura-y-su-relacion-con-la-competencia-lectora-de-los-estudiantes-de-4-grado-de-primaria/), Perú | Estudio de prácticas y competencia lectora; las asociaciones no demuestran causalidad ni eficacia del prototipo. |
| [Antiqua et nova, 2025, educación §§77–84](https://press.vatican.va/content/salastampa/en/bollettino/pubblico/2025/01/28/250128b.pdf), Vaticano | Posición ética sobre relaciones humanas y pensamiento propio. No es evidencia clínica ni motivo para incorporar contenido religioso. |
| [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/) y [COGA](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/) | Estándares y orientación de accesibilidad; requieren evaluación manual además de verificaciones automáticas. |

