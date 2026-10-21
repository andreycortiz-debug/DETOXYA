import type { Language } from '../i18n';

export type SubstanceCategory =
  | 'depressant'
  | 'stimulant'
  | 'opioid'
  | 'cannabinoid'
  | 'psychedelic'
  | 'dissociative'
  | 'behavioral'
  | 'other';

export interface SubstanceInfo {
  id: string;
  kind: 'substance' | 'habit';
  category: SubstanceCategory;
  /** La app nunca debe guiar una retirada autónoma de estas sustancias. */
  requiresMedicalGate: boolean;
  labels: Record<Language, string>;
  /** Nombre de la unidad de consumo (trago, gramo, cigarrillo...). */
  units: Record<Language, string>;
  defaultDailyUnits: number;
  /** Precio por unidad en la moneda local del usuario (aproximación editable). */
  defaultUnitPrice: number;
}

export const SUBSTANCES: readonly SubstanceInfo[] = [
  {
    id: 'alcohol',
    kind: 'substance',
    category: 'depressant',
    requiresMedicalGate: true,
    labels: { es: 'Alcohol', en: 'Alcohol' },
    units: { es: 'trago', en: 'drink' },
    defaultDailyUnits: 6,
    defaultUnitPrice: 2,
  },
  {
    id: 'cannabis',
    kind: 'substance',
    category: 'cannabinoid',
    requiresMedicalGate: false,
    labels: { es: 'Cannabis', en: 'Cannabis' },
    units: { es: 'gramo', en: 'gram' },
    defaultDailyUnits: 1,
    defaultUnitPrice: 10,
  },
  {
    id: 'nicotine',
    kind: 'substance',
    category: 'stimulant',
    requiresMedicalGate: false,
    labels: { es: 'Nicotina (cigarrillo/vape)', en: 'Nicotine (cigarettes/vape)' },
    units: { es: 'cigarrillo', en: 'cigarette' },
    defaultDailyUnits: 15,
    defaultUnitPrice: 0.5,
  },
  {
    id: 'cocaine',
    kind: 'substance',
    category: 'stimulant',
    requiresMedicalGate: false,
    labels: { es: 'Cocaína', en: 'Cocaine' },
    units: { es: 'gramo', en: 'gram' },
    defaultDailyUnits: 0.5,
    defaultUnitPrice: 80,
  },
  {
    id: 'crack',
    kind: 'substance',
    category: 'stimulant',
    requiresMedicalGate: false,
    labels: { es: 'Crack', en: 'Crack' },
    units: { es: 'porción', en: 'portion' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 10,
  },
  {
    id: 'methamphetamine',
    kind: 'substance',
    category: 'stimulant',
    requiresMedicalGate: false,
    labels: { es: 'Metanfetamina', en: 'Methamphetamine' },
    units: { es: 'dosis', en: 'dose' },
    defaultDailyUnits: 2,
    defaultUnitPrice: 15,
  },
  {
    id: 'amphetamine',
    kind: 'substance',
    category: 'stimulant',
    requiresMedicalGate: false,
    labels: { es: 'Anfetaminas', en: 'Amphetamines' },
    units: { es: 'dosis', en: 'dose' },
    defaultDailyUnits: 2,
    defaultUnitPrice: 10,
  },
  {
    id: 'mdma',
    kind: 'substance',
    category: 'psychedelic',
    requiresMedicalGate: false,
    labels: { es: 'MDMA / éxtasis', en: 'MDMA / ecstasy' },
    units: { es: 'pastilla', en: 'pill' },
    defaultDailyUnits: 0.5,
    defaultUnitPrice: 12,
  },
  {
    id: 'opioids',
    kind: 'substance',
    category: 'opioid',
    requiresMedicalGate: true,
    labels: {
      es: 'Opiáceos (heroína/fentanilo/recetados)',
      en: 'Opioids (heroin/fentanyl/prescribed)',
    },
    units: { es: 'dosis', en: 'dose' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 20,
  },
  {
    id: 'benzodiazepines',
    kind: 'substance',
    category: 'depressant',
    requiresMedicalGate: true,
    labels: { es: 'Benzodiacepinas', en: 'Benzodiazepines' },
    units: { es: 'pastilla', en: 'pill' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 1,
  },
  {
    id: 'ketamine',
    kind: 'substance',
    category: 'dissociative',
    requiresMedicalGate: false,
    labels: { es: 'Ketamina', en: 'Ketamine' },
    units: { es: 'gramo', en: 'gram' },
    defaultDailyUnits: 0.5,
    defaultUnitPrice: 30,
  },
  {
    id: 'ghb',
    kind: 'substance',
    category: 'depressant',
    requiresMedicalGate: true,
    labels: { es: 'GHB', en: 'GHB' },
    units: { es: 'dosis', en: 'dose' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 10,
  },
  {
    id: 'lsd',
    kind: 'substance',
    category: 'psychedelic',
    requiresMedicalGate: false,
    labels: { es: 'LSD / hongos', en: 'LSD / mushrooms' },
    units: { es: 'dosis', en: 'dose' },
    defaultDailyUnits: 0.2,
    defaultUnitPrice: 10,
  },
  {
    id: 'inhalants',
    kind: 'substance',
    category: 'other',
    requiresMedicalGate: false,
    labels: { es: 'Inhalantes', en: 'Inhalants' },
    units: { es: 'sesión', en: 'session' },
    defaultDailyUnits: 2,
    defaultUnitPrice: 5,
  },
  {
    id: 'caffeine',
    kind: 'substance',
    category: 'stimulant',
    requiresMedicalGate: false,
    labels: { es: 'Cafeína', en: 'Caffeine' },
    units: { es: 'café', en: 'coffee' },
    defaultDailyUnits: 4,
    defaultUnitPrice: 1.5,
  },
  {
    id: 'gambling',
    kind: 'habit',
    category: 'behavioral',
    requiresMedicalGate: false,
    labels: { es: 'Juego de azar', en: 'Gambling' },
    units: { es: 'sesión', en: 'session' },
    defaultDailyUnits: 1,
    defaultUnitPrice: 30,
  },
  {
    id: 'porn',
    kind: 'habit',
    category: 'behavioral',
    requiresMedicalGate: false,
    labels: { es: 'Pornografía', en: 'Pornography' },
    units: { es: 'sesión', en: 'session' },
    defaultDailyUnits: 1,
    defaultUnitPrice: 0,
  },
  {
    id: 'social-media',
    kind: 'habit',
    category: 'behavioral',
    requiresMedicalGate: false,
    labels: { es: 'Redes sociales', en: 'Social media' },
    units: { es: 'hora', en: 'hour' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 0,
  },
  {
    id: 'gaming',
    kind: 'habit',
    category: 'behavioral',
    requiresMedicalGate: false,
    labels: { es: 'Videojuegos', en: 'Gaming' },
    units: { es: 'hora', en: 'hour' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 0,
  },
  {
    id: 'sugar',
    kind: 'habit',
    category: 'behavioral',
    requiresMedicalGate: false,
    labels: { es: 'Azúcar / comida compulsiva', en: 'Sugar / compulsive eating' },
    units: { es: 'ración', en: 'serving' },
    defaultDailyUnits: 3,
    defaultUnitPrice: 2,
  },
  {
    id: 'shopping',
    kind: 'habit',
    category: 'behavioral',
    requiresMedicalGate: false,
    labels: { es: 'Compras compulsivas', en: 'Compulsive shopping' },
    units: { es: 'compra', en: 'purchase' },
    defaultDailyUnits: 0.5,
    defaultUnitPrice: 20,
  },
];

const byId = new Map(SUBSTANCES.map((s) => [s.id, s]));

export function getSubstance(id: string): SubstanceInfo | undefined {
  return byId.get(id);
}

export function gateSubstances(ids: readonly string[]): string[] {
  return ids.filter((id) => byId.get(id)?.requiresMedicalGate);
}
