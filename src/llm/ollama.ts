import type { CoachContext, CoachMessage, CoachProvider } from './types';
import { systemPrompt } from './guardrails';

export interface OllamaOptions {
  baseUrl: string;
  model: string;
}

/**
 * Cliente mínimo para el endpoint compatible con OpenAI de Ollama
 * (`/v1/chat/completions`), disponible desde Ollama 0.1.x con
 * `OLLAMA_FLASH_ATTENTION` no requerido. Sin SDK: fetch y punto.
 */
export function createOllamaCoach(options: OllamaOptions): CoachProvider {
  const base = options.baseUrl.replace(/\/+$/, '');
  return {
    id: 'ollama',
    async reply(messages: CoachMessage[], ctx: CoachContext): Promise<string> {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 45_000);
      try {
        const res = await fetch(`${base}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: options.model,
            stream: false,
            options: { temperature: 0.6 },
            messages: [
              { role: 'system', content: systemPrompt(ctx) },
              ...messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });
        if (!res.ok) throw new Error(`ollama_http_${res.status}`);
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content?.trim();
        if (!content) throw new Error('ollama_empty');
        return content;
      } finally {
        window.clearTimeout(timer);
      }
    },
  };
}
