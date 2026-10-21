# Seguridad clínica

DETOXYA es un producto de **apoyo educativo**, no un dispositivo médico y no un protocolo clínico. Este documento describe las salvaguardas implementadas en código y las que **no** se implementarán nunca.

## Principios no negociables

1. **Nunca guiamos la retirada** de alcohol, benzodiacepinas u opioides. Esas retiradas pueden causar convulsiones, delirium y muerte. La app no ofrece calendarios, dosis ni «rebajes».
2. **Cero dosis.** No se recomienda cuánto consumir, cuánto reducir ni con qué fármaco.
3. **Nunca por LLM.** La detección de crisis es un motor determinista (`src/engine/crisis.ts`) con patrones en español e inglés. Un mensaje con ideación suicida o autolesiva intercepta la conversación **antes** del modelo de lenguaje y abre el flujo de recursos humanos (`src/components/CrisisOverlay.tsx`).
4. **Derivación humana.** El recurso activo siempre es una persona: línea de crisis del país, 112/911, servicio de urgencias, profesional de salud.

## Pilares implementados

### Onboarding con screening

- **AUDIT-C** (consumo de alcohol), **CAGE-AID** (dependencia), **PHQ-9** (depresión con ítem 9 de suicidio) y **flags de dependencia** (uso diario de alcohol/benzos, convulsiones previas al retirar, polisustancia, embarazo, ≥65 años, apoyo nulo, enfermedad grave).
- Evaluación de seguridad (`src/engine/safety.ts`): nivel de riesgo + puertas (`medical-detox`, `opioid-overdose`, `phq9-crisis`).

### Puertas médicas

- Objetivos con sustancias de riesgo (definidas en `gateSubstances`) → **puerta `medical-detox`**: el usuario debe reconocer el aviso antes de usar la app. El aviso es explícito: la retirada puede ser peligrosa y requiere evaluación médica.
- Objetivos con opioides → **puerta `opioid-overdose`**: información de reducción de riesgos (no dosis): tolerancia cae tras la abstinencia, riesgo de sobredosis al reanudar, naloxona.
- PHQ-9 con ideación → **puerta `phq9-crisis`** y flujo de crisis inmediato.

### Crisis

- `detectCrisis(texto)` distingue ideación **activa** («voy a matarme ahora») de **pasiva** («no quiero vivir») en ambos idiomas, con normalización de diacríticos.
- Se invoca en: chat del coach, guardrails del LLM (entrada **y** salida), guardado de entradas del diario.
- `CrisisOverlay` es z-50 global y se abre desde cualquier punto de la app.

### Coach (IA)

- `src/llm/coach.ts` decide en orden determinista:
  1. Crisis detectada → respuesta de crisis, **nunca** el LLM.
  2. Petición de dosis/taper («cuántas pastillas», «taper schedule»…) → rechazo educativo + derivación (SAMHSA, sanitidad nacional).
  3. Ollama habilitado → intento LLM con timeout; cualquier fallo cae al motor de reglas.
  4. Sin IA → motor de reglas.
- El system prompt prohíbe diagnóstico, dosis y esquemas de rebaje; limita a ~120 palabras y una acción pequeña.

### Contenido

- Las timelines de abstinencia incluyen advertencias y enfatizan que son **generalidades educativas**. No presentan la abstinencia como un procedimiento casero.
- Cualquier contenido termina con el recordatorio de que no sustituye atención médica.

## Lo que DETOXYA no hará (nunca)

- Guías de tapering, dosis, sustitución o desintoxicación casera.
- Diagnósticos o pronósticos.
- Promesas de eficacia clínica.
- Sustituir terapia, medicación asistida (buprenorfina, metadona, naltrexona) o seguimiento médico.
- Telemetría de crisis a terceros (no hay backend).

## Cuando el usuario está en crisis

El flujo prioriza **contacto humano inmediato**: emergencias del país, línea de crisis (España 024, EE. UU. 988, etc. en `src/features/help/resources.ts`), y el contacto de confianza que el usuario haya registrado. La app no intenta «atender» la crisis.

## Limitaciones conocidas

- El screening es cribado, no diagnóstico.
- El bloqueo con PIN es **casual** (no cifra datos).
- Los recursos de crisis se revisan a mano; los países sin entrada propia muestran el mapa global de findahelpline.com.
- El coach local no supervisa: no alerta a terceros (por diseño: no hay servidor).
