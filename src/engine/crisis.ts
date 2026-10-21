export type CrisisLevel = 'none' | 'passive' | 'active' | 'urgent-medical';

export interface CrisisMatch {
  level: CrisisLevel;
  keyword: string | null;
}

/** Intoxicación aguda o mezcla peligrosa: requiere urgencias, no guion de ideación. */
const URGENT_MEDICAL_PATTERNS: readonly string[] = [
  'me (he |he )?pas(é|ado) de (dosis|pastillas|medicamento|la dosis)',
  'he tomado (todas|toda) (la|las|el) pastilla(s)?',
  'sobredosis',
  'no puedo respirar',
  'mi (pareja|amigo|hermano|compañero) (está|esta) inconsciente',
  'mezcl[eé] (clonazepam|alcohol|benzodiazepina|valium|diaze?epam)',
  'mezcl[eé] (vino|cerveza|alcohol) con (pastillas|benzodiacepina|clonazepam|valium)',
  'i (took|have taken) (all|an) (the )?(pills|tablets)',
  'i overdosed',
  "i can'?t breathe",
  'my (friend|partner|brother|sister) is unconscious',
  'mixed (alcohol|benzos|xanax|clonazepam|valium)',
  'took too many (pills|tablets|doses)',
];

const ACTIVE_PATTERNS: readonly string[] = [
  'voy a matar(me)?\\b',
  'me (voy a|quiero) (suicidar|morir|matarme)',
  'ahora mismo me (voy a|quiero)',
  '(acabar|terminar) con (mi vida|todo) (ahora|hoy|ya)',
  'quiero morir( ya| ahora)?',
  'me quiero morir',
  'voy a quitarme de en medio',
  'voy a desaparecer',
  'voy a saltar(me)?',
  'me voy a arrojar',
  'voy a ahogarme',
  'voy a tomarme (todas|toda) (la|las|el) pastilla(s)?',
  'voy a cortarme',
  'voy a sobredosis',
  'voy a pasarme de dosis',
  'kill myself( now)?',
  "i'?m (going to|gonna) kill myself",
  'end my life (now|tonight|today|right now)',
  'going to end it all( now)?',
  'i want to die( now| tonight)?',
  "i'?m gonna die",
  'wanna die( now)?',
  'going to jump',
  'going to hang myself',
  'overdose myself now',
];

const PASSIVE_PATTERNS: readonly string[] = [
  'suicid',
  'suicidal',
  'matarme',
  'morirme',
  'no quiero vivir',
  'no vale la pena (vivir|seguir)',
  'mejor (muerto|muerta)',
  'que me (muriera|muriese)',
  'odio vivir',
  'odio mi vida',
  'no puedo mas con (esto|vida)',
  'quiero desaparecer',
  'quisiera no despertar',
  'quitarme de en medio',
  'no tiene sentido (vivir|seguir)',
  'cansado de vivir',
  'cansada de vivir',
  "don'?t want to (live|be alive)",
  'better off dead',
  'no reason to live',
  'hate my life',
  'tired of living',
  'wish i were dead',
  'want to disappear',
  'autolesion',
  'self[- ]?harm',
  'dañ(ar|o|arme)\\b',
  'cortarme',
  'overdose myself',
  'tomar(me)? toda(s)? (la|las|el) pastilla(s)?',
  'me corto',
  'me hago daño',
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function compileAll(sources: readonly string[]): RegExp[] {
  return sources.map((src) => new RegExp(normalize(src), 'u'));
}

const ACTIVE = compileAll(ACTIVE_PATTERNS);
const PASSIVE = compileAll(PASSIVE_PATTERNS);
const URGENT = compileAll(URGENT_MEDICAL_PATTERNS);

/**
 * Detector determinista de lenguaje de crisis. No usa IA: siempre disponible,
 * siempre el mismo resultado. Si detecta riesgo, la app muestra recursos de
 * crisis inmediatos y no delega la respuesta al LLM.
 * Orden: urgencia médica > activa > pasiva.
 */
export function detectCrisis(text: string): CrisisMatch {
  if (!text || text.trim().length === 0) return { level: 'none', keyword: null };
  const n = normalize(text);
  for (let i = 0; i < URGENT.length; i++) {
    if (URGENT[i].test(n)) return { level: 'urgent-medical', keyword: URGENT_MEDICAL_PATTERNS[i] };
  }
  for (let i = 0; i < ACTIVE.length; i++) {
    if (ACTIVE[i].test(n)) return { level: 'active', keyword: ACTIVE_PATTERNS[i] };
  }
  for (let i = 0; i < PASSIVE.length; i++) {
    if (PASSIVE[i].test(n)) return { level: 'passive', keyword: PASSIVE_PATTERNS[i] };
  }
  return { level: 'none', keyword: null };
}
