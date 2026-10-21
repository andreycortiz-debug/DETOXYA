export type Goal = 'abstinence' | 'taper' | 'moderation' | 'undecided';
export type TargetKind = 'substance' | 'habit';

export interface Profile {
  id: 'current';
  locale: string;
  country: string | null;
  currency: string;
  createdAt: number;
  onboardedAt: number | null;
}

export interface QuitTarget {
  id: string;
  substanceId: string;
  label: string;
  kind: TargetKind;
  goal: Goal;
  startDate: number;
  endDate: number | null;
  unitPrice: number;
  dailyUnits: number;
  createdAt: number;
}

export type ScreeningToolId = 'audit-c' | 'cage-aid' | 'phq-9' | 'dep-flags';

export interface ScreeningToolResult {
  id: string;
  tool: ScreeningToolId;
  date: number;
  answers: Record<string, number>;
  score: number;
  positive: boolean;
}

export interface Screening {
  id: string;
  date: number;
  results: ScreeningToolResult[];
}

export interface Ack {
  id: string;
  date: number;
  version: string;
}

export type UrgeTechnique =
  'surf' | 'delay' | 'four-ds' | 'breath' | 'cold' | 'distraction' | 'other';

export interface UrgeLog {
  id: string;
  date: number;
  targetId: string | null;
  trigger: string | null;
  technique: UrgeTechnique;
  intensityBefore: number;
  intensityAfter: number;
  durationSec: number;
  note: string | null;
}

export interface HaltCheck {
  id: string;
  date: number;
  hunger: number;
  anger: number;
  loneliness: number;
  tiredness: number;
  craving: number;
  note: string | null;
}

export type JournalKind = 'free' | 'prompt' | 'thought' | 'inventory' | 'inquiry';

export interface JournalEntry {
  id: string;
  date: number;
  kind: JournalKind;
  promptId: string | null;
  text: string;
  mood: number | null;
}

export interface Pledge {
  date: string;
  reasons: string;
  photoDataUrl: string | null;
  updatedAt: number;
}

export interface EveningReview {
  date: string;
  wins: string;
  hard: string;
  cravingAvg: number | null;
  note: string | null;
  updatedAt: number;
}

export type LessonStatus = 'started' | 'done';

export interface LessonProgress {
  id: string;
  courseId: string;
  lessonId: string;
  status: LessonStatus;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  date: number;
  role: 'user' | 'assistant';
  content: string;
  source?: 'rules' | 'ollama' | 'crisis' | 'medical';
}

export interface TriggerItem {
  id: string;
  label: string;
  plan: string;
}

export type RecoveryEventKind = 'milestone' | 'reset' | 'lapse' | 'gate-ack' | 'crisis';

export interface RecoveryEvent {
  id: string;
  date: number;
  kind: RecoveryEventKind;
  targetId: string | null;
  message: string | null;
}

export interface SettingRow {
  key: string;
  value: unknown;
}
