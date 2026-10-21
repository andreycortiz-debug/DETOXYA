import type { CoachContext, CoachMessage, CoachProvider } from './types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

interface Intent {
  id: string;
  patterns: readonly RegExp[];
  reply: (ctx: CoachContext) => string;
}

const INTENTS: readonly Intent[] = [
  {
    id: 'craving',
    patterns: [
      /antojo/,
      /craving/,
      /urge/,
      /necesito (beber|fumar|consumir)/,
      /need (a drink|to use)/,
    ],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? pick([
            `Un antojo es una ola: sube, crestas y baja (suele ceder en minutos si no lo alimentas). Abre el surf de 3 minutos y respira más largo al exhalar. ¿Lo probamos ahora?`,
            `Prueba los 4 Ds: retrasa 15 minutos, distrae con algo que ocupe manos y cabeza, respira 6 veces largo, y recuérdate: «es un antojo, no una orden». ¿Cuál de los cuatro haces primero?`,
          ])
        : pick([
            `A craving is a wave: it rises, crests and falls (it usually eases in minutes if you don't feed it). Open the 3-minute surf and lengthen the exhale. Want to try it now?`,
            `Try the 4 Ds: delay 15 minutes, distract with something that occupies hands and mind, take 6 long breaths, and remind yourself: "it's a craving, not an order." Which one first?`,
          ]),
  },
  {
    id: 'slip',
    patterns: [
      /recai/,
      /fall(e|é|é)/,
      /slip/,
      /relapse/,
      /he consumido/,
      /i (used|relapsed|slipped)/,
      /\bdropp/,
      /\bfall/,
    ],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? pick([
            `Un tropiezo no borra lo avanzado: es información. Hoy el plan es simple — avisa a una persona, revisa el disparador y reinicia sin ceremonia. Si usaste opioides tras un tiempo sin consumo, el riesgo de sobredosis es mayor: habla de naloxona. ¿Qué disparador hubo?`,
            `Lo importante es las próximas 24 horas: no aislarte, registrar el disparador y volver al plan. La recuperación se parece más a aprender a caminar que a una línea recta. ¿Con quién puedes hablar hoy?`,
          ])
        : pick([
            `A slip doesn't erase progress: it is information. Today's plan is simple — tell someone, review the trigger, reset without ceremony. If you used opioids after time off, overdose risk is higher: talk naloxone. What was the trigger?`,
            `What matters is the next 24 hours: don't isolate, log the trigger, return to the plan. Recovery looks more like learning to walk than a straight line. Who can you talk to today?`,
          ]),
  },
  {
    id: 'motivation',
    patterns: [
      /motiv/,
      /no encuentro/,
      /no sirve/,
      /para que/,
      /why bother/,
      /point of/,
      /give up/,
      /rendir/,
    ],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? `La motivación llega después de la acción, no antes. Elige una micro-acción de 2 minutos: reescribe tu porqué de hoy, o sal a caminar una vuelta. ${ctx.daysClean !== null && ctx.daysClean > 0 ? `Llevas ${ctx.daysClean} días: eso ya es prueba de que puedes.` : 'Empezar cuenta aunque sea imperfecto.'}`
        : `Motivation arrives after action, not before. Pick a 2-minute micro-action: rewrite your why, or take one lap around the block. ${ctx.daysClean !== null && ctx.daysClean > 0 ? `You have ${ctx.daysClean} days: that is already proof you can.` : 'Starting counts, even imperfectly.'}`,
  },
  {
    id: 'sad',
    patterns: [
      /triste/,
      /deprim/,
      /ansied/,
      /solo/,
      /lonely/,
      /anxio/,
      /sad/,
      /depres/,
      /no puedo mas/,
      /overwhelm/,
    ],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? `Suena pesado. Primero lo básico: bebe agua, come algo, y si puedes, 10 minutos de aire. Luego una sola llamada a alguien de confianza — no tienes que explicar todo, solo conectar. ${ctx.hasGatedSubstance ? 'Si el malestar es intenso y bebes o tomas benzos a diario, contacta a un profesional: no es debilidad, es inteligencia.' : 'Si dura más de dos semanas o empeora, merece apoyo profesional.'}`
        : `That sounds heavy. Basics first: drink water, eat something, and if you can, 10 minutes of air. Then one call to a trusted person — you don't have to explain everything, just connect. ${ctx.hasGatedSubstance ? 'If it feels intense and you use alcohol/benzos daily, contact a professional: that is intelligence, not weakness.' : 'If it lasts more than two weeks or worsens, it deserves professional support.'}`,
  },
  {
    id: 'sleep',
    patterns: [/dormir/, /sueno/, /insomn/, /sleep/, /insomnia/],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? 'El sueño es pilar: hora fija de acostarte, sin cafeína tras mediadía, y móvil fuera del cuarto si puedes. Esta noche, cierra el día con tu revisión y 3 respiraciones largas antes de dormir.'
        : 'Sleep is a pillar: fixed bedtime, no caffeine after noon, and phone out of the bedroom if you can. Tonight, close the day with your review and 3 long breaths before bed.',
  },
  {
    id: 'money',
    patterns: [/dinero/, /ahorr/, /money/, /cost/, /gasto/],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? `Mira tu reloj en la pantalla de Hoy: ahí está el ahorro estimado. Usa parte de lo ahorrado esta semana para algo placentero que no sea un consumo: comida buena, cine, un libro. Recompensar al cerebro acelera el aprendizaje.`
        : `Check your clock on the Today screen: that's the estimated savings. Use part of it this week for something pleasurable that isn't use: good food, a movie, a book. Rewarding the brain speeds learning.`,
  },
  {
    id: 'bored',
    patterns: [/aburr/, /bored/, /no se que hacer/, /nothing to do/],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? 'El vacío es señal de que el cerebro busca recompensa. Lista 3 actividades placenteras de bajo umbral (caminar, ducha, música fuerte) y haz la primera en los próximos 10 minutos. ¿Cuál eliges?'
        : 'The void means the brain is hunting reward. List 3 low-barrier pleasures (walk, shower, loud music) and do the first one in the next 10 minutes. Which one?',
  },
  {
    id: 'greeting',
    patterns: [/^(hola|buenas|hey|hello|hi|good (morning|evening))\b/],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? `Hola. Estoy aquí para lo que necesites ahora: un antojo, un tropiezo o una conversación difícil. ¿Qué trae el día?`
        : `Hi. I'm here for whatever you need right now: a craving, a slip, or a hard conversation. What's today bringing?`,
  },
  {
    id: 'thanks',
    patterns: [/gracias/, /thank/, /te agradezco/],
    reply: (ctx) =>
      ctx.locale === 'es'
        ? 'A ti por mostrarlo. Cada paso que registras cuenta. Aquí estaré.'
        : 'Thank you for showing up. Every step you log counts. I’ll be here.',
  },
];

const DEFAULT_REPLY = (ctx: CoachContext): string =>
  ctx.locale === 'es'
    ? 'Te escucho. Para orientarte mejor: ¿es un antojo ahora, un tropiezo, o algo más largo como el ánimo? También puedo ayudarte con un plan concreto para la próxima hora.'
    : 'I hear you. To orient better: is this a craving right now, a slip, or something longer like mood? I can also help with a concrete plan for the next hour.';

/**
 * Coach determinista: siempre disponible, sin red, sin claves. Es el fallback
 * garantizado cuando Ollama no está configurado o falla.
 */
export const rulesCoach: CoachProvider = {
  id: 'rules',
  async reply(messages: CoachMessage[], ctx: CoachContext): Promise<string> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return DEFAULT_REPLY(ctx);
    const n = normalize(lastUser.content);
    for (const intent of INTENTS) {
      if (intent.patterns.some((p) => p.test(n))) return intent.reply(ctx);
    }
    return DEFAULT_REPLY(ctx);
  },
};
