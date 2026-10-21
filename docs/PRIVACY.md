# Privacidad

DETOXYA es **local-first por diseño**. No hay base de datos de DETOXYA, ni cuentas, ni analítica, ni cookies de terceros.

## Qué se guarda y dónde

Todo vive en **IndexedDB** (base de datos `detoxya`) de tu navegador, en tu dispositivo:

| Tabla         | Contenido                                                    |
| ------------- | ------------------------------------------------------------ |
| `profile`     | idioma, país, moneda, fechas                                 |
| `quitTargets` | sustancias/hábitos, metas, precios y unidades para el ahorro |
| `screening`   | respuestas y puntuaciones de AUDIT-C, CAGE-AID, PHQ-9, flags |
| `acks`        | reconocimientos de puertas de seguridad                      |
| `urges`       | antojos: intensidad antes/después, técnica, trigger, notas   |
| `halts`       | check-ins HALT                                               |
| `journal`     | entradas del diario y registros de pensamiento               |
| `pledges`     | motivos del pledge (texto y foto opcional)                   |
| `reviews`     | revisiones nocturnas                                         |
| `progress`    | lecciones/prácticas completadas                              |
| `chats`       | mensajes del coach (se recortan a ~7 días)                   |
| `events`      | hitos, reinicios, tropiezos, crisis                          |
| `settings`    | idioma, tema, IA local, triggers, PIN                        |

Además, `localStorage` guarda la preferencia de idioma (`detoxya.locale`) y de tema (`detoxya.theme`).

## Qué NUNCA sale del dispositivo

- Tus datos de la app (no hay endpoint de DETOXYA).
- Mensajes del coach, **salvo** que actives Ollama local: en ese caso viajan por HTTP a `localhost` (u otra URL que tú configures) hacia **tu propia instancia** de Ollama.
- Screening y diario: nunca se envían a ningún servidor.

## Copias

- **Exportar** genera un JSON descargable con todas las tablas.
- **Importar** reemplaza el contenido local por el de la copia.
- Si pierdes el navegador/perfil, pierdes los datos (a menos que hayas exportado). Es el precio de no tener servidor.

## Bloqueo con PIN

El PIN es un **bloqueo casual** contra curiosos en el mismo dispositivo. **No cifra** el contenido ni protege contra alguien con acceso al perfil del navegador. No es un sustituto de cifrado a nivel de disco o del bloqueo del sistema.

## Cookies, analítica y permisos

- Sin cookies de terceros, sin trackers, sin SDKs de analítica.
- La PWA usa un service worker para funcionar offline: cachea los assets de la app, no tus datos clínicos.
- Cualquier llamada externa del usuario (por ejemplo, «Probar conexión» de Ollama) va a la URL que tú configures.

## Borrar todo

Ajustes → **Borrar todos los datos** elimina la base de datos del navegador. También puedes borrar los datos del sitio desde la configuración del navegador. Si exportaste antes, puedes restaurar en otro dispositivo importando el JSON.

## Contacto

Si encuentras una fuga de privacidad, abre un issue con etiqueta de seguridad o contacta al mantenimiento del repositorio. No subas datos reales de pacientes a issues ni a capturas.
