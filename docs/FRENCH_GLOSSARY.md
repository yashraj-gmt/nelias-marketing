# NELIAS Marketing Portal - French Glossary and Style Guide

## 1. Fixed phrases (use EXACTLY)

| English                                                                                          | French                                                                                                             |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| One platform. Multiple industries. Your environment, automatically configured.                   | Une seule plateforme. Plusieurs secteurs. Votre environnement, configuré automatiquement.                          |
| Your business is unique. Your management platform should be too.                                 | Votre entreprise est unique. Votre plateforme de gestion devrait l’être aussi.                                     |
| Business Management Platform                                                                     | Plateforme de gestion d’entreprise                                                                                 |
| NELIAS - A product of Debass Technologies                                                        | NELIAS - Un produit de Debass Technologies                                                                         |
| NELIAS - A Business Management Platform by Debass Technologies.                                  | NELIAS - Une plateforme de gestion d’entreprise conçue par Debass Technologies.                                    |
| © 2026 NELIAS. All rights reserved.                                                              | © 2026 NELIAS. Tous droits réservés.                                                                               |
| Illustrative preview                                                                             | Aperçu illustratif                                                                                                 |
| Skip to main content                                                                             | Aller au contenu principal                                                                                         |
| Home / Why NELIAS / How It Works / Industries / Features / Pricing / Resources / About / Contact | Accueil / Pourquoi NELIAS / Fonctionnement / Secteurs / Fonctionnalités / Tarifs / Ressources / À propos / Contact |
| Sign In / Privacy Policy / Terms of Use                                                          | Se connecter / Politique de confidentialité / Conditions d’utilisation                                             |
| Configure My NELIAS                                                                              | Configurer mon NELIAS                                                                                              |
| Book a Demo                                                                                      | Réserver une démo                                                                                                  |
| Talk to an Advisor                                                                               | Parler à un conseiller                                                                                             |
| Contact Our Team                                                                                 | Contacter notre équipe                                                                                             |
| Request a Conversation                                                                           | Demander un échange                                                                                                |
| Explore How It Works                                                                             | Explorer le fonctionnement                                                                                         |
| Discover How It Works                                                                            | Découvrir comment ça marche                                                                                        |
| See How It Works                                                                                 | Voir comment ça marche                                                                                             |
| See How NELIAS Works                                                                             | Voir comment fonctionne NELIAS                                                                                     |
| Find the NELIAS configuration for your industry                                                  | Trouver la configuration NELIAS adaptée à votre secteur                                                            |
| See My Configuration                                                                             | Voir ma configuration                                                                                              |
| Explore Industries                                                                               | Explorer les secteurs                                                                                              |

## 2. Glossary (use consistently everywhere)

| English                                                                                                                                                                            | French                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Sector Engine                                                                                                                                                                      | Sector Engine (kept: product name) |
| Sector Pack: not used in V1; Industry+ packs are V2                                                                                                                                | -                                  |
| plan (pricing)                                                                                                                                                                     | formule                            |
| subscription                                                                                                                                                                       | abonnement                         |
| capacity                                                                                                                                                                           | capacité                           |
| capabilities, features                                                                                                                                                             | fonctionnalités                    |
| legal entity                                                                                                                                                                       | entité juridique                   |
| workspace                                                                                                                                                                          | espace de travail                  |
| add-on                                                                                                                                                                             | module complémentaire              |
| connector                                                                                                                                                                          | connecteur                         |
| configurator / configuration                                                                                                                                                       | configurateur / configuration      |
| onboarding (guided)                                                                                                                                                                | prise en main guidée               |
| dashboard                                                                                                                                                                          | tableau de bord                    |
| demo                                                                                                                                                                               | démo                               |
| quote                                                                                                                                                                              | devis                              |
| excluding tax                                                                                                                                                                      | hors taxes                         |
| storage                                                                                                                                                                            | stockage                           |
| users                                                                                                                                                                              | utilisateurs                       |
| use case                                                                                                                                                                           | cas d’usage                        |
| Plan names START, BUSINESS, PROFESSIONAL, ENTERPRISE                                                                                                                               | kept in English                    |
| NELIAS, Debass Technologies, FCFA, WhatsApp, e-mail addresses, phone numbers, URLs and the sample names "ABC Distribution", "yourcompany.nelias.app", "abcdistribution.nelias.app" | kept unchanged                     |

## 3. Translation rules

1. Translate EVERY value in every file of `locales/en/` into the matching `locales/fr/` file, with the exact same key structure, the same array lengths and order, and the same `{{placeholders}}` untouched. Never translate keys. No `fr` file may stay empty or contain English text, except the kept names above.
2. Use the formal "vous". Natural, professional business French suitable for Côte d’Ivoire and French-speaking Africa. Prefer a standard French term over an anglicism whenever one exists.
3. Sentence case for headings, buttons and labels (French does not capitalise every word); brand and plan names keep their capitals.
4. Use the typographic apostrophe ’ (never '), and « guillemets » with non-breaking spaces. Put a no-break space before `:`, `;`, `?`, `!` and `»` and after `«`. In JSON write these spaces as the escape `\u00A0` so formatters cannot change them.
5. Keep the meaning, register and legal caveats identical (for example "subject to sector-specific requirements" becomes "sous réserve des exigences propres au secteur"). Never add or remove a claim. Keep the end punctuation style of the English line.
6. Keep length close to the English where possible (French is often 15 to 30 percent longer; prefer the shorter natural wording for navigation, buttons, tabs and labels).
7. Namespace by namespace, translate: `common`, `seo`, `home`, `features`, `industries`, and every other file that exists in `locales/en/`. Do not skip any.
8. After translating, update the key counts in `docs/FRENCH_REVIEW.md`.
