# DETOXYA

> Compañero **open-source** y **local-first** de desintoxicación y recuperación.
> PWA en español e inglés. **No es atención médica.**

[English summary](#english-summary) · [Seguridad](docs/SAFETY.md) · [Evidencia](docs/EVIDENCE.md) · [Privacidad](docs/PRIVACY.md) · [Contribuir](CONTRIBUTING.md)

## Qué es

DETOXYA te acompaña en la recuperación de sustancias y hábitos: reloj de sobriedad, toolkit para antojos, check-in HALT, curso de terapia cognitivo-conductual (TCC), prácticas de mindfulness (MBRP), diario guiado, rutas de recuperación (SMART, HAMS, moderación, Dharma, 12 pasos, LifeRing) y un coach con IA local.

Todo funciona **sin cuenta, sin servidor de DETOXYA y sin conexión**: los datos viven en IndexedDB de tu navegador y la app se instala como PWA.

## Principios

1. **Seguridad clínica real.** Nunca guiamos la retirada de alcohol, benzodiacepinas u opioides. Hay puertas de seguridad con aviso explícito, screening (AUDIT-C, CAGE-AID, PHQ-9), detección determinista de crisis y líneas de crisis por país. Cero dosis, cero esquemas de rebaje. Ver [docs/SAFETY.md](docs/SAFETY.md).
2. **Local-first.** Sin backend propio. Exporta/importa JSON. Bloqueo casual con PIN.
3. **IA opcional y con guarda.** Ollama como coach opcional; si no está disponible o falla, un motor de reglas determinista responde igual. Las crisis **nunca** pasan por el LLM: un motor de reglas las intercepta y muestra recursos humanos.
4. **Transparente.** Contenido educativo con fuentes citadas ([docs/EVIDENCE.md](docs/EVIDENCE.md)). Licencia AGPL-3.0.

## Funciones

| Área     | Qué hay                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Hoy      | Reloj de sobriedad, hitos (24 h, 72 h, 7 días…), ahorro estimado, pledge editable, revisión nocturna, botón «he consumido» |
| Antojos  | 4 Ds, surf del antojo (timer + fases), respiración 4-4-4-4, inmersión en frío, log con intensidad antes/después            |
| HALT     | Check-in de hambre, ira, soledad y cansancio con acciones concretas y patrón de 7 días                                     |
| Programa | Qué esperar por sustancia, PAWS (ventanas y olas), 12 lecciones de TCC, 8 prácticas MBRP                                   |
| Diario   | Pregunta del día, escritura libre, registro de pensamiento (5 campos), entradas                                            |
| Rutas    | SMART Recovery, HAMS, Moderation Management, Recovery Dharma, 12 pasos, LifeRing                                           |
| Coach    | Chat con Ollama (local) o motor de reglas; guardrails de crisis y de petición de dosis                                     |
| Progreso | Heatmap de 30 días, intensidad antes/después (gráfico), medias HALT, triggers frecuentes                                   |
| Ajustes  | Idioma (es/en), tema, IA local, exportar/importar, PIN                                                                     |

## Stack

- **Vite 8 + React 19 + TypeScript 5.9** · **Tailwind CSS 4** · **VitePWA** (service worker + manifest)
- **Dexie 4** (IndexedDB) · **Zustand** (estado de crisis) · **react-i18next** · **Recharts**
- **Vitest 5 + Testing Library** · **Playwright** (e2e) · **ESLint 10 + Prettier**

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm test           # vitest run
npm run build      # build de producción + PWA
npm run e2e        # playwright test (requiere npx playwright install)
```

### Coach local con Ollama (opcional)

1. Instala [Ollama](https://ollama.com) y arráncalo: `ollama serve`.
2. Descarga un modelo: `ollama pull llama3.2` (o el que prefieras).
3. En la app: **Ajustes → Coach con IA local** → activa, comprueba la URL (`http://localhost:11434`) y pulsa «Probar conexión».

Sin Ollama, el coach usa el motor de reglas: la app sigue siendo 100 % funcional.

### Arquitectura

```
src/
  engine/     screening, seguridad, crisis (determinista, con tests)
  content/    contenido educativo localizado + fuentes (TS, no JSON)
  features/   páginas por área (today, cravings, halt, program, journal, coach…)
  llm/        guardrails, RulesCoach, cliente Ollama, orquestador
  data/       esquema Dexie, tipos, export/import
  i18n/       locales es/en por namespace
  components/ UI base, CrisisOverlay, PinGate, AppShell
```

Los textos de interfaz viven en `src/i18n/locales/{es,en}/*.json`; el contenido educativo, en objetos TypeScript localizados con su array `sources`.

## Documentación

- [docs/SAFETY.md](docs/SAFETY.md) — modelo de seguridad clínica y puertas
- [docs/EVIDENCE.md](docs/EVIDENCE.md) — fuentes usadas en el contenido
- [docs/PRIVACY.md](docs/PRIVACY.md) — qué datos se guardan y cómo
- [CONTRIBUTING.md](CONTRIBUTING.md) — cómo participar

## Licencia

[AGPL-3.0-or-later](LICENSE). Los nombres y materiales de AA, NA, SMART u otras organizaciones pertenecen a sus dueños; DETOXYA enlaza, no reproduce sus textos.

---

## English summary

DETOXYA is an open-source, local-first recovery companion (PWA, Spanish + English): sobriety clock, craving toolkit, HALT check-ins, CBT lessons, MBRP practices, journal, recovery paths and an optional local-AI coach (Ollama) with a deterministic rules fallback. It never gives doses or taper plans, has medical gates, crisis detection and per-country crisis lines. All data stays in your browser. AGPL-3.0. Not medical care.
