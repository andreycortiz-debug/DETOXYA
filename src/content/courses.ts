import type { Language } from '../i18n';
import { SOURCES, type Source } from './sources';

function L<T>(es: T, en: T): Record<Language, T> {
  return { es, en };
}

export interface CbtLesson {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  keyPoints: Record<Language, string[]>;
  exercise: Record<Language, string>;
  reflection: Record<Language, string>;
}

export const CBT_LESSONS: readonly CbtLesson[] = [
  {
    id: 'cycle',
    title: L('1. Entender el ciclo', '1. Understand the cycle'),
    summary: L(
      'Toda conducta adictiva sigue un ciclo: disparador → rutina → recompensa. Romper el ciclo en cualquier punto lo debilita.',
      'Every addictive behavior follows a cycle: trigger → routine → reward. Breaking the cycle at any point weakens it.',
    ),
    keyPoints: L(
      [
        'El disparador puede ser externo (lugar, persona, hora) o interno (estrés, aburrimiento, euforia).',
        'La rutina es el consumo o el hábito: la respuesta automática que se ha practicado cientos de veces.',
        'La recompensa prometida casi nunca es la que llega: al final solo alivia el malestar que creó.',
        'Cada vez que eliges otra respuesta, la nueva ruta se fortalece. Es neuroplasticidad a tu favor.',
      ],
      [
        'The trigger can be external (place, person, time) or internal (stress, boredom, euphoria).',
        'The routine is the use or habit: the automatic response practiced hundreds of times.',
        'The promised reward rarely arrives: in the end it only relieves the discomfort it created.',
        'Each time you choose a different response, the new path gets stronger. That is neuroplasticity in your favor.',
      ],
    ),
    exercise: L(
      'Dibuja tu ciclo: anota 3 disparadores frecuentes, tu rutina automática y la recompensa que buscas (y la que de verdad obtienes).',
      'Draw your cycle: note 3 frequent triggers, your automatic routine, and the reward you seek (and the one you actually get).',
    ),
    reflection: L(
      '¿En qué punto del ciclo es más fácil intervenir hoy?',
      'Where in the cycle is it easiest for you to intervene today?',
    ),
  },
  {
    id: 'why',
    title: L('2. Mi porqué', '2. My why'),
    summary: L(
      'La motivación se sostiene con valores concretos, no con culpa. Conecta cada mañana con lo que estás construyendo.',
      'Motivation holds on concrete values, not guilt. Connect each morning with what you are building.',
    ),
    keyPoints: L(
      [
        'Escribe 5 razones: salud, personas, dinero, autorespeto, futuro. Sé específico y personal.',
        'La balanza decisional: listas los pros y contras de consumir y de no consumir, con la fecha de hoy.',
        'La ambivalencia es normal: no necesitas motivación perfecta, solo suficiente para el siguiente paso.',
        'Revisa tu porqué en el momento débil del día (tarde-noche suele serlo).',
      ],
      [
        'Write 5 reasons: health, people, money, self-respect, future. Be specific and personal.',
        'Decisional balance: list pros and cons of using and of not using, dated today.',
        'Ambivalence is normal: you don’t need perfect motivation, just enough for the next step.',
        'Re-read your why at the weak moment of the day (late afternoon/night usually).',
      ],
    ),
    exercise: L(
      'Lee tu pledge de hoy en voz alta. Añade una frase que le dirías a tu yo de dentro de un año.',
      'Read today’s pledge out loud. Add one sentence you would say to your one-year-from-now self.',
    ),
    reflection: L(
      '¿Qué persona o proyecto se beneficia directamente de tu recuperación?',
      'Which person or project benefits directly from your recovery?',
    ),
  },
  {
    id: 'autothoughts',
    title: L('3. Pensamientos automáticos', '3. Automatic thoughts'),
    summary: L(
      'Entre el disparador y el consumo hay un pensamiento: «una más no cuenta», «necesito relajarme». Captúralos.',
      'Between the trigger and the use there is a thought: "one more doesn’t count", "I need to relax". Catch them.',
    ),
    keyPoints: L(
      [
        'Los pensamientos automáticos son rápidos, breves y parecen hechos… pero son hipótesis.',
        'Pon nombre a la emoción y su intensidad: sin nombre, manda el impulso.',
        'Escríbelos tal cual aparecen, sin censurar. Luego los examinas en el registro de pensamientos.',
        'Cuando dices «tengo el pensamiento de que…» en vez de «necesito…», ganas distancia.',
      ],
      [
        'Automatic thoughts are fast, brief and feel like facts… they are hypotheses.',
        'Name the emotion and its intensity: unnamed, the impulse rules.',
        'Write them as they appear, uncensored. You examine them later in the thought record.',
        'Saying "I am having the thought that…" instead of "I need…" creates distance.',
      ],
    ),
    exercise: L(
      'Durante 24 h, apunta 5 pensamientos que aparezcan justo antes de un antojo.',
      'Over 24 hours, note 5 thoughts that appear right before a craving.',
    ),
    reflection: L(
      '¿Cuál es tu frase automática más repetida?',
      'What is your most repeated automatic phrase?',
    ),
  },
  {
    id: 'thought-record',
    title: L('4. Registro de pensamientos', '4. Thought record'),
    summary: L(
      'La herramienta estrella de la TCC: situación → pensamiento → emoción → evidencia a favor/en contra → reencuadre.',
      'The classic CBT tool: situation → thought → emotion → evidence for/against → reframe.',
    ),
    keyPoints: L(
      [
        'Contesta a tu pensamiento como un abogado: ¿qué pruebas hay de verdad?',
        'Busca la creencia central detrás («si no bebo, no soy divertido»).',
        'El reencuadre debe ser creíble, no positivo a la fuerza: «puedo ser divertido sin beber; ayer lo fui».',
        'Usa el registro del diario de DETOXYA: 3 minutos bastan.',
      ],
      [
        'Answer your thought like a lawyer: what is the real evidence?',
        'Look for the core belief underneath ("if I don’t drink, I’m not fun").',
        'The reframe must be believable, not forced-positivity: "I can be fun without drinking; yesterday I was.".',
        'Use DETOXYA’s thought record: 3 minutes is enough.',
      ],
    ),
    exercise: L(
      'Haz un registro completo con el pensamiento más fuerte de la última semana.',
      'Complete one full record with the strongest thought from the last week.',
    ),
    reflection: L(
      '¿Qué reencuadre te cuesta más creer? Ese es el que practicar.',
      'Which reframe is hardest to believe? That is the one to practice.',
    ),
  },
  {
    id: 'distortions',
    title: L('5. Distorsiones cognitivas', '5. Cognitive distortions'),
    summary: L(
      'Pensar en blanco y negro, catastrofizar, personalizar… son atajos mentales que disparan el consumo.',
      'All-or-nothing thinking, catastrophizing, personalizing… are mental shortcuts that trigger use.',
    ),
    keyPoints: L(
      [
        'Pensamiento todo-o-nada: «lo arruiné todo, da igual» → un tropiezo no es un fracaso total.',
        'Catastrofismo: «no podré soportarlo» → las olas de antojo bajan; ya lo has comprobado.',
        'Regla del 100%: «si fallo una vez, no sirve» → la recuperación admite ajustes.',
        'Etiquetado: «soy un adicto» vs «tengo un problema que estoy tratando»: el segundo es accionable.',
      ],
      [
        'All-or-nothing: "I ruined everything, whatever" → a slip is not total failure.',
        'Catastrophizing: "I can’t handle it" → craving waves fall; you have proof.',
        'The 100% rule: "if I fail once, it’s useless" → recovery allows adjustments.',
        'Labeling: "I am an addict" vs "I have a problem I am treating": the second is actionable.',
      ],
    ),
    exercise: L(
      'Elige una distorsión de la lista y búscala en tus últimos 3 pensamientos de antojo.',
      'Pick one distortion and look for it in your last 3 craving thoughts.',
    ),
    reflection: L(
      '¿Qué distorsión usa tu inner critic con más frecuencia?',
      'Which distortion does your inner critic use most often?',
    ),
  },
  {
    id: 'high-risk',
    title: L('6. Situaciones de alto riesgo', '6. High-risk situations'),
    summary: L(
      'La mayoría de recaídas ocurren en situaciones predecibles. Mapealas y decide de antemano qué haces.',
      'Most relapses happen in predictable situations. Map them and decide in advance what you will do.',
    ),
    keyPoints: L(
      [
        'Personas: quien consume contigo o te presiona.',
        'Lugares y horarios: la ruta a casa, el viernes 20 h.',
        'Estados internos: estrés, celebración, soledad, cansancio (revisa HALT).',
        'Para cada situación escribe: cómo la evito, o si no puedo, cómo la afronto.',
      ],
      [
        'People: those who use with you or pressure you.',
        'Places and times: the way home, Friday 8pm.',
        'Internal states: stress, celebration, loneliness, tiredness (check HALT).',
        'For each situation write: how I avoid it, or if I can’t, how I cope.',
      ],
    ),
    exercise: L(
      'Crea 3 entradas en «Mis triggers» con su plan concreto.',
      'Create 3 entries in "My triggers" with a concrete plan.',
    ),
    reflection: L(
      '¿Cuál es tu situación de alto riesgo número uno esta semana?',
      'What is your number-one high-risk situation this week?',
    ),
  },
  {
    id: 'coping-plan',
    title: L('7. Plan de afrontamiento', '7. Coping plan'),
    summary: L(
      'Un plan escrito supera a la fuerza de voluntad. Ten respuestas listas para el antojo, el estrés y la recaída.',
      'A written plan beats willpower. Have ready responses for craving, stress and relapse.',
    ),
    keyPoints: L(
      [
        'Antojo agudo: surf 3 min → llamar a alguien → salir a caminar (tu secuencia, en ese orden).',
        'Estrés: respiración 4-4-4-4, reducir cafeína, dormir antes.',
        'Recaída: qué hago en la primera hora (llamar, reiniciar contador, no aislarme).',
        'Guárdalo donde lo veas: en el móvil o en la puerta de la nevera.',
      ],
      [
        'Acute craving: 3-min surf → call someone → walk out (your sequence, in that order).',
        'Stress: 4-4-4-4 breathing, less caffeine, earlier sleep.',
        'Relapse: what I do in the first hour (call, reset the clock, do not isolate).',
        'Keep it where you see it: on your phone or the fridge door.',
      ],
    ),
    exercise: L(
      'Escribe tu plan de 6 líneas: antojo, estrés, recaída. Uno por línea.',
      'Write your 6-line plan: craving, stress, relapse. One per line.',
    ),
    reflection: L(
      '¿Quién es tu persona de emergencia y lo sabe?',
      'Who is your emergency person, and do they know it?',
    ),
  },
  {
    id: 'refusal',
    title: L('8. Habilidades de negación', '8. Refusal skills'),
    summary: L(
      'Decir «no» es una habilidad que se ensaya. Prepara frases cortas y salidas físicas.',
      'Saying "no" is a skill you rehearse. Prepare short lines and physical exits.',
    ),
    keyPoints: L(
      [
        'Frases: «No, gracias», «Hoy no», «Me espero», «Ya está, no más».',
        'No disculpas largas: cuanto más explicación, más argumentos te devuelven.',
        'Cambia el plan: propón un café, un cine, una caminata en vez del plan de consumo.',
        'Sal si hace falta: salir no es debilidad, es estrategia.',
      ],
      [
        'Lines: "No thanks", "Not today", "I’ll pass", "That’s enough, no more".',
        'No long excuses: the more explanation, the more counterarguments you get.',
        'Change the plan: suggest a coffee, a movie, a walk instead of the using plan.',
        'Leave if needed: leaving is not weakness, it is strategy.',
      ],
    ),
    exercise: L(
      'Ensaye en voz alta tu frase de negación para el trigger más frecuente.',
      'Practice your refusal line out loud for the most frequent trigger.',
    ),
    reflection: L(
      '¿Qué situación te da más miedo decir que no?',
      'Which situation frightens you most to refuse?',
    ),
  },
  {
    id: 'activation',
    title: L('9. Activación conductual', '9. Behavioral activation'),
    summary: L(
      'El placer sano rellena el hueco que dejó el consumo. Prográmalo como una cita, no «cuando pueda».',
      'Healthy pleasure fills the hole use left. Schedule it like an appointment, not "when I can".',
    ),
    keyPoints: L(
      [
        'Haz una lista de 10 actividades placenteras y ejecutables hoy.',
        'Combina placer + gente: multiplica el efecto.',
        'Empieza pequeño: 10 minutos cuentan; la inercia es el enemigo.',
        'Vigila la anhedonia inicial: las primeras semanas el placer tarda en volver; no es permanente.',
      ],
      [
        'Make a list of 10 pleasurable, doable-today activities.',
        'Combine pleasure + people: it multiplies the effect.',
        'Start small: 10 minutes count; inertia is the enemy.',
        'Watch early anhedonia: pleasure takes weeks to return; it is not permanent.',
      ],
    ),
    exercise: L(
      'Agenda 3 actividades placenteras para los próximos 3 días y bloquéalas en el calendario.',
      'Schedule 3 pleasurable activities for the next 3 days and block them in your calendar.',
    ),
    reflection: L(
      '¿Qué actividad dejaste de hacer y extrañas?',
      'What activity did you stop doing that you miss?',
    ),
  },
  {
    id: 'stress',
    title: L('10. Manejo del estrés', '10. Stress management'),
    summary: L(
      'El estrés crónico es combustible para la recaída. Sueño, comida, movimiento y límites son medicina básica.',
      'Chronic stress is relapse fuel. Sleep, food, movement and boundaries are basic medicine.',
    ),
    keyPoints: L(
      [
        'Sueño: hora fija de acostarte; sin cafeína tras mediodía.',
        'Cuerpo: caminar 20-30 min al día reduce antojos medidos en estudios.',
        'Límites: un «no» a tiempo evita tres síes que te desbordan.',
        'Ritual de cierre nocturno: revisión del día + 3 respiraciones largas.',
      ],
      [
        'Sleep: fixed bedtime; no caffeine after noon.',
        'Body: 20-30 min walking daily reduces measured cravings.',
        'Boundaries: one timely "no" avoids three "yes" that overwhelm you.',
        'Night closing ritual: daily review + 3 long breaths.',
      ],
    ),
    exercise: L(
      'Elige una sola palanca (sueño, caminar, límites) y comprométete 7 días.',
      'Pick one lever (sleep, walking, boundaries) and commit for 7 days.',
    ),
    reflection: L(
      '¿Qué estrés puedes eliminar esta semana, no solo gestionar?',
      'Which stressor can you remove this week, not just manage?',
    ),
  },
  {
    id: 'relapse',
    title: L('11. Recaída: qué es y qué no', '11. Relapse: what it is and is not'),
    summary: L(
      'La recaída es un proceso, no un botón. Un tropiezo es información, no una condena.',
      'Relapse is a process, not a switch. A slip is information, not a sentence.',
    ),
    keyPoints: L(
      [
        'Señales tempranas: romanticizar el consumo, saltarte check-ins, aislarte.',
        'Tras un tropiezo: llama a alguien hoy, revisa el disparador, reinicia sin ceremonia.',
        'Riesgo de sobredosis es máximo tras la abstinencia: habla de naloxona y tolerancia.',
        'Ninguna técnica falló entera: se ajusta el plan y se sigue.',
      ],
      [
        'Early signs: romanticizing use, skipping check-ins, isolating.',
        'After a slip: call someone today, review the trigger, reset without ceremony.',
        'Overdose risk is highest after abstinence: talk naloxone and tolerance.',
        'No technique failed completely: adjust the plan and continue.',
      ],
    ),
    exercise: L(
      'Escribe tu protocolo de las primeras 24 h tras un tropiezo.',
      'Write your first-24-hours protocol after a slip.',
    ),
    reflection: L(
      '¿Qué señal temprana sueles ignorar?',
      'Which early warning signal do you usually ignore?',
    ),
  },
  {
    id: 'balance',
    title: L('12. Vida equilibrada', '12. A balanced life'),
    summary: L(
      'La recuperación se mantiene con una vida que merece la pena vivirla: trabajo, gente, salud, ocio, sentido.',
      'Recovery is maintained by a life worth living: work, people, health, leisure, meaning.',
    ),
    keyPoints: L(
      [
        'Haz la «tarta» del equilibrio: reparte 100 puntos entre las 5 áreas de tu vida.',
        'Identifica el área más descuidada y dale 15 minutos esta semana.',
        'Celebra hitos con experiencias, no con sustancias.',
        'Mantén el aprendizaje: cada mes revisa qué técnica te funcionó mejor.',
      ],
      [
        'Make the balance "pie": split 100 points across your 5 life areas.',
        'Find the most neglected area and give it 15 minutes this week.',
        'Celebrate milestones with experiences, not substances.',
        'Keep learning: each month review which technique worked best.',
      ],
    ),
    exercise: L(
      'Reparte 100 puntos en tu tarta del equilibrio y elige una acción para el área más baja.',
      'Split 100 points on your balance pie and pick one action for the lowest area.',
    ),
    reflection: L(
      '¿Qué vida quieres contar en tu próximo hito de 30 días?',
      'What life do you want to describe at your next 30-day milestone?',
    ),
  },
];

