export interface Source {
  title: string;
  org: string;
  url: string;
}

export const SOURCES = {
  samhsaProtracted: {
    title: 'TIP 45: Detoxification and Substance Abuse Treatment — Protracted Withdrawal',
    org: 'SAMHSA',
    url: 'https://library.samhsa.gov/sites/default/files/sma10-4554.pdf',
  },
  samhsaCm: {
    title: 'Contingency Management Incentives (PEP24-06-001)',
    org: 'SAMHSA',
    url: 'https://library.samhsa.gov/sites/default/files/contingency-management-advisory-pep24-06-001.pdf',
  },
  niaaa: {
    title: 'Alcohol Use Disorder — Definition & screening (AUDIT-C)',
    org: 'NIAAA / NLM',
    url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-alcohol-use-disorder',
  },
  asamBzd: {
    title: 'Benzodiazepine Tapering Clinical Practice Guideline (2025)',
    org: 'ASAM / APA',
    url: 'https://www.asam.org/quality-care/clinical-guidelines/benzodiazepine-tapering',
  },
  clevelandAw: {
    title: 'Alcohol Withdrawal',
    org: 'Cleveland Clinic',
    url: 'https://my.clevelandclinic.org/health/diseases/9247-alcohol-withdrawal',
  },
  cannabisWithdrawal: {
    title: 'Cannabis Withdrawal: Epidemiology, Clinical Features, Diagnosis and Treatment',
    org: 'UpToDate / ABIM',
    url: 'https://www.uptodate.com/contents/cannabis-withdrawal-epidemiology-clinical-features-diagnosis-and-treatment',
  },
  nicotineWithdrawal: {
    title: 'Nicotine Withdrawal',
    org: 'Cleveland Clinic',
    url: 'https://my.clevelandclinic.org/health/diseases/21587-nicotine-withdrawal',
  },
  stimulantTip: {
    title: 'TIP 45: Chapter 3 — Alcohol and Other Drugs (stimulant withdrawal)',
    org: 'SAMHSA / NCBI',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK576550/',
  },
  fdaBzdBoxed: {
    title: 'FDA Drug Safety Communication: Boxed Warning for benzodiazepines',
    org: 'FDA',
    url: 'https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-approves-label-changes-use-benzodiazepine-drug-class-boxed',
  },
  asamOpioid: {
    title: 'National Practice Guideline for the Treatment of Opioid Use Disorder',
    org: 'ASAM',
    url: 'https://www.asam.org/quality-care/clinical-guidelines/national-practice-guideline',
  },
  samhsaNaloxone: {
    title: 'Opioid Overdose Prevention Toolkit',
    org: 'SAMHSA',
    url: 'https://www.samhsa.gov/substance-use/treatment/basic-steps/helping-someone',
  },
  mbrpRct: {
    title: 'Mindfulness-Based Relapse Prevention for Substance Use Disorders (RCT)',
    org: 'JAMA Psychiatry / Bowen et al.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24647726/',
  },
  marlattUrge: {
    title: 'Urge Surfing (handout)',
    org: 'Dartmouth Hitchcock',
    url: 'https://www.dartmouth-hitchcock.org/sites/default/files/2021-03/urge-surfing.pdf',
  },
  fourDs: {
    title: 'The Four Ds — a simple relapse prevention strategy',
    org: 'LifeRing',
    url: 'https://lifering.org/',
  },
  halt: {
    title: 'HALT (Hungry, Angry, Lonely, Tired) — recovery self-check',
    org: 'NCBI Bookshelf / recovery literature',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK601489/',
  },
  smart: {
    title: 'SMART Recovery 4-Point Program',
    org: 'SMART Recovery',
    url: 'https://smartrecovery.org/smart-recovery-programs',
  },
  hams: {
    title: 'HAMS: Harm Reduction, Abstinence, and Moderation Support',
    org: 'HAMS',
    url: 'https://www.hams.cc/works',
  },
  moderationManagement: {
    title: 'Moderation Management guidelines',
    org: 'Moderation Management',
    url: 'https://moderation.org/getting-started-moderation-management/moderate-drinking-guidelines/',
  },
  recoveryDharma: {
    title: 'The Four Noble Truths & Eightfold Path',
    org: 'Recovery Dharma',
    url: 'https://recoverydharma.org/project/the-four-noble-truths/',
  },
  aa: {
    title: 'The Twelve Steps',
    org: 'Alcoholics Anonymous',
    url: 'https://www.aa.org/the-twelve-steps',
  },
  lifering: {
    title: 'LifeRing Secular Recovery',
    org: 'LifeRing',
    url: 'https://lifering.org/',
  },
  pawsJagp: {
    title: 'Protracted Withdrawal Syndrome — windows and waves',
    org: 'Journal of the American Geriatrics Society (review)',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1555415521005523',
  },
  coldDive: {
    title: 'Mammalian dive response & panic symptoms (cold face immersion)',
    org: 'PubMed / StatPearls',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK538245/',
  },
  jitai: {
    title: 'Just-in-Time Adaptive Interventions for substance use (systematic review)',
    org: 'Addiction',
    url: 'https://pubmed.ncbi.nlm.nih.gov/34514668/',
  },
  fdaWellness: {
    title: 'General Wellness: Policy for Low Risk Devices (guidance)',
    org: 'FDA',
    url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices',
  },
  whoMhgap: {
    title: 'mhGAP Intervention Guide — substance use disorders',
    org: 'WHO',
    url: 'https://www.who.int/publications/i/item/9789240084063',
  },
} as const satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;
