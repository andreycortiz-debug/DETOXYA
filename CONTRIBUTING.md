# Contribuir a DETOXYA

Gracias por querer ayudar. DETOXYA toca salud vulnerable: las contribuciones se revisan con especial cuidado.

## Antes de empezar

```bash
npm install
npm run typecheck && npm run lint && npm test && npm run build
```

Todo debe pasar antes de un PR. Formatea con Prettier (`npm run format`).

## Qué aceptamos

- Correcciones de bugs, accesibilidad, i18n (es/en), tests, documentación.
- Mejoras de seguridad clínica: nuevas fuentes, mejores puertas, mejor detección de crisis (¡con tests!).
- Recursos de crisis por país (verificados).
- Contenido educativo con fuente citada y tono neutral.

## Qué NO aceptamos

- Guías de dosis, tapering o desintoxicación casera.
- Diagnósticos, promesas terapéuticas o lenguaje que sustituya al profesional.
- Telemetría, cuentas, SDKs de analítica, publicidad.
- Dependencias innecesarias o que rompan el offline-first.
- Textos de AA/NA/SMART copiados (enlaza, no reproduzcas).

## Convenciones

- **UI strings** → `src/i18n/locales/{es,en}/<ns>.json`. Registro en `src/i18n/index.ts`.
- **Contenido educativo** → objetos TS localizados (`Record<Language, string>`) en `src/content/`, con `sources[]`.
- **Lógica de seguridad** → pura, en `src/engine/`, siempre con tests.
- **Nunca** responder crisis con un LLM: el motor determinista intercepta.
- Componentes pequeños, accesibles (labels, aria), Tailwind v4 (`@utility`, no `@apply` de componentes arbitrarios).

## Commits y PRs

- Commits cortos en inglés o español coherente con el historial.
- PRs con: qué, por qué, captura si aplica, tests afectados.
- El título debe reflejar el impacto clínico si lo hay (ej. `safety: ...`).

## Licencia

Al contribuir aceptas que tu trabajo se licencie bajo AGPL-3.0-or-later, igual que el proyecto (ver [LICENSE](LICENSE)).
