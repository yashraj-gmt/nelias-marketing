# NELIAS Marketing Portal - UI/UX Specification: Open Decisions & Debass Backlog

## 1. Overview

This register catalogs all items marked `TODO(Debass)` across the codebase, grouped by functional domain and page, alongside terminology alignments that require client governance before final commercial release.

---

## 2. Terminology Alignment Register (Section 4F)

The following terms appear with minor variations across approved source documents (PDF specifications, commercial model notes, and UI microcopy). In accordance with Update D safety rules, these have been preserved without unauthorized copy changes:

| Concept                     | Primary Terms Used                                         | Context & Recommendation                                                                                                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Capabilities**       | "Standard Modules" / "Functions" / "Capability Areas"      | Client guidance in Update C favors **"Standard modules"** ("Modules standard") for commercial and configurator contexts, while the Features page uses "Capability areas" ("Domaines de compétences"). Recommend standardizing customer-facing UI on "Standard modules". |
| **Corporate Entities**      | "Legal entities" / "Companies" / "Sociétés"                | Pricing catalog uses "legal entities" (`legal-entity`), while user microcopy occasionally references "companies". Recommend standardizing on **"Legal entities"** ("Entités juridiques") for legal precision.                                                           |
| **Subscription Tiers**      | "Plan" / "Formule" / "Tier"                                | English uses "Plan" (START, BUSINESS, PROFESSIONAL, ENTERPRISE). French microcopy uses **"Formule"** to reflect local business software standards in Côte d'Ivoire and Francophone Africa.                                                                              |
| **Industry Configurations** | "Sector Engine" / "Sector Pack" / "Industry Configuration" | Update B removed paid "Sector Packs". The Sector Engine is included in every plan at no charge. Recommend consistently referring to the **"Sector Engine"** ("Moteur sectoriel") across all pages.                                                                      |
| **System Integrations**     | "Connectors" / "API & Connectors" / "Connecteurs"          | Standardized as **"Connectors"** ("Connecteurs") under optional charges.                                                                                                                                                                                                |

---

## 3. Exhaustive `TODO(Debass)` Log Grouped by Area

### 3.1 Global & Commercial Strategy

1. **`src/data/pricing-catalog.js` (lines 1-2):**
   - Approval of internal commercial reference figures for public publication (`approvedForPublic: false`).
   - Confirmation that storage extension pricing remains unquoted until approved.
2. **`src/data/modules.js` (line 1):**
   - Confirmation of which capability areas constitute standard modules and any sector compatibility restrictions.
3. **`src/data/feature-states.js` (line 1):**
   - Confirmation of commercial readiness for each capability area (currently all set to placeholder `demo-only`).
4. **`src/lib/configurator/modules.js` (line 1):**
   - Formal rules for the Sector Engine Matrix (current recommendation order is derived from relevance order in `industry-areas.js`).

### 3.2 Home Page

1. **`src/sections/home/HomeHero.jsx` (line 10):**
   - Hero subheadline and secondary CTA conflict between PDF Section 3 and V3 notes. Section 3 is currently used.
2. **`src/sections/home/HomeFinalCta.jsx` (line 9):**
   - Conflict between PDF Section 3 ("Build the right environment…") and V3 final ("A better way to manage starts here."). Section 3 is currently used.
3. **`src/sections/home/IndustrySelectorSection.jsx` (line 16):**
   - Sector benefits and suggested capability chips are derived from summary nouns and need formal Debass validation.
4. **`src/sections/home/ProductPreviewMock.jsx` (line 3):**
   - Placeholder interface preview requires validated production software screenshots.
5. **`src/sections/home/ScenarioSection.jsx` (line 7):**
   - PDF supplies no specific business-impact metrics for the three scenarios; currently uses approved challenge/response pairs.

### 3.3 Why NELIAS & How It Works

1. **`src/sections/why/ChallengesSection.jsx` (line 27):**
   - Confirmation whether "Challenges and benefits" is intended as a visible customer-facing headline.
2. **`src/sections/why/DifferentiatorSection.jsx` (line 28):**
   - Grammatical awkwardness in approved English differentiator sentence ("helps to understand … and help streamline").
3. **`src/sections/how/JourneyTimeline.jsx` (line 9):**
   - Home shows a 4-step journey while How It Works shows 6 approved steps. Confirm alignment.
4. **`src/sections/how/JourneyTimeline.jsx` (line 10):**
   - Self-service activation wording in steps 4 and 5 prior to automated checkout availability.

### 3.4 Industries Pages

1. **`src/data/industry-areas.js` (line 1):**
   - Area relevance order per sector is derived from summary words; confirm alignment with the Sector Engine Matrix.
2. **`src/sections/industries/CapabilityList.jsx` (lines 12-13):**
   - Capability mapping per sector derived from summary nouns. Availability badges show `demo-only` until confirmed.
