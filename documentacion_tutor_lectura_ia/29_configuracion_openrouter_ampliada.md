# Configuración ampliada de OpenRouter

22 de octubre de 2026. Rama: `codex/requisitos-mvp`.

## Configuración

Se añadieron 51 credenciales proporcionadas por el titular, conservando las nueve anteriores: **60 claves únicas** disponibles en servidor.

Las nuevas se almacenan como un arreglo JSON en `OPENROUTER_API_KEYS`, de tipo **Secret** en Vercel para Production, Preview y Development. La configuración local permanece en `.env.local`, excluida de Git. Los valores no se incluyen en este informe, en el código ni en `.env.example`.

## Carga de credenciales

El cargador anterior solo consultaba nueve variables. Ahora `getOpenRouterKeys()` admite:

1. `OPENROUTER_API_KEY`.
2. Variables numeradas a partir de `OPENROUTER_API_KEY_2`, en orden numérico y sin el límite anterior de nueve.
3. El arreglo JSON opcional `OPENROUTER_API_KEYS`.

Se eliminan espacios, valores vacíos y duplicados. Solo se aceptan nombres de servidor; no se consultan variables con el prefijo `NEXT_PUBLIC_`. Un grupo JSON mal formado no desactiva las credenciales numeradas existentes.

El orden previo se conserva. Se mantienen los modelos gratuitos, el precio máximo cero, los esquemas de respuesta, la política de tratamiento de datos y los tiempos de espera. La siguiente clave solo se prueba ante autenticación inválida o un límite identificado como específico de esa clave. Un límite general 429 o el saldo agotado de una cuenta continúa hacia el mecanismo de respaldo existente.

Varias claves de una misma cuenta comparten los límites aplicables a esa cuenta; agregar credenciales no garantiza más cuota ni disponibilidad ilimitada.

## Verificación

- Las 51 nuevas credenciales devolvieron HTTP 200 en `GET /api/v1/key`.
- Una generación real con una credencial nueva produjo un objeto válido según el esquema en unos 5,5 segundos, usando un texto ficticio sin datos personales.
- El cargador local confirmó 60 claves únicas.
- Vercel confirmó la variable como Secret en los tres entornos.
- Se añadieron pruebas para carga superior a nueve, orden numérico, grupo JSON, espacios, duplicados, nombres públicos excluidos y recuperación ante JSON incorrecto.
- Se conservan las pruebas de cambio de clave ante 401 y de detención ante límites generales 429.
- Compilación, TypeScript, 32 pruebas unitarias y 54 pruebas de navegador verificadas para esta configuración.
- Se revisó que los valores no aparezcan en archivos preparados para Git ni en los recursos estáticos enviados al navegador.

La autenticación correcta de las 51 claves no equivale a 51 pruebas de generación. Se realizó una prueba de generación representativa y no se consumieron solicitudes de modelos para cada credencial.

## Archivos

- `lib/openrouter.ts`: carga ampliada, sin valores secretos.
- `tests/openrouter.test.ts`: pruebas con credenciales ficticias.
- `.env.example`: nombre de la variable y arreglo vacío.
- `README.md`: documentación de configuración.

## Referencias

- [OpenRouter: información de la clave actual](https://openrouter.ai/docs/api/api-reference/api-keys/get-current-api-key).
- [OpenRouter: límites de crédito y solicitudes](https://openrouter.ai/docs/api/reference/limits).
- [Vercel: variables de entorno](https://vercel.com/docs/environment-variables).
