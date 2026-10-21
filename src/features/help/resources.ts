export type HelpResourceKind = 'emergency' | 'crisis-line' | 'referral' | 'info';

export interface HelpResource {
  id: string;
  kind: HelpResourceKind;
  name: string;
  phone: string | null;
  /** tel: href si hay teléfono. */
  telHref: string | null;
  url: string | null;
  countries: readonly string[];
  noteKey: string;
}

function tel(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

/**
 * Números de crisis y derivación. Los datos telefónicos no se traducen;
 * solo el `noteKey` se localiza. Verifica vigencia en docs/SAFETY.md.
 */
const RESOURCES: readonly HelpResource[] = [
  {
    id: 'es-024',
    kind: 'crisis-line',
    name: '024 — Línea de atención a la conducta suicida (España)',
    phone: '024',
    telHref: tel('024'),
    url: 'https://www.sanidad.gob.es/areas/mentalSaludEnfermedadesNeurologicas/atuencionConductaSuicida/home.htm',
    countries: ['ES'],
    noteKey: 'resources:es024',
  },
  {
    id: 'es-112',
    kind: 'emergency',
    name: '112 — Emergencias (España)',
    phone: '112',
    telHref: tel('112'),
    url: null,
    countries: ['ES'],
    noteKey: 'resources:emergency',
  },
  {
    id: 'us-988',
    kind: 'crisis-line',
    name: '988 — Suicide & Crisis Lifeline (EE. UU.)',
    phone: '988',
    telHref: tel('988'),
    url: 'https://988lifeline.org/',
    countries: ['US'],
    noteKey: 'resources:us988',
  },
  {
    id: 'us-samhsa',
    kind: 'referral',
    name: 'SAMHSA National Helpline (EE. UU.)',
    phone: '+18006624357',
    telHref: tel('1-800-662-4357'),
    url: 'https://www.samhsa.gov/find-help/national-helpline',
    countries: ['US'],
    noteKey: 'resources:samhsa',
  },
  {
    id: 'us-911',
    kind: 'emergency',
    name: '911 — Emergencias (EE. UU./Canadá)',
    phone: '911',
    telHref: tel('911'),
    url: null,
    countries: ['US', 'CA'],
    noteKey: 'resources:emergency',
  },
  {
    id: 'ca-988',
    kind: 'crisis-line',
    name: '9-8-8 — Suicide Crisis Helpline (Canadá)',
    phone: '988',
    telHref: tel('988'),
    url: 'https://988.ca/',
    countries: ['CA'],
    noteKey: 'resources:ca988',
  },
  {
    id: 'mx-saptel',
    kind: 'crisis-line',
    name: 'SAPTEL — 800 911 2000 (México)',
    phone: '8009112000',
    telHref: tel('800-911-2000'),
    url: 'https://www.saptel.org.mx/',
    countries: ['MX'],
    noteKey: 'resources:saptel',
  },
  {
    id: 'mx-911',
    kind: 'emergency',
    name: '911 — Emergencias (México)',
    phone: '911',
    telHref: tel('911'),
    url: null,
    countries: ['MX'],
    noteKey: 'resources:emergency',
  },
  {
    id: 'ar-135',
    kind: 'crisis-line',
    name: '135 — Línea de Salud Mental (CABA, Argentina)',
    phone: '135',
    telHref: tel('135'),
    url: 'https://www.buenosaires.gob.ar/salud/lineas-de-atencion',
    countries: ['AR'],
    noteKey: 'resources:ar135',
  },
  {
    id: 'cl-600',
    kind: 'crisis-line',
    name: 'Salud Responde — 600 360 7777 (Chile)',
    phone: '6003607777',
    telHref: tel('600-360-7777'),
    url: 'https://www.gob.cl/saludresponde/',
    countries: ['CL'],
    noteKey: 'resources:cl600',
  },
  {
    id: 'co-106',
    kind: 'crisis-line',
    name: 'Línea 106 — Atención en crisis (Colombia)',
    phone: '106',
    telHref: tel('106'),
    url: 'https://www.infosalud.gov.co/',
    countries: ['CO'],
    noteKey: 'resources:co106',
  },
  {
    id: 'pe-113',
    kind: 'crisis-line',
    name: '113 — Línea de Salud Mental (Perú)',
    phone: '113',
    telHref: tel('113'),
    url: null,
    countries: ['PE'],
    noteKey: 'resources:pe113',
  },
  {
    id: 'br-188',
    kind: 'crisis-line',
    name: 'CVV — 188 (Brasil)',
    phone: '188',
    telHref: tel('188'),
    url: 'https://www.cvv.org.br/',
    countries: ['BR'],
    noteKey: 'resources:cvv',
  },
  {
    id: 'fr-3114',
    kind: 'crisis-line',
    name: '3114 — Prévention suicide (Francia)',
    phone: '3114',
    telHref: tel('3114'),
    url: 'https://3114.fr/',
    countries: ['FR'],
    noteKey: 'resources:fr3114',
  },
  {
    id: 'uk-116123',
    kind: 'crisis-line',
    name: 'Samaritans — 116 123 (Reino Unido/Irlanda)',
    phone: '116123',
    telHref: tel('116 123'),
    url: 'https://www.samaritans.org/',
    countries: ['GB', 'IE'],
    noteKey: 'resources:samaritans',
  },
  {
    id: 'de-111',
    kind: 'crisis-line',
    name: 'Telefonseelsorge — 0800 111 0 111 (Alemania)',
    phone: '08001110111',
    telHref: tel('0800 111 0 111'),
    url: 'https://www.telefonseelsorge.de/',
    countries: ['DE'],
    noteKey: 'resources:telefonseelsorge',
  },
  {
    id: 'it-196',
    kind: 'crisis-line',
    name: 'Telefono Amico — 196 96 (Italia)',
    phone: '19696',
    telHref: tel('196 96'),
    url: 'https://www.telefonoamico.it/',
    countries: ['IT'],
    noteKey: 'resources:telefonoamico',
  },
  {
    id: 'findahelpline',
    kind: 'info',
    name: 'findahelpline.com',
    phone: null,
    telHref: null,
    url: 'https://findahelpline.com/',
    countries: ['*'],
    noteKey: 'resources:findahelpline',
  },
  {
    id: 'iasp',
    kind: 'info',
    name: 'IASP — Recursos internacionales',
    phone: null,
    telHref: null,
    url: 'https://www.iasp.info/suicidalthoughts/',
    countries: ['*'],
    noteKey: 'resources:iasp',
  },
];

export const EMERGENCY_BY_COUNTRY: Readonly<Record<string, string>> = {
  AR: '911',
  AU: '000',
  BR: '192',
  CA: '911',
  CL: '133',
  CO: '123',
  DE: '112',
  ES: '112',
  FR: '15',
  GB: '999',
  IE: '112',
  IN: '112',
  IT: '112',
  MX: '911',
  PE: '106',
  PT: '112',
  US: '911',
};

export function emergencyPhoneFor(country: string | null): string | null {
  if (!country) return null;
  return EMERGENCY_BY_COUNTRY[country] ?? null;
}

export function getHelpResources(country: string | null): HelpResource[] {
  const local = country ? RESOURCES.filter((r) => r.countries.includes(country)) : [];
  const intl = RESOURCES.filter((r) => r.countries.includes('*'));
  return [...local, ...intl];
}
