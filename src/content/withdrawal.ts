import type { Language } from '../i18n';
import { type SourceKey, SOURCES } from './sources';

export interface WithdrawalEntry {
  onset: Record<Language, string>;
  peak: Record<Language, string>;
  duration: Record<Language, string>;
  dangers: Record<Language, string>;
  paws: Record<Language, string>;
  sourceKeys: SourceKey[];
}

function L<T>(es: T, en: T): Record<Language, T> {
  return { es, en };
}

export const WITHDRAWAL: Record<string, WithdrawalEntry> = {
  alcohol: {
    onset: L('6-12 horas después del último consumo', '6-12 hours after the last drink'),
    peak: L('24-72 horas', '24-72 hours'),
    duration: L('5-7 días (rara vez más de una semana)', '5-7 days (rarely over a week)'),
    dangers: L(
      'Convulsiones entre las 12-48 h; delirium tremens 48-72 h (riesgo de muerte). Necesita evaluación médica si hay uso diario.',
      'Seizures between 12-48h; delirium tremens at 48-72h (risk of death). Medical evaluation is needed with daily use.',
    ),
    paws: L(
      '6-24 meses: ansiedad, insomnio, cambios de ánimo y antojos en «ventanas y olas».',
      '6-24 months: anxiety, insomnia, mood swings and cravings in "windows and waves".',
    ),
    sourceKeys: ['clevelandAw', 'samhsaProtracted', 'niaaa'],
  },
  cannabis: {
    onset: L(
      'Dentro de la primera semana (a menudo 2-3 días)',
      'Within the first week (often 2-3 days)',
    ),
    peak: L('Días 3-6', 'Days 3-6'),
    duration: L(
      'Síntomas agudos ~1 semana; el sueño puede tardar semanas en normalizarse',
      'Acute symptoms ~1 week; sleep can take weeks to normalize',
    ),
    dangers: L(
      'No suele ser peligrosa en sí misma, pero el malestar disparado por los síntomas eleva el riesgo de recaída.',
      'Usually not dangerous by itself, but symptom distress raises relapse risk.',
    ),
    paws: L(
      'Semanas a meses: irritabilidad, sueño vívido y antojos episódicos.',
      'Weeks to months: irritability, vivid dreams and episodic cravings.',
    ),
    sourceKeys: ['cannabisWithdrawal', 'samhsaProtracted'],
  },
  nicotine: {
    onset: L('Horas tras el último consumo', 'Hours after the last use'),
    peak: L('Días 2-3', 'Days 2-3'),
    duration: L('2-4 semanas (antojos pueden durar meses)', '2-4 weeks (cravings can last months)'),
    dangers: L(
      'No suele ser peligrosa; considera apoyo profesional (NRT, vareniclina) según tu situación.',
      'Usually not dangerous; consider professional support (NRT, varenicline) for your situation.',
    ),
    paws: L(
      'Antojos y dificultad de concentración durante semanas o meses.',
      'Cravings and concentration issues for weeks or months.',
    ),
    sourceKeys: ['nicotineWithdrawal'],
  },
  cocaine: {
    onset: L('Crash en horas; síntomas 1-2 días', 'Crash within hours; symptoms at 1-2 days'),
    peak: L('Crash día 2-3', 'Crash day 2-3'),
    duration: L('Crash 3-5 días; abstinencia 1-2 semanas', 'Crash 3-5 days; withdrawal 1-2 weeks'),
    dangers: L(
      'Depresión intensa y riesgo suicida en las primeras 1-2 semanas: vigila el ánimo y pide apoyo.',
      'Severe depression and suicide risk in weeks 1-2: watch your mood and get support.',
    ),
    paws: L(
      '1-2 meses+: fatiga, ánimo bajo y «ola» de antojos episódicos.',
      '1-2 months+: fatigue, low mood and episodic craving "waves".',
    ),
    sourceKeys: ['stimulantTip', 'samhsaProtracted'],
  },
  crack: {
    onset: L('Horas tras el último consumo', 'Hours after last use'),
    peak: L('Días 2-3', 'Days 2-3'),
    duration: L('Días a 2 semanas', 'Days up to 2 weeks'),
    dangers: L(
      'Igual que la cocaína: riesgo de depresión grave y suicidio en la primera semana-10 días.',
      'Like cocaine: risk of severe depression and suicide in the first week-10 days.',
    ),
    paws: L(
      'Antojos intensos por semanas; fatiga y ánimo bajo.',
      'Intense cravings for weeks; fatigue and low mood.',
    ),
    sourceKeys: ['stimulantTip'],
  },
  methamphetamine: {
    onset: L(
      'Horas tras el último consumo; somnolencia intensa',
      'Hours after last use; intense sleepiness',
    ),
    peak: L('Primeras 72 horas', 'First 72 hours'),
    duration: L('5-14 días (prolongación semanas)', '5-14 days (protracted for weeks)'),
    dangers: L(
      'Riesgo de depresión grave, ideas suicidas y psicosis que puede persistir días-semanas.',
      'Risk of severe depression, suicidal thoughts and psychosis lasting days-weeks.',
    ),
    paws: L(
      'Antojos documentados ≥5 semanas; problemas de sueño y ánimo.',
      'Cravings documented for ≥5 weeks; sleep and mood problems.',
    ),
    sourceKeys: ['stimulantTip', 'samhsaProtracted'],
  },
  amphetamine: {
    onset: L('1-2 días tras el último consumo', '1-2 days after last use'),
    peak: L('Días 2-4', 'Days 2-4'),
    duration: L('1-2 semanas', '1-2 weeks'),
    dangers: L(
      'Ánimo bajo y antojos: no suele ser peligrosa, pero molesta mucho.',
      'Low mood and cravings: usually not dangerous, but very uncomfortable.',
    ),
    paws: L(
      'Semanas de fatiga y antojos intermitentes.',
      'Weeks of fatigue and intermittent cravings.',
    ),
    sourceKeys: ['stimulantTip'],
  },
  mdma: {
    onset: L('1-3 días («midweek blues»)', '1-3 days ("Suicide Tuesday")'),
    peak: L('Días 2-3', 'Days 2-3'),
    duration: L('3-7 días', '3-7 days'),
    dangers: L(
      'Ánimo bajo, ansiedad e insomnio; hidratación y descanso importan. Evitar volver a usar para «compensar».',
      'Low mood, anxiety and insomnia; hydration and rest matter. Avoid using again to "fix" it.',
    ),
    paws: L(
      'Poco común; algunos reportan semanas de sueño irregular.',
      'Uncommon; some report weeks of irregular sleep.',
    ),
    sourceKeys: ['samhsaProtracted'],
  },
  opioids: {
    onset: L('8-12 horas (opiáceos de acción corta)', '8-12 hours (short-acting opioids)'),
    peak: L('48-72 horas', '48-72 hours'),
    duration: L(
      '4-10 días (metadona: hasta 2-3 semanas)',
      '4-10 days (methadone: up to 2-3 weeks)',
    ),
    dangers: L(
      'Rara vez es mortal por sí sola, pero la deshidratación es un riesgo real. Tras la abstinencia, la tolerancia cae: una dosis previa puede causar sobredosis mortal. El tratamiento con opioides (MOUD) es el estándar.',
      'Rarely fatal by itself, but dehydration is a real risk. After quitting, tolerance drops: a previous dose can be lethal. Medication for opioid use (MOUD) is the standard of care.',
    ),
    paws: L(
      '3-12 meses: antojos, sueño, ánimo y motivación.',
      '3-12 months: cravings, sleep, mood and motivation.',
    ),
    sourceKeys: ['asamOpioid', 'samhsaNaloxone', 'samhsaProtracted'],
  },
  benzodiazepines: {
    onset: L('1-7 días (según semivida)', '1-7 days (depending on half-life)'),
    peak: L('Días-semanas', 'Days to weeks'),
    duration: L(
      '1-4 semanas; con rebaje supervisado, más tiempo',
      '1-4 weeks; longer with a supervised taper',
    ),
    dangers: L(
      'Convulsiones y delirium potencialmente mortales. Nunca debes dejarlas de golpe si hay dependencia: solo con esquema médico. El rebaje puede durar meses.',
      'Potentially fatal seizures and delirium. Never stop abruptly if dependent: medical plan only. Tapers can take months.',
    ),
    paws: L(
      'La más prolongada: 12-24+ meses de ansiedad, insomnio y «niebla mental».',
      'The most prolonged: 12-24+ months of anxiety, insomnia and brain fog.',
    ),
    sourceKeys: ['asamBzd', 'fdaBzdBoxed', 'samhsaProtracted'],
  },
  ketamine: {
    onset: L('1-3 días', '1-3 days'),
    peak: L('Días 2-4', 'Days 2-4'),
    duration: L('3-7 días', '3-7 days'),
    dangers: L(
      'Malestar, insomnio y antojos; riesgo urinario con uso crónico (cistitis) que requiere control médico.',
      'Discomfort, insomnia and cravings; urinary risk with chronic use (cystitis) that needs medical care.',
    ),
    paws: L('Antojos y malestar en algunas personas.', 'Cravings and dysphoria in some people.'),
    sourceKeys: ['samhsaProtracted'],
  },
  ghb: {
    onset: L('6-12 horas', '6-12 hours'),
    peak: L('24-48 horas', '24-48 hours'),
    duration: L('1-2 semanas', '1-2 weeks'),
    dangers: L(
      'Similar al alcohol: puede haber convulsiones y delirium. Busca supervisión médica.',
      'Similar to alcohol: seizures and delirium can occur. Seek medical supervision.',
    ),
    paws: L('Insomnio y ansiedad durante semanas.', 'Insomnia and anxiety for weeks.'),
    sourceKeys: ['clevelandAw', 'samhsaProtracted'],
  },
  lsd: {
    onset: L('No hay síndrome de abstinencia clásico', 'No classic withdrawal syndrome'),
    peak: L('No aplica', 'Not applicable'),
    duration: L('No aplica', 'Not applicable'),
    dangers: L(
      'El «side effects» o flashbacks son raros. El interés en dejarlo suele responder a motivos personales o de salud mental.',
      '"Side effects" or flashbacks are rare. Wanting to quit is usually about personal or mental health reasons.',
    ),
    paws: L(
      'HPPD (percepción persistente) es raro; consulta si ocurre.',
      'HPPD (persistent perception) is rare; see a doctor if it happens.',
    ),
    sourceKeys: ['samhsaProtracted'],
  },
  inhalants: {
    onset: L('Horas', 'Hours'),
    peak: L('Días 1-3', 'Days 1-3'),
    duration: L('3-7 días', '3-7 days'),
    dangers: L(
      'Daño neurológico y cardíaco posible con uso crónico: si hay convulsiones o dolor torácico, emergencias.',
      'Neurological and heart damage possible with chronic use: seizures or chest pain mean emergency care.',
    ),
    paws: L(
      'Problemas de memoria y atención durante semanas.',
      'Memory and attention problems for weeks.',
    ),
    sourceKeys: ['samhsaProtracted'],
  },
  caffeine: {
    onset: L('12-24 horas', '12-24 hours'),
    peak: L('20-51 horas', '20-51 hours'),
    duration: L('2-9 días (casi siempre 3-5)', '2-9 days (usually 3-5)'),
    dangers: L(
      'Dolor de cabeza, fatiga e irritabilidad; no suele ser peligrosa.',
      'Headache, fatigue and irritability; usually not dangerous.',
    ),
    paws: L('Poco frecuente.', 'Uncommon.'),
    sourceKeys: ['samhsaProtracted'],
  },
  gambling: {
    onset: L('Días (inquietud, irritabilidad)', 'Days (restlessness, irritability)'),
    peak: L('Primera semana', 'First week'),
    duration: L('Semanas', 'Weeks'),
    dangers: L(
      'No hay abstinencia física, pero la urgencia de «recuperar lo perdido» es el mayor riesgo: bloquea accesos financieros y cuenta con apoyo.',
      'No physical withdrawal, but the urge to "win it back" is the biggest risk: block financial access and get support.',
    ),
    paws: L(
      'Antojos situacionales (salario, eventos deportivos).',
      'Situational cravings (payday, sports events).',
    ),
    sourceKeys: ['smart'],
  },
  'social-media': {
    onset: L('Inquietud y aburrimiento el primer día', 'Restlessness and boredom on day one'),
    peak: L('Días 2-4', 'Days 2-4'),
    duration: L('1-2 semanas de hábito', '1-2 weeks of habit'),
    dangers: L(
      'Sin riesgo físico; el vacío de tiempo libre es el reto principal.',
      'No physical risk; the empty free time is the main challenge.',
    ),
    paws: L('Gatillos por notificaciones y aburrimiento.', 'Notification triggers and boredom.'),
    sourceKeys: ['smart'],
  },
  porn: {
    onset: L('Antojos e irritabilidad el primer día', 'Cravings and irritability on day one'),
    peak: L('Días 3-7', 'Days 3-7'),
    duration: L('1-4 semanas de hábito', '1-4 weeks of habit'),
    dangers: L(
      'Sin riesgo físico; planifica qué hacer con el tiempo y los dispositivos.',
      'No physical risk; plan what to do with time and devices.',
    ),
    paws: L('Gatillos asociados a estrés y soledad.', 'Triggers tied to stress and loneliness.'),
    sourceKeys: ['smart'],
  },
  gaming: {
    onset: L('Aburrimiento e inquietud', 'Boredom and restlessness'),
    peak: L('Días 2-5', 'Days 2-5'),
    duration: L('1-3 semanas de hábito', '1-3 weeks of habit'),
    dangers: L(
      'Sin riesgo físico; el reto social (amigos que juegan) pesa mucho.',
      'No physical risk; the social challenge (friends who play) weighs heavily.',
    ),
    paws: L('Antojos situacionales.', 'Situational cravings.'),
    sourceKeys: ['smart'],
  },
  sugar: {
    onset: L('Antojos e irritabilidad', 'Cravings and irritability'),
    peak: L('Días 2-4', 'Days 2-4'),
    duration: L('1-2 semanas', '1-2 weeks'),
    dangers: L(
      'Si hay atracones o trastorno de conducta alimentaria, busca apoyo profesional especializado.',
      'If you binge or have an eating disorder, seek specialized professional support.',
    ),
    paws: L('Antojos en momentos de estrés.', 'Cravings during stress.'),
    sourceKeys: ['smart'],
  },
  shopping: {
    onset: L('Impulso e insatisfacción', 'Urge and dissatisfaction'),
    peak: L('Días 2-5', 'Days 2-5'),
    duration: L('Semanas', 'Weeks'),
    dangers: L(
      'Riesgo financiero: bloquea apps de compra y tarjetas durante el proceso.',
      'Financial risk: block shopping apps and cards during the process.',
    ),
    paws: L('Gatillos en rebajas, publicidad y estrés.', 'Triggers in sales, ads and stress.'),
    sourceKeys: ['smart'],
  },
};

export function getWithdrawal(substanceId: string): WithdrawalEntry | undefined {
  return WITHDRAWAL[substanceId];
}

export function sourcesFor(entry: WithdrawalEntry) {
  return entry.sourceKeys.map((k) => SOURCES[k]);
}
