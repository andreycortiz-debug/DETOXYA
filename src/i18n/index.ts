import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enCravings from './locales/en/cravings.json';
import enCoach from './locales/en/coach.json';
import enDashboard from './locales/en/dashboard.json';
import enHalt from './locales/en/halt.json';
import enHelp from './locales/en/help.json';
import enJournal from './locales/en/journal.json';
import enNav from './locales/en/nav.json';
import enOnboarding from './locales/en/onboarding.json';
import enPaths from './locales/en/paths.json';
import enProgram from './locales/en/program.json';
import enResources from './locales/en/resources.json';
import enSafety from './locales/en/safety.json';
import enSettings from './locales/en/settings.json';
import enSobriety from './locales/en/sobriety.json';
import esCommon from './locales/es/common.json';
import esCravings from './locales/es/cravings.json';
import esCoach from './locales/es/coach.json';
import esDashboard from './locales/es/dashboard.json';
import esHalt from './locales/es/halt.json';
import esHelp from './locales/es/help.json';
import esJournal from './locales/es/journal.json';
import esNav from './locales/es/nav.json';
import esOnboarding from './locales/es/onboarding.json';
import esPaths from './locales/es/paths.json';
import esProgram from './locales/es/program.json';
import esResources from './locales/es/resources.json';
import esSafety from './locales/es/safety.json';
import esSettings from './locales/es/settings.json';
import esSobriety from './locales/es/sobriety.json';

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const resources = {
  es: {
    common: esCommon,
    nav: esNav,
    onboarding: esOnboarding,
    safety: esSafety,
    settings: esSettings,
    help: esHelp,
    resources: esResources,
    sobriety: esSobriety,
    cravings: esCravings,
    coach: esCoach,
    dashboard: esDashboard,
    halt: esHalt,
    program: esProgram,
    journal: esJournal,
    paths: esPaths,
  },
  en: {
    common: enCommon,
    nav: enNav,
    onboarding: enOnboarding,
    safety: enSafety,
    settings: enSettings,
    help: enHelp,
    resources: enResources,
    sobriety: enSobriety,
    cravings: enCravings,
    coach: enCoach,
    dashboard: enDashboard,
    halt: enHalt,
    program: enProgram,
    journal: enJournal,
    paths: enPaths,
  },
} as const;

export const DEFAULT_NAMESPACES = [
  'common',
  'nav',
  'onboarding',
  'safety',
  'settings',
  'help',
  'resources',
  'sobriety',
  'cravings',
  'coach',
  'dashboard',
  'halt',
  'program',
  'journal',
  'paths',
] as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: [...DEFAULT_NAMESPACES],
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'detoxya.locale',
    },
  });

// Mantener <html lang> sincronizado con el idioma activo (lectores de pantalla, :lang()).
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language === 'en' ? 'en' : 'es';
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng === 'en' ? 'en' : 'es';
  });
}

export default i18n;
