# 10. Privacidad, seguridad y riesgos

## Principio central

Como el usuario directo es menor, recoger la menor cantidad posible de información. La demostración debe funcionar sin nombre, correo, teléfono, ubicación, colegio, grabación de voz ni cuenta individual.

El Reglamento peruano de la Ley 29733 establece salvaguardas para servicios digitales dirigidos a niños y adolescentes. Para servicios dirigidos a menores de 14 años, exige consentimiento de quienes ejercen patria potestad o tutela cuando se tratan datos personales. La aplicación real y el tratamiento de datos por proveedores deben revisarse con asesoría jurídica y de privacidad antes del piloto.

## Controles por etapa

### MVP de hackathon
- Sin perfiles de niños ni respuestas persistentes.
- No pedir nombre, correo, escuela, ubicación o edad exacta.
- En biblioteca y tutor, usar respuestas seleccionables; no enviar texto libre del estudiante al tutor.
- El creador de cuentos es una excepción deliberada: remite una idea breve y el nivel a un modelo generativo con revisión adulta; la imagen es opcional y requiere otra confirmación adulta antes de enviar la descripción visual generada a un generador de imágenes. Informar proveedor, precio y tratamiento antes de solicitarla.
- No se fuerza `disallowPromptTraining` en las solicitudes del creador: los proveedores seleccionados para texto e imagen no muestran una ruta compatible con ese filtro. Vercel declara que AI Gateway no usa solicitudes para entrenar; las políticas de los proveedores pueden variar y deben revisarse.
- Avisar que los filtros de correos, teléfonos, enlaces y frases personales son incompletos; no prometer detección de nombres ni de todos los datos personales.
- No grabar audio ni imágenes.
- Sin anuncios, contacto directo ni chat abierto.
- No publicar resultados individuales.

### Piloto con institución
- Aprobación institucional y consentimiento aplicable.
- Aviso de privacidad y canal de retiro.
- Códigos aleatorios de sesión, sin nombres visibles.
- Definir finalidad, datos exactos, retención, acceso, borrado y responsable.
- Revisar términos de retención y uso de datos del proveedor de IA; desactivar entrenamiento con datos de sesión cuando sea posible.
- Reportar tendencias en grupos suficientemente amplios para evitar reidentificación.
- Documentar evaluación de impacto de privacidad antes del tratamiento sistemático.

### Producto comercial
- Revisión legal para cada país.
- Contratos con escuelas, organizaciones y proveedores.
- Acceso por rol y cifrado en tránsito y reposo.
- Proceso verificable de acceso, corrección, retiro y borrado.
- Gestión de incidentes y responsable operativo.
- Revisión de licencias de textos y derechos de imagen/audio.
- Auditoría de seguridad y accesibilidad antes de crecer.

## Registro de riesgos

| Riesgo | Probabilidad / impacto | Tratamiento |
|---|---|---|
| La IA inventa pistas o contradice el relato | Media / alta | Textos revisados, validación, fallback y auditoría docente. |
| Contenido inadecuado para la edad | Baja-media / alta | Revisión humana previa, política de contenido y reporte. |
| Un niño comparte información privada | Media / alta | La biblioteca y el tutor no aceptan texto libre; el creador sí envía una idea breve a un modelo y una descripción derivada a otro. Aviso previo, revisión adulta, filtros básicos y sesión sin cuenta; no repetir datos personales. |
| Una idea libre o un cuento generado contiene datos personales o contenido inadecuado | Media / alta | Aviso previo y acompañamiento adulto, límites de longitud, filtros básicos de datos, indicaciones de seguridad, validación de salida y opción de cerrar o generar otra historia; revisar contenido por persona adulta. Los filtros automáticos son incompletos. |
| Se expone una llave de API | Baja / alta | Llamadas desde servidor, secreto fuera del navegador, rotación y límites. |
| Un proveedor externo retiene prompts | Variable / alta | Revisar contrato y retención; enviar datos mínimos. |
| El producto etiqueta o avergüenza | Media / alta | Sin rankings; lenguaje motivador y niveles modificables. |
| La IA reemplaza o desacredita al docente | Baja-media / media | Práctica complementaria; interpretación queda con docente. |
| Se exageran resultados en el pitch | Media / alta | Separar hipótesis, metas y resultados observados. |
| Conexión inestable | Media / media | Pistas de respaldo, mensaje claro y opción de volver. |
| Modelo u hosting supera presupuesto | Media / media | Limitar llamadas, longitud, costo y uso. |
| Derechos de autor no están claros | Baja-media / alta | Obra original o licencia documentada. |
| Falta de accesibilidad excluye estudiantes | Media / alta | Objetivo WCAG 2.2 AA y revisión con usuarios. |

## Normativa consultada

La Ley peruana N.° 29733 protege datos personales. El Decreto Supremo N.° 016-2024-JUS aprobó su reglamento, vigente desde el 31 de marzo de 2025. Esta documentación orienta el diseño, pero no reemplaza asesoría jurídica para operar en Perú o Colombia.
