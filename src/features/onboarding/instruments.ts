export interface QuestionOption {
  value: number;
  labelKey: string;
}

export interface WizardQuestion {
  id: string;
  labelKey: string;
  options: QuestionOption[];
}

const AUDIT_FREQ: QuestionOption[] = [
  { value: 0, labelKey: 'onboarding:optNever' },
  { value: 1, labelKey: 'onboarding:optMonthlyOrLess' },
  { value: 2, labelKey: 'onboarding:optTwoFourMonth' },
  { value: 3, labelKey: 'onboarding:optTwoThreeWeek' },
  { value: 4, labelKey: 'onboarding:optFourWeek' },
];

const AUDIT_AMOUNT: QuestionOption[] = [
  { value: 0, labelKey: 'onboarding:optUnits12' },
  { value: 1, labelKey: 'onboarding:optUnits34' },
  { value: 2, labelKey: 'onboarding:optUnits56' },
  { value: 3, labelKey: 'onboarding:optUnits79' },
  { value: 4, labelKey: 'onboarding:optUnits10' },
];

export const AUDIT_C_QUESTIONS: readonly WizardQuestion[] = [
  { id: 'audit-c-1', labelKey: 'onboarding:auditCQ1', options: AUDIT_FREQ },
  { id: 'audit-c-2', labelKey: 'onboarding:auditCQ2', options: AUDIT_AMOUNT },
  { id: 'audit-c-3', labelKey: 'onboarding:auditCQ3', options: AUDIT_FREQ },
];

const YES_NO: QuestionOption[] = [
  { value: 1, labelKey: 'onboarding:yes' },
  { value: 0, labelKey: 'onboarding:no' },
];

export const CAGE_AID_QUESTIONS: readonly WizardQuestion[] = [
  { id: 'cage-aid-1', labelKey: 'onboarding:cageQ1', options: YES_NO },
  { id: 'cage-aid-2', labelKey: 'onboarding:cageQ2', options: YES_NO },
  { id: 'cage-aid-3', labelKey: 'onboarding:cageQ3', options: YES_NO },
  { id: 'cage-aid-4', labelKey: 'onboarding:cageQ4', options: YES_NO },
];

const PHQ_OPTIONS: QuestionOption[] = [
  { value: 0, labelKey: 'onboarding:phq0' },
  { value: 1, labelKey: 'onboarding:phq1' },
  { value: 2, labelKey: 'onboarding:phq2' },
  { value: 3, labelKey: 'onboarding:phq3' },
];

export const PHQ9_QUESTIONS: readonly WizardQuestion[] = [
  { id: 'phq-9-1', labelKey: 'onboarding:phqQ1', options: PHQ_OPTIONS },
  { id: 'phq-9-2', labelKey: 'onboarding:phqQ2', options: PHQ_OPTIONS },
  { id: 'phq-9-3', labelKey: 'onboarding:phqQ3', options: PHQ_OPTIONS },
  { id: 'phq-9-4', labelKey: 'onboarding:phqQ4', options: PHQ_OPTIONS },
  { id: 'phq-9-5', labelKey: 'onboarding:phqQ5', options: PHQ_OPTIONS },
  { id: 'phq-9-6', labelKey: 'onboarding:phqQ6', options: PHQ_OPTIONS },
  { id: 'phq-9-7', labelKey: 'onboarding:phqQ7', options: PHQ_OPTIONS },
  { id: 'phq-9-8', labelKey: 'onboarding:phqQ8', options: PHQ_OPTIONS },
  { id: 'phq-9-9', labelKey: 'onboarding:phqQ9', options: PHQ_OPTIONS },
];

export const DEP_FLAG_QUESTIONS: readonly WizardQuestion[] = [
  { id: 'daily-alcohol-or-benzo', labelKey: 'onboarding:flagDaily', options: YES_NO },
  { id: 'past-withdrawal-seizures', labelKey: 'onboarding:flagSeizures', options: YES_NO },
  { id: 'benzo-daily-4w', labelKey: 'onboarding:flagBenzo', options: YES_NO },
  { id: 'opioid-use', labelKey: 'onboarding:flagOpioid', options: YES_NO },
  { id: 'withdrawal-symptoms-on-stop', labelKey: 'onboarding:flagWd', options: YES_NO },
  { id: 'polysubstance', labelKey: 'onboarding:flagPoly', options: YES_NO },
  { id: 'pregnancy', labelKey: 'onboarding:flagPregnancy', options: YES_NO },
  { id: 'age-65-plus', labelKey: 'onboarding:flagAge', options: YES_NO },
  { id: 'no-support-during-withdrawal', labelKey: 'onboarding:flagAlone', options: YES_NO },
  { id: 'serious-medical-condition', labelKey: 'onboarding:flagMedical', options: YES_NO },
];

export const COUNTRY_OPTIONS: readonly { code: string; labelKey: string }[] = [
  { code: 'ES', labelKey: 'onboarding:countryES' },
  { code: 'MX', labelKey: 'onboarding:countryMX' },
  { code: 'AR', labelKey: 'onboarding:countryAR' },
  { code: 'CL', labelKey: 'onboarding:countryCL' },
  { code: 'CO', labelKey: 'onboarding:countryCO' },
  { code: 'PE', labelKey: 'onboarding:countryPE' },
  { code: 'BR', labelKey: 'onboarding:countryBR' },
  { code: 'US', labelKey: 'onboarding:countryUS' },
  { code: 'CA', labelKey: 'onboarding:countryCA' },
  { code: 'FR', labelKey: 'onboarding:countryFR' },
  { code: 'GB', labelKey: 'onboarding:countryGB' },
  { code: 'DE', labelKey: 'onboarding:countryDE' },
  { code: 'IT', labelKey: 'onboarding:countryIT' },
  { code: 'PT', labelKey: 'onboarding:countryPT' },
  { code: 'AU', labelKey: 'onboarding:countryAU' },
  { code: 'IN', labelKey: 'onboarding:countryIN' },
];
