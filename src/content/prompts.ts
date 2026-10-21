import type { Language } from '../i18n';

export const JOURNAL_PROMPTS: Record<Language, string[]> = {
  es: [
    '¿Qué sientes en el cuerpo ahora mismo y desde cuándo?',
    'Escribe sobre una persona que quieras proteger con tu recuperación.',
    '¿Qué disparador apareció hoy y cómo respondiste?',
    'Describe tu día como si se lo contaras a tu yo de dentro de un año.',
    '¿Qué pensamiento automático te visitó hoy?',
    'Lista 3 cosas pequeñas que salieron bien hoy.',
    '¿Qué necesitas hoy: comida, sueño, compañía, silencio?',
    '¿Cómo sería un día perfecto sin consumir? Pinta el detalle.',
    '¿Qué límite necesitas poner esta semana?',
    'Escribe una carta breve a la sustancia o al hábito: qué le agradeces y qué le pides.',
    '¿Qué emoción evitas normalmente con el consumo?',
    'Mira tu reloj: ¿qué harás en la próxima hora para cuidarte?',
  ],
  en: [
    'What do you feel in your body right now, and since when?',
    'Write about a person you want to protect with your recovery.',
    'Which trigger showed up today, and how did you respond?',
    'Describe your day as if telling your one-year-from-now self.',
    'Which automatic thought visited you today?',
    'List 3 small things that went well today.',
    'What do you need today: food, sleep, company, silence?',
    'What would a perfect day without use look like? Paint the detail.',
    'What boundary do you need to set this week?',
    'Write a short letter to the substance or habit: what you thank it for and what you ask of it.',
    'Which emotion do you usually avoid by using?',
    'Look at your clock: what will you do in the next hour to care for yourself?',
  ],
};

export function promptOfDay(ts: number = Date.now()): {
  index: number;
  text: Record<Language, string>;
} {
  const start = new Date(ts);
  start.setHours(0, 0, 0, 0);
  const yearStart = new Date(start.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((start.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
  const list = JOURNAL_PROMPTS.es;
  const index = dayOfYear % list.length;
  return {
    index,
    text: { es: JOURNAL_PROMPTS.es[index], en: JOURNAL_PROMPTS.en[index] },
  };
}
