# 00. Ficha de arranque y decisiones base

**Proyecto:** LeeContigo IA  
**Versión documental:** 1.0  
**Fecha de decisión:** 21 de octubre de 2026  
**Estado:** listo para comenzar la planificación de implementación; todavía no hay código ni prototipo.

## Respuesta directa: ¿está definido todo?

Está definido el **plano suficiente para empezar**: nombre de trabajo, problema, usuario, alcance inicial, secciones web, flujo, requerimientos, tecnología sugerida, función de IA, límites de privacidad, modelo de ingresos a validar, métricas y pitch.

No sería honesto decir que está resuelto absolutamente todo. Hay datos que solo se definen con validación real: disponibilidad de la marca, proveedor/modelo de IA y sus términos vigentes, costo por uso, organización piloto, disposición a pagar, licencia del relato, aceptación de docentes y autorizaciones para una prueba con menores. No son excusas para no empezar; se dejan como decisiones de validación y no se inventan.

## Decisiones de base para iniciar

| Tema | Decisión base |
|---|---|
| Nombre del proyecto | **LeeContigo IA**. Nombre de trabajo único para los documentos y la demo. No afirmar que la marca está registrada o disponible hasta verificarlo. |
| Desafío de la hackathon | Desafío 5: tutor de lectura interactivo con IA. |
| País para la evidencia inicial | Perú, porque las bases y los desafíos seleccionados están centrados allí y existe evidencia nacional ENLA. Si el equipo realiza el piloto en otro país, localizar estadísticas, currículo, texto y revisión normativa. |
| Producto | Aplicación web responsiva, enfocada en móvil; no construir app nativa para el MVP. |
| Usuario inicial | Estudiantes de aproximadamente 8 a 10 años; primera experiencia preparada para cuarto grado de primaria. |
| Acompañante y comprador | Docente/familia como acompañante; escuela, ONG, biblioteca o fundación como comprador o financiador potencial. |
| Objetivo pedagógico | Practicar comprensión de información explícita, idea principal, inferencias y vocabulario en contexto. |
| Alcance MVP | Inicio, elección de dos niveles, biblioteca con hasta dos relatos autorizados, lectura, tres preguntas, pista con IA, fallback revisado y cierre. |
| Modo IA | Pista breve basada solo en el relato y la pregunta. Sin chat abierto, diagnóstico, calificación escolar ni consejo personal. |
| Datos | Sin cuenta de menor, nombre, correo, colegio, edad exacta, voz o texto libre en el MVP. No persistir respuestas individuales. |
| Tecnología base | Next.js App Router y TypeScript; servicio de IA desde servidor con Vercel AI SDK o equivalente. El proveedor se elige después de revisar calidad, privacidad y costo. |
| Almacenamiento | Sin base de datos persistente en la demo. Base PostgreSQL y métricas agregadas solo si el piloto lo requiere y se aprueba privacidad. |
| Modelo de ingreso | Licencia institucional o acceso patrocinado. No definir precio hasta entrevistar compradores y medir costos. |
| Validación inicial | Revisión de contenido por docente; prueba de usabilidad; medir finalización, calidad de pistas, latencia y costo por sesión. Piloto con menores solo con aprobaciones y consentimiento aplicables. |
| Estilo de sustentación | Evidencia oficial, demo funcional, límites claros, medidas de privacidad y modelo de sostenibilidad como hipótesis a validar. |

## Guion funcional acordado

1. Inicio explica el propósito y los límites de la IA.
2. Estudiante elige uno de dos niveles de práctica.
3. Escoge uno de hasta dos relatos revisados.
4. Lee en una página móvil.
5. Responde tres preguntas seleccionables.
6. Puede pedir una pista; el sistema orienta hacia el relato.
7. Si el modelo falla, aparece una pista de respaldo preparada.
8. Se muestra un cierre motivador sin ranking ni diagnóstico.
9. No se crea perfil persistente del estudiante.

## Arquitectura base acordada

- Interfaz web en Next.js/React y TypeScript.
- Servicio del servidor que conserva las llaves y consulta el modelo.
- Catálogo pequeño de relatos, objetivos, respuestas y pistas revisados.
- IA limitada a reformular una pista según texto, pregunta y nivel.
- Validación de salida y alternativa estática ante falla.
- Alojamiento elegido para la demo; comprobar términos. El plan Hobby de Vercel es para uso personal y no comercial, así que la comercialización requiere plan o proveedor autorizado.
- Sin base de datos de menores en el MVP.

## Decisiones que siguen abiertas por necesitar evidencia

### Antes de construir IA en vivo
- Seleccionar proveedor/modelo tras revisar términos de datos, costo, velocidad y desempeño en español.
- Comprobar que el servicio elegido permite el uso planeado y configurar retención apropiada.
- Elegir o escribir relatos con licencia clara y revisión de un educador.

### Antes de probar con menores
- Acordar institución, responsable adulto, protocolo pedagógico y consentimiento.
- Revisar la normativa del país de prueba y los contratos con proveedores.
- Definir qué métricas anónimas son necesarias, por cuánto tiempo se guardan y cómo se borran.

### Antes de comercializar
- Verificar marca, dominio y disponibilidad del nombre.
- Entrevistar potenciales compradores y validar disposición a pagar.
- Medir costos de modelo, hosting, contenido, soporte y privacidad.
- Elegir plan comercial compatible con las condiciones del hosting.
- Validar currículo y contenido en cada país o región.

## Reglas de la hackathon que afectan el plan

- Las bases piden URL web y pitch de 3 a 5 diapositivas para Fase 2.
- La web y el pitch no deben mostrar nombres de participantes, universidades ni países de origen; puede figurar el nombre del equipo.
- Equipo de 2 a 4 personas.
- Según el calendario de las bases, registro de equipos hasta el jueves 22 de octubre al mediodía y entrega de prototipo/pitch hasta el sábado 24 de octubre al mediodía, hora de Perú. Comprobar la plataforma por si cambia el calendario.

## Próximo orden de trabajo

1. Confirmar el equipo y repartir responsabilidades.
2. Revisar si el nombre se mantiene como nombre de trabajo.
3. Elegir o crear el relato autorizado y pedir revisión pedagógica.
4. Definir guion de una sola demo y pantallas.
5. Construir el flujo web mínimo.
6. Añadir la función de pista IA con fallback seguro.
7. Revisar móvil, accesibilidad básica, tiempos y anonimato.
8. Preparar presentación de 3 a 5 diapositivas y describir exactamente lo construido.
