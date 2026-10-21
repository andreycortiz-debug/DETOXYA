import { detectCrisis } from '../engine/crisis';
import { SETTING_KEYS, getSetting } from '../data/db';
import {
  crisisReply,
  isDangerousLlmOutput,
  isJailbreakAttempt,
  isMedicalRequest,
  medicalRefusal,
  truncateUserText,
} from './guardrails';
import { createOllamaCoach } from './ollama';
import { rulesCoach } from './rules';
import type { CoachContext, CoachMessage, CoachReply } from './types';

export const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'llama3.2';

export interface AiSettings {
  enabled: boolean;
  baseUrl: string;
  model: string;
}

export async function loadAiSettings(): Promise<AiSettings> {
  const [enabled, baseUrl, model] = await Promise.all([
    getSetting<boolean>(SETTING_KEYS.aiEnabled, false),
    getSetting<string>(SETTING_KEYS.aiBaseUrl, DEFAULT_OLLAMA_URL),
    getSetting<string>(SETTING_KEYS.aiModel, DEFAULT_OLLAMA_MODEL),
  ]);
  return { enabled, baseUrl, model };
}

/**
 * Orquestador con guardrails. Orden de decisión (determinista, siempre):
 * 1. Crisis en cualquier turno de la conversación → respuesta de crisis, jamás el LLM.
 * 2. Jailbreak o petición de dosis/taper en cualquier turno → rechazo, jamás el LLM.
 * 3. Ollama habilitado → intento LLM; si la SALIDA es peligrosa, se sustituye.
 * 4. Cualquier fallo → RulesCoach.
 */
export async function getCoachReply(
  userText: string,
  messages: CoachMessage[],
  ctx: CoachContext,
): Promise<CoachReply> {
  const text = truncateUserText(userText);

  // 1. Escaneo multi-turno: la crisis o la petición médica persisten aunque
  //    el usuario la haya dicho en un mensaje anterior.
  const allText = [...messages.map((m) => m.content), text].join('\n');
  const crisis = detectCrisis(allText);
  if (crisis.level !== 'none') {
    return { content: crisisReply(ctx.locale, ctx.country), source: 'crisis' };
  }

  if (isMedicalRequest(text) || isMedicalRequest(allText) || isJailbreakAttempt(text)) {
    return { content: medicalRefusal(ctx.locale), source: 'medical' };
  }

  const ai = await loadAiSettings();
  if (ai.enabled && ai.baseUrl.trim()) {
    try {
      const coach = createOllamaCoach({
        baseUrl: ai.baseUrl.trim(),
        model: ai.model.trim() || DEFAULT_OLLAMA_MODEL,
      });
      const raw = await coach.reply(messages, ctx);
      // 2. Guardrail de salida: si el modelo escapa el prompt y devuelve una
      //    dosis/pauta o lenguaje de crisis, se sustituye por el protocolo.
      const outCrisis = detectCrisis(raw);
      if (outCrisis.level !== 'none') {
        return { content: crisisReply(ctx.locale, ctx.country), source: 'crisis' };
      }
      if (isDangerousLlmOutput(raw)) {
        return { content: medicalRefusal(ctx.locale), source: 'medical' };
      }
      return { content: raw, source: 'ollama' };
    } catch {
      // Fallback silencioso al motor de reglas.
    }
  }

  return { content: await rulesCoach.reply(messages, ctx), source: 'rules' };
}

export async function testOllamaConnection(baseUrl: string, model: string): Promise<string> {
  const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: 'user', content: 'ping' }],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`ollama_http_${res.status}`);
  return 'ok';
}