3. **`src/sections/industries/WalkthroughChain.jsx` (line 11):**
   - 5-node operational walkthrough text derived from summary nouns (except Retail).
4. **`src/pages/IndustryDetailPage.jsx` (line 28):**
   - Benefit-led headlines missing for sectors without explicit headline copy; sector name is used as fallback.
5. **`src/pages/IndustryDetailPage.jsx` (line 31):**
   - SEO metadata for industry pages derived from summary; confirm targeted sector keywords.

### 3.5 Features Page

1. **`src/sections/features/FeaturesClosing.jsx` (line 7):**
   - PDF gives no closing headline for the Features page strip.
2. **`src/sections/features/FeatureList.jsx` (lines 11-12):**
   - Capability availability states set to `demo-only` until confirmed.
3. **`src/sections/features/FeatureFilterList.jsx` (line 68):**
   - Typo in approved source PDF ("usagebased" missing hyphen; rendered as "usage-based").

### 3.6 Pricing Page

1. **`src/sections/pricing/PlansSection.jsx` (line 10):**
   - Annual billing equals 10 paid months for 12 months service marked "subject to final validation" in V3 notes.
2. **`src/sections/pricing/PlansSection.jsx` (line 79):**
   - Microcopy explaining free standard module replacement within plan quota.
3. **`src/sections/pricing/PlanCard.jsx` (line 10):**
   - Destination for Enterprise "Talk to an Expert" set to `/contact`.
4. **`src/sections/pricing/PlanCard.jsx` (line 11):**
   - "Pricing on request" placeholder wording when `features.pricingPublic` is false.
5. **`src/sections/pricing/CompareSection.jsx` (line 11):**
   - Labels "Compare plans" and "Optional charges" derived from V3 notes.
6. **`src/sections/pricing/PricingFaq.jsx` (line 8):**
   - Selection of which FAQ answers belong on the Pricing page.
7. **`src/sections/pricing/PricingClosing.jsx` (line 7):**
   - Missing closing headline text in PDF Section 8.

### 3.7 Resources & About Pages

1. **`src/sections/resources/ResourcesFaq.jsx` (line 4):**
   - Alignment between hosting FAQ answer ("being planned…") and definitive Terms of Use Article 10 statements.
2. **`src/sections/resources/ResourcesClosing.jsx` (line 5):**
   - Missing closing headline for Resources conversion strip.
3. **`src/sections/about/VisionSection.jsx` (line 9):**
   - "Leading business management platform" vision statement confirmation under advertising compliance rules.
4. **`src/sections/about/AnswerSection.jsx` (line 9):**
   - French AI-drafted translation review ("scalable" rendered as "évolutive").
5. **`src/sections/about/AboutClosing.jsx` (lines 9-10):**
   - Closing signature wording ("automatically" vs "automatically configured").

### 3.8 Contact, Demo & Configurator

1. **`src/sections/contact/LeadForm.jsx` (line 243):**
   - Consent wording is a provisional placeholder requiring validation by legal counsel under Côte d'Ivoire law.
2. **`src/sections/contact/LeadForm.jsx` (line 285):**
   - Destination for secondary "Explore NELIAS" button set to `/how-it-works`.
3. **`src/sections/contact/FormFeedback.jsx` (line 6):**
   - Confirmation of form success confirmation wording and response time promises.
4. **`src/sections/configurator/ConfiguratorApp.jsx` (line 19):**
   - SEO metadata for Configurator page derived from approved helper text.
5. **`src/sections/configurator/EstimatePanel.jsx` (line 180):**
   - Annual billing treatment for additional standard modules (assumed monthly alongside options).
6. **`src/sections/configurator/ModuleSelector.jsx` (line 1):**
   - Customer-facing term confirmation ("standard modules" vs "functions").
7. **`src/sections/configurator/StepOperations.jsx` (line 8):**
   - V3 notes mention "teams and priorities" without approved copy; omitted from V1.
8. **`src/sections/configurator/StepSummary.jsx` (line 14):**
   - Legal disclaimer sentence approval on configuration summary.
9. **`src/sections/configurator/StepSummary.jsx` (line 15):**
   - Online checkout / self-service activation journey is omitted from V1 until backend provisioning exists.

### 3.9 Legal Documentation

1. **`src/pages/TermsPage.jsx` (lines 3-6):**
   - SEO metadata derived from document headers.
   - Hosting fact alignment between Terms Article 10 and marketing FAQ.
   - Two contact addresses (`info@debasstechnologies.com` and `contact@nelias.app`).
2. **`src/pages/TermsOfSalePage.jsx`, `DpaPage.jsx`, `PrivacyPage.jsx`, `SlaPage.jsx`:**
   - Formal legal review of returned data, liability limits, and sub-processor lists before commercial launch.