export const CBT_SOURCES: Source[] = [SOURCES.smart, SOURCES.whoMhgap, SOURCES.mbrpRct];

export interface MbrpPractice {
  id: string;
  title: Record<Language, string>;
  minutes: number;
  intro: Record<Language, string>;
  steps: Record<Language, string[]>;
}

export const MBRP_PRACTICES: readonly MbrpPractice[] = [
  {
    id: 'body-scan-craving',
    title: L('Escaneo corporal del antojo', 'Craving body scan'),
    minutes: 5,
    intro: L(
      'Observar el antojo como sensación física reduce su poder. No luches: mira.',
      'Watching a craving as a physical sensation reduces its power. Do not fight: look.',
    ),
    steps: L(
      [
        'Siéntate derecho/a, pies en el suelo, ojos cerrados o mirada suave.',
        'Ubica el antojo en el cuerpo: ¿pecho, garganto, manos, estómago?',
        'Dibuja mentalmente sus bordes: ¿tiene forma? ¿se mueve?',
        'Respira hacia esa zona: el exhalar más largo suelta tensión.',
        'Observa la intensidad subir y bajar como una ola. 5 minutos.',
        'Abre los ojos y anota la intensidad final en el registro de antojos.',
      ],
      [
        'Sit upright, feet on the floor, eyes closed or soft gaze.',
        'Locate the craving in the body: chest, throat, hands, stomach?',
        'Mentally trace its edges: does it have a shape? Does it move?',
        'Breathe toward that area: longer exhales release tension.',
        'Watch intensity rise and fall like a wave. 5 minutes.',
        'Open your eyes and log the final intensity in the craving log.',
      ],
    ),
  },
  {
    id: 'breath-board',
    title: L('La respiración como tabla', 'Breath as a surfboard'),
    minutes: 3,
    intro: L(
      'El alargamiento del exhalar calma el sistema nervioso en minutos.',
      'Lengthening the exhale calms the nervous system in minutes.',
    ),
    steps: L(
      [
        'Inhala por la nariz contando 4.',
        'Exhala por la boca contando 6-8.',
        'Repite 10 ciclos sin forzar.',
        'Nota los hombros bajando y la mandíbula soltando.',
        'Sostén 1 minuto en silencio, sin objetivo.',
      ],
      [
        'Inhale through the nose counting to 4.',
        'Exhale through the mouth counting to 6-8.',
        'Repeat 10 cycles without forcing.',
        'Notice shoulders dropping and jaw releasing.',
        'Stay 1 minute in silence, no goal.',
      ],
    ),
  },
  {
    id: 'sit-with-craving',
    title: L('Sentarse con el antojo', 'Sitting with the craving'),
    minutes: 10,
    intro: L(
      'La paradoja: cuando dejas de luchar contra el antojo, suele bajar antes.',
      'The paradox: when you stop fighting a craving, it often falls sooner.',
    ),
    steps: L(
      [
        'Pon un temporizador de 10 minutos. Puedes hacerlo, es solo observar.',
        'Nombra lo que sientes: «antojo», «ansiedad», «impaciencia».',
        'Recuérdate: «esto es temporal; las olas bajan».',
        'Si aparece la historia «necesito ya», agradece el pensamiento y vuelve a la respiración.',
        'Cuando suene el temporizador, valora cómo está el cuerpo ahora.',
      ],
      [
        'Set a 10-minute timer. You can do this: it is only observing.',
        'Name what you feel: "craving", "anxiety", "impatience".',
        'Remind yourself: "this is temporary; waves fall".',
        'If the story "I need it now" appears, thank the thought and return to breath.',
        'When the timer rings, check how the body feels now.',
      ],
    ),
  },
  {
    id: 'soak',
    title: L('Herramienta SOAK', 'SOAK tool'),
    minutes: 5,
    intro: L(
      'Un protocolo de 4 pasos para momentos calientes.',
      'A 4-step protocol for hot moments.',
    ),
    steps: L(
      [
        'Stop: para el cuerpo. Deja lo que tienes en las manos.',
        'Observe: ¿qué hay aquí? Sensaciones, pensamientos, impulso.',
        'Appreciate: agradece algo pequeño (respiras, hay luz, no estás solo/a).',
        'Keep curious: «¿qué pasa si me quedo 3 minutos más?».',
      ],
      [
        'Stop: stop the body. Put down what is in your hands.',
        'Observe: what is here? Sensations, thoughts, impulse.',
        'Appreciate: appreciate something small (you breathe, there is light, you are not alone).',
        'Keep curious: "what happens if I stay 3 more minutes?"',
      ],
    ),
  },
  {
    id: 'boat',
    title: L('Herramienta BOAT', 'BOAT tool'),
    minutes: 4,
    intro: L(
      'Otra secuencia breve: respirar, observar, aceptar, tomarte un momento.',
      'Another short sequence: breathe, observe, accept, take a moment.',
    ),
    steps: L(
      [
        'Breath: tres respiraciones lentas, sin cambiar nada.',
        'Observe: el antojo como nube o ola que pasa por ti.',
        'Accept: «esto ya está aquí; no tengo que gustarme».',
        'Take a moment: elige el siguiente micro-paso (agua, caminar, llamar).',
      ],
      [
        'Breath: three slow breaths, changing nothing.',
        'Observe: the craving as a cloud or wave passing through you.',
        'Accept: "this is already here; I don’t have to like it".',
        'Take a moment: choose the next micro-step (water, walk, call).',
      ],
    ),
  },
  {
    id: 'mindful-walk',
    title: L('Caminata consciente', 'Mindful walk'),
    minutes: 10,
    intro: L(
      'Mover el cuerpo y la atención a la vez corta el rumiar.',
      'Moving body and attention together stops rumination.',
    ),
    steps: L(
      [
        'Sal sin auriculares los primeros 5 minutos.',
        'Siente los pies: talón, empeine, punta.',
        'Sincroniza respiración y paso (2-3 pasos por inhalación).',
        'Nombra 5 cosas que ves, 4 que oyes, 3 que tocas.',
        'Vuelve con la misma atención al entrar en casa.',
      ],
      [
        'Go out without headphones for the first 5 minutes.',
        'Feel your feet: heel, midfoot, toe.',
        'Sync breath and steps (2-3 steps per inhale).',
        'Name 5 things you see, 4 you hear, 3 you touch.',
        'Return with the same attention when you get home.',
      ],
    ),
  },
  {
    id: 'self-compassion',
    title: L('Autocompasión en el tropiezo', 'Self-compassion after a slip'),
    minutes: 5,
    intro: L(
      'La autocrítica dura predice recaída; la autocompasión firme la reduce.',
      'Harsh self-criticism predicts relapse; firm self-compassion reduces it.',
    ),
    steps: L(
      [
        'Pon la mano donde sientes el malestar (pecho o mejillas).',
        'Di: «esto es un momento difícil» (es humano, no estás solo/a).',
        'Di: «que esté bien sufrir» (bondad, no indulgencia).',
        'Di: «que me dé lo que necesito» (fuerza: agua, llamada, descanso).',
        'Escribe 3 líneas a un amigo que estuviera en tu lugar: se las das a ti.',
      ],
      [
        'Put your hand where the ache is (chest or cheeks).',
        'Say: "this is a hard moment" (shared humanity, not alone).',
        'Say: "suffering is part of life" (kindness, not indulgence).',
        'Say: "may I have what I need" (strength: water, a call, rest).',
        'Write 3 lines to a friend in your place: give them to yourself.',
      ],
    ),
  },
  {
    id: 'daily-sit',
    title: L('Sesión diaria base', 'Daily base sit'),
    minutes: 10,
    intro: L(
      'La práctica diaria corta es mejor que la heroica ocasional.',
      'A short daily practice beats an occasional heroic one.',
    ),
    steps: L(
      [
        'Misma hora y sitio cada día: el contexto crea el hábito.',
        '5-10 minutos de respiración natural, sin controlar.',
        'Cuando la mente se vaya, vuelve sin regaño: volver ES la práctica.',
        'Cierra con una intención: «siguiente hora, atención plena».',
        'Lleva racha en el programa: los días de práctica cuentan como victoria.',
      ],
      [
        'Same time and place each day: context builds habit.',
        '5-10 minutes of natural breath, no controlling.',
        'When the mind wanders, return without scolding: returning IS the practice.',
        'Close with an intention: "next hour, mindful".',
        'Track streaks in the program: practice days count as wins.',
      ],
    ),
  },
];

export const MBRP_SOURCES: Source[] = [SOURCES.mbrpRct, SOURCES.marlattUrge, SOURCES.whoMhgap];
