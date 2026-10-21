import type { Language } from '../i18n';
import { SOURCES, type Source } from './sources';

function L<T>(es: T, en: T): Record<Language, T> {
  return { es, en };
}

export interface PawsContent {
  title: Record<Language, string>;
  what: Record<Language, string>;
  waves: Record<Language, string>;
  symptoms: Record<Language, string[]>;
  coping: Record<Language, string[]>;
  note: Record<Language, string>;
  sources: Source[];
}

export const PAWS: PawsContent = {
  title: L('Síndrome de abstinencia posaguda (PAWS)', 'Post-acute withdrawal syndrome (PAWS)'),
  what: L(
    'Después de la abstinencia aguda (días), muchas personas atraviesan semanas o meses de síntomas leves-moderados: sueño irregular, irritabilidad, ansiedad, niebla mental y antojos. No es una recaída: es la mente y el cuerpo recalibrando.',
    'After acute withdrawal (days), many people go through weeks or months of mild-moderate symptoms: irregular sleep, irritability, anxiety, brain fog and cravings. It is not relapse: it is mind and body recalibrating.',
  ),
  waves: L(
    'PAWS llega en «ventanas y olas»: periodos buenos seguidos de oleadas sin causa aparente. Saberlo evita el pánico y la conclusión precipitada de «no puedo más».',
    'PAWS arrives in "windows and waves": good stretches followed by swells without obvious cause. Knowing this prevents panic and the premature conclusion "I can’t keep going".',
  ),
  symptoms: L(
    [
      'Sueño alterado y pesadillas vívidas',
      'Irritabilidad y cambios de ánimo',
      'Ansiedad y ataques de pánico leves',
      'Dificultad de concentración («niebla»)',
      'Antojos episódicos, a menudo situacionales',
      'Fatiga y baja motivación',
    ],
    [
      'Altered sleep and vivid dreams',
      'Irritability and mood swings',
      'Anxiety and mild panic episodes',
      'Concentration difficulty ("fog")',
      'Episodic cravings, often situational',
      'Fatigue and low motivation',
    ],
  ),
  coping: L(
    [
      'Duerme y come a horas regulares: la regulación física estabiliza lo demás.',
      'Reduce cafeína y alcohol (sí, también el alcohol: es depresor).',
      'Muévete: caminar 20-30 min diarios mejora sueño y ánimo.',
      'Cuando llegue la ola: recuerda «es temporal», usa el surf del antojo.',
      'Lleva el registro de ánimo en el diario: ver la tendencia real baja el miedo.',
      'Aplaza decisiones grandes en las olas fuertes: hoy no hace falta decidir nada irreversible.',
    ],
    [
      'Sleep and eat at regular times: physical regulation stabilizes the rest.',
      'Reduce caffeine and alcohol (yes, alcohol too: it is a depressant).',
      'Move: 20-30 min walking daily improves sleep and mood.',
      'When the wave comes: remember "it is temporary", use urge surfing.',
      'Track mood in the journal: seeing the real trend lowers fear.',
      'Postpone big decisions in heavy waves: nothing irreversible needs deciding today.',
    ],
  ),
  note: L(
    'Si los síntomas son intensos o aparecen ideas de autolesión, busca apoyo profesional: no tienes que atravesar esto solo/a. El contenido aquí es educativo, no un diagnóstico.',
    'If symptoms are severe or self-harm thoughts appear, seek professional support: you do not have to go through this alone. This content is educational, not a diagnosis.',
  ),
  sources: [SOURCES.samhsaProtracted, SOURCES.pawsJagp],
};
