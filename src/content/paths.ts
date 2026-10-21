import type { Language } from '../i18n';
import { SOURCES, type Source } from './sources';

function L<T>(es: T, en: T): Record<Language, T> {
  return { es, en };
}

export interface RecoveryPath {
  id: string;
  name: string;
  tagline: Record<Language, string>;
  points: Record<Language, string[]>;
  linkLabel: Record<Language, string>;
  linkUrl: string;
  source: Source;
}

export const PATHS: readonly RecoveryPath[] = [
  {
    id: 'smart',
    name: 'SMART Recovery',
    tagline: L(
      'Autoayuda secular basada en TCC y motivación. Tú eliges la meta.',
      'Secular self-help based on CBT and motivation. You choose the goal.',
    ),
    points: L(
      [
        '1. Construir y mantener la motivación (valores, balanza decisional).',
        '2. Afrontar los antojos (D.E.A.D.S.: Delay, Escape, Avoid, Distract, Substitute).',
        '3. Manejar pensamientos y emociones (distorsiones, mindfulness).',
        '4. Vivir una vida equilibrada (áreas de la vida, prevención de recaída).',
      ],
      [
        '1. Build & maintain motivation (values, decisional balance).',
        '2. Cope with urges (D.E.A.D.S.: Delay, Escape, Avoid, Distract, Substitute).',
        '3. Manage thoughts & feelings (distortions, mindfulness).',
        '4. Live a balanced life (life areas, relapse prevention).',
      ],
    ),
    linkLabel: L('Encuentra un grupo SMART', 'Find a SMART meeting'),
    linkUrl: 'https://smartrecovery.org/meeting',
    source: SOURCES.smart,
  },
  {
    id: 'hams',
    name: 'HAMS',
    tagline: L(
      'Apoyo a la reducción de daños, la abstinencia o la moderación: tú eliges el objetivo.',
      'Harm reduction, abstinence or moderation support: you choose the goal.',
    ),
    points: L(
      [
        'Haz un plan por escrito (meta concreta y medible).',
        'Lleva un calendario de consumo con notas de ánimo y dinero.',
        'Revisa el plan semanalmente y ajusta.',
        'Celebra lo conseguido sin dramatizar los tropiezos.',
      ],
      [
        'Make a written plan (concrete, measurable goal).',
        'Keep a use calendar with mood and money notes.',
        'Review the plan weekly and adjust.',
        'Celebrate wins without dramatizing slips.',
      ],
    ),
    linkLabel: L('Cómo funciona HAMS', 'How HAMS works'),
    linkUrl: 'https://www.hams.cc/works',
    source: SOURCES.hams,
  },
  {
    id: 'moderation-management',
    name: 'Moderation Management',
    tagline: L(
      'Para personas no dependientes que quieren reducir con límites claros.',
      'For non-dependent people who want to reduce with clear limits.',
    ),
    points: L(
      [
        'Periodo inicial de abstinencia («hacer un 30») para recalibrar.',
        'Límites semanales: beber en pocos días, con tope de unidades por día y semana.',
        'Autocontrol diario: registrar antes de beber, no después.',
        'Si la moderación falla de forma repetida, la abstinencia puede ser la única opción segura.',
      ],
      [
        'Initial abstinence period ("doing a 30") to recalibrate.',
        'Weekly limits: drinking on few days, with per-day and per-week caps.',
        'Daily self-monitoring: log before drinking, not after.',
        'If moderation repeatedly fails, abstinence may be the only safe option.',
      ],
    ),
    linkLabel: L('Guías de moderación', 'Moderation guidelines'),
    linkUrl:
      'https://moderation.org/getting-started-moderation-management/moderate-drinking-guidelines/',
    source: SOURCES.moderationManagement,
  },
  {
    id: 'dharma',
    name: 'Recovery Dharma / Refuge',
    tagline: L(
      'Recuperación basada en la compasión y la atención plena, sin dogma.',
      'Recovery based on compassion and mindfulness, without dogma.',
    ),
    points: L(
      [
        'Las Cuatro Nobles Verdades: el sufrimiento, su origen (el anhelo), la posibilidad de cesar y el camino.',
        'Práctica diaria de meditación e introspección escrita.',
        'Comunidad (sangha) y mentoría entre pares.',
        'Renuncia + crecimiento: no solo dejar, también construir.',
      ],
      [
        'The Four Noble Truths: suffering, its origin (craving), the possibility of cessation, and the path.',
        'Daily meditation and written inquiry practice.',
        'Community (sangha) and peer mentorship.',
        'Renunciation + growth: not only leaving, also building.',
      ],
    ),
    linkLabel: L('Explorar Recovery Dharma', 'Explore Recovery Dharma'),
    linkUrl: 'https://recoverydharma.org/',
    source: SOURCES.recoveryDharma,
  },
  {
    id: 'twelve-step',
    name: '12 pasos (AA / NA)',
    tagline: L(
      'El modelo de apoyo mutuo más extendido del mundo. Espiritual, no necesariamente religioso.',
      'The most widespread mutual-aid model in the world. Spiritual, not necessarily religious.',
    ),
    points: L(
      [
        'Grupos en todo el mundo, presenciales y online, gratuitos.',
        'Trabajo guiado con un sponsor / padrinazgo entre pares.',
        'Tradición de anonimato: lo que se dice ahí, se queda ahí.',
        'DETOXYA no reproduce el texto de AA/NA (copyright): te enlazamos con los oficiales.',
      ],
      [
        'Groups worldwide, in-person and online, free.',
        'Guided work with a sponsor / peer sponsorship.',
        'Anonymity tradition: what is said there stays there.',
        'DETOXYA does not reproduce AA/NA text (copyright): we link you to the official sources.',
      ],
    ),
    linkLabel: L('Buscar reuniones (AA)', 'Find meetings (AA)'),
    linkUrl: 'https://www.aa.org/find-aa',
    source: SOURCES.aa,
  },
  {
    id: 'lifering',
    name: 'LifeRing',
    tagline: L(
      'Recuperación secular: el «yo sobrio» es el que manda.',
      'Secular recovery: the "sober self" is in charge.',
    ),
    points: L(
      [
        'Enfoque en el presente y el futuro, no en el pasado.',
        'Empowerment: tú diseñas tu programa con apoyo del grupo.',
        'Sin espiritualidad obligatoria ni lenguaje de poderlessness.',
        'Material sencillo de prevención de recaída (los 4 Ds).',
      ],
      [
        'Focus on the present and future, not the past.',
        'Empowerment: you design your program with group support.',
        'No mandatory spirituality or powerlessness language.',
        'Simple relapse-prevention material (the 4 Ds).',
      ],
    ),
    linkLabel: L('LifeRing Secular Recovery', 'LifeRing Secular Recovery'),
    linkUrl: 'https://lifering.org/',
    source: SOURCES.lifering,
  },
];
