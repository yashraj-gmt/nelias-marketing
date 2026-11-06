# NELIAS Marketing Portal - UI/UX Specification: User Journeys

## 1. Journey 1: Sector Discovery Journey

_From broad exploration to sector-specific operational alignment and conversion._

```mermaid
flowchart TD
    A["Home Page (/)"] -->|"Click Sector Teaser or Nav"| B["Industries Hub (/industries)"]
    B -->|"Filter by Category / Search ?q="| C{"Sector Found?"}
    C -->|"No"| C1["Empty State: 'No industries found' + Reset button"]
    C1 -->|"Reset"| B
    C -->|"Yes"| D["Industry Detail (/industries/:slug)"]
    D -->|"Explore Challenges, Capabilities & Walkthrough"| E{"features.configurator active?"}
    E -->|"Yes"| F["Configurator (/configure?industry=slug)"]
    E -->|"No"| G["Demo Lead Form (/demo?industry=slug)"]
    F -->|"Pre-selects sector, recommends modules"| H["Complete Configuration"]
    G -->|"Pre-selects sector in form"| I["Advisor Conversation Scheduled"]
```

---

## 2. Journey 2: Self-Service Buying & Configuration Journey

_From curiosity to precise module selection, dynamic pricing, and advisor booking._

```mermaid
flowchart TD
    A["Home / Nav CTA"] --> B["Configurator Intro (/configure)"]
    B -->|"Start Configuration"| C["Step 1: Profile (Sector, Country, Size)"]
    C -->|"Next"| D["Step 2: Operations & Standard Modules"]
    D -->|"Pre-recommended modules displayed with quotas"| E["Select / Replace Standard Modules"]
    E -->|"Dynamic live recalculation"| F{"features.pricingPublic?"}
    F -->|"Yes"| G["Live Estimate shows Plan + 15,000 FCFA per extra module"]
    F -->|"No"| H["Live Estimate displays plan inclusions without amounts"]
    E -->|"Next"| I["Step 3: Recommendation (Capacity-first Plan)"]
    I -->|"Next"| J["Step 4: Customization (Modules, Add-ons, Users, Entities)"]
    J -->|"Next"| K["Step 5: Summary & Review"]
    K -->|"Save Draft"| L["Saved to localStorage (nelias-config-draft)"]
    K -->|"Share Configuration"| M["URL-safe Base64 link (?c=...) copied"]
    K -->|"Book a Demo CTA"| N["Demo Form (/demo?needs=mod1,mod2)"]
    N -->|"Modules pre-selected in needs checkboxes"| O["Lead Submitted Successfully"]
```

---

## 3. Journey 3: Pricing Evaluation to Configuration Journey

_From cost evaluation to tailored configuration._

```mermaid
flowchart TD
    A["Pricing Page (/pricing)"] --> B{"features.pricingPublic?"}
    B -->|"Yes"| C["Plan amounts visible (START, BUSINESS, PRO, ENTERPRISE) + Toggle Monthly/Annual"]
    B -->|"No"| D["'Pricing on request' displayed with plan structures & quotas"]
    C -->|"Click 'Configure <PLAN>'"| E{"features.configurator?"}
    D -->|"Click 'Talk to an Advisor'"| F["Demo Form (/demo)"]
    E -->|"Yes"| G["Configurator (/configure?plan=id&billing=cadence)"]
    E -->|"No"| F
    G -->|"Pre-selected plan & billing cadence"| H["Customize Capacity & Modules"]
```

---

## 4. Journey 4: Capability & Features Filtering Journey

_Deep capability review leading to sector alignment._

```mermaid
flowchart TD
    A["Features Page (/features)"] --> B["Capability Mosaic & 12 Feature Areas"]
    B -->|"Select Industry Pill Tab"| C["Filtered Capability Area List (?industry=slug)"]
    C -->|"Click Bottom Strip CTA"| D{"features.configurator?"}
    D -->|"Yes"| E["Configurator (/configure?industry=slug)"]
    D -->|"No"| F["Demo Form (/demo?industry=slug)"]
```

---

## 5. Journey 5: Lead Ingestion & Advisor Scheduling Journey

_Capturing prospects with validation, privacy, and zero fake submissions._

```mermaid
flowchart TD
    A["Contact (/contact) or Demo (/demo)"] --> B["LeadForm Component"]
    B -->|"Client validation on blur & submit"| C{"Inputs Valid?"}
    C -->|"No"| D["Accessible Error Summary + Focus Shift + Inline Messages"]
    D -->|"Correct inputs"| B
    C -->|"Yes"| E{"VITE_LEAD_ENDPOINT configured?"}
    E -->|"Yes"| F["POST JSON payload to endpoint"]
    F -->|"200 OK"| G["Success State: FormFeedback confirmation shown"]
    F -->|"Error / 500"| H["Error Alert: Polite message + mailto fallback"]
    E -->|"No"| I["Open mailto: client to site email + clear user notice"]
```

---

## 6. Journey 6: Sales Presentation Journey (Five-Minute Tour)

_Field execution guide for Debass sales advisors delivering high-impact executive demonstrations._

1. **Minute 1: The Vision & Brand Promise ([`HomePage`](file:///d:/Projects/NELIAS/nelias-marketing/src/pages/HomePage.jsx))**
   - Hero headline: _"Integrated business management. Built for your scale."_
   - Three Pillars: Unified Platform, Sector Intelligence, Pragmatic Adoption.
2. **Minute 2: Operational Proof & Scenarios ([`WhyNeliasPage`](file:///d:/Projects/NELIAS/nelias-marketing/src/pages/WhyNeliasPage.jsx))**
   - Five core African business challenges & NELIAS concrete responses.
3. **Minute 3: Sector Depth ([`IndustryDetailPage`](file:///d:/Projects/NELIAS/nelias-marketing/src/pages/IndustryDetailPage.jsx))`?slug=retail-distribution` or `pharmacies`**
   - Show pre-configured capability sets and the 5-node sector walkthrough.
4. **Minute 4: Interactive Architecture & Standard Modules ([`FeaturesPage`](file:///d:/Projects/NELIAS/nelias-marketing/src/pages/FeaturesPage.jsx))**
   - Filter capabilities by industry to demonstrate how the Sector Engine adapts standard modules.
5. **Minute 5: Commercial Clarity ([`ConfigurePage`](file:///d:/Projects/NELIAS/nelias-marketing/src/pages/ConfigurePage.jsx) or [`PricingPage`](file:///d:/Projects/NELIAS/nelias-marketing/src/pages/PricingPage.jsx))**
   - Choose a plan, demonstrate dynamic quota tracking (e.g. START 4 included + 1 extra = 64,000 FCFA/mo), and trigger the Book a Demo transition with pre-selected needs.

---

## 7. Error & Empty States Handling

1. **404 Page Not Found (`NotFoundPage`):**
   - Rendered when encountering unknown URLs (`*`) or invalid industry slugs (`/industries/invalid-slug`).
   - Clearly provides "Go to Home" primary button and "Book a Demo" / "Explore Platform" secondary button. No dead ends.
2. **Empty Search & Filters:**
   - Resources FAQ search: Displays _"No questions match your search."_ with a quick "Clear search" action.
   - Industries filter: Displays _"No industries match your selection."_ with an instant "Reset filters" button.
3. **Configurator Invalid Draft Link:**
   - Corrupted or invalid `?c=` strings trigger a fallback to the clean initial configurator state without crashing.
4. **Form Submission Failure:**
   - When the backend lead endpoint is unreachable or returns a 500 status, personal data is preserved in form fields, and an accessible alert provides immediate direct email and telephone contacts.
