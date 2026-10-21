# Evidencia

Todo el contenido educativo de DETOXYA cita sus fuentes en `src/content/sources.ts` y se muestra en la UI con `SourcesList`. Esta página resume el mapa de fuentes por área. **No somos clínicos**: el contenido es educativo, revisado a mano y sujeto a corrección; si encuentras un error, abre un issue.

## Screening y evaluación

| Herramienta   | Fuente                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUDIT-C       | [NIAAA — Understanding Alcohol Use Disorder](https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/understanding-alcohol-use-disorder) |
| PHQ-9 / mhGAP | [WHO mhGAP Intervention Guide (SUD)](https://www.who.int/publications/i/item/9789240084063)                                                       |

## Abstinencia y riesgos médicos (solo «qué esperar», nunca protocolo)

| Tema                                      | Fuente                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Abstinencia de alcohol                    | [Cleveland Clinic — Alcohol Withdrawal](https://my.clevelandclinic.org/health/diseases/9247-alcohol-withdrawal)                                                                                                                                                                                               |
| Benzodiacepinas (riesgo, tapering médico) | [ASAM/APA Benzodiazepine Tapering Guideline (2025)](https://www.asam.org/quality-care/clinical-guidelines/benzodiazepine-tapering) · [FDA boxed warning](https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-fda-approves-label-changes-use-benzodiazepine-drug-class-boxed) |
| Opioides (MOUD, sobredosis, naloxona)     | [ASAM National Practice Guideline](https://www.asam.org/quality-care/clinical-guidelines/national-practice-guideline) · [SAMHSA Overdose Prevention Toolkit](https://www.samhsa.gov/substance-use/treatment/basic-steps/helping-someone)                                                                      |
| Estimulantes                              | [SAMHSA TIP 45 vía NCBI](https://www.ncbi.nlm.nih.gov/books/NBK576550/)                                                                                                                                                                                                                                       |
| Cannabis                                  | [UpToDate — Cannabis Withdrawal](https://www.uptodate.com/contents/cannabis-withdrawal-epidemiology-clinical-features-diagnosis-and-treatment)                                                                                                                                                                |
| Nicotina                                  | [Cleveland Clinic — Nicotine Withdrawal](https://my.clevelandclinic.org/health/diseases/21587-nicotine-withdrawal)                                                                                                                                                                                            |
| Abstinencia posaguda (PAWS)               | [SAMHSA TIP 45 — Protracted Withdrawal](https://library.samhsa.gov/sites/default/files/sma10-4554.pdf) · [JAGS review — windows and waves](https://www.sciencedirect.com/science/article/abs/pii/S1555415521005523)                                                                                           |

## Antojos y prevención de recaída

| Técnica                                  | Fuente                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Urge surfing                             | [Marlatt / Dartmouth Hitchcock handout](https://www.dartmouth-hitchcock.org/sites/default/files/2021-03/urge-surfing.pdf) |
| 4 Ds                                     | [LifeRing](https://lifering.org/)                                                                                         |
| HALT                                     | [NCBI Bookshelf / literatura de recuperación](https://www.ncbi.nlm.nih.gov/books/NBK601489/)                              |
| MBRP (RCT)                               | [Bowen et al., JAMA Psychiatry](https://pubmed.ncbi.nlm.nih.gov/24647726/)                                                |
| Respuesta de inmersión (frío en la cara) | [StatPearls — mammalian dive response](https://www.ncbi.nlm.nih.gov/books/NBK538245/)                                     |
| Intervenciones just-in-time              | [Addiction — JITAI systematic review](https://pubmed.ncbi.nlm.nih.gov/34514668/)                                          |
| Contingency management                   | [SAMHSA PEP24-06-001](https://library.samhsa.gov/sites/default/files/contingency-management-advisory-pep24-06-001.pdf)    |

## Rutas de recuperación (enlaces, no reproducción de textos)

[SMART](https://smartrecovery.org/smart-recovery-programs) · [HAMS](https://www.hams.cc/works) · [Moderation Management](https://moderation.org/getting-started-moderation-management/moderate-drinking-guidelines/) · [Recovery Dharma](https://recoverydharma.org/project/the-four-noble-truths/) · [AA (12 pasos)](https://www.aa.org/the-twelve-steps) · [LifeRing](https://lifering.org/)

## Marco del producto

| Tema                                    | Fuente                                                                                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dispositivo de bienestar de bajo riesgo | [FDA General Wellness guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices) |

## Cómo actualizar una fuente

1. Edita `src/content/sources.ts` (título, organización, URL).
2. Actualiza `docs/EVIDENCE.md`.
3. El componente `SourcesList` mostrará el cambio en todas las vistas que la usen.

Si una URL oficial cambia, prioriza el enlace permanente (guidelines PDF de SAMHSA/ASAM, páginas institucionales).
