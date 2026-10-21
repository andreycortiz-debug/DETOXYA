import type { Language } from '../i18n';

export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HaltSnapshot {
  hunger: number;
  anger: number;
  loneliness: number;
  tiredness: number;
  craving: number;
}

export interface CoachContext {
  locale: Language;
  daysClean: number | null;
  goalLabel: string | null;
  targetLabels: string[];
  urgesRidden: number;
  lastHalt: HaltSnapshot | null;
  hasGatedSubstance: boolean;
  /** ISO del país del perfil, para números de crisis locales. */
  country: string | null;
}

export interface CoachReply {
  content: string;
  source: 'rules' | 'ollama' | 'crisis' | 'medical';
}

export interface CoachProvider {
  id: 'rules' | 'ollama';
  reply(messages: CoachMessage[], ctx: CoachContext): Promise<string>;
}
