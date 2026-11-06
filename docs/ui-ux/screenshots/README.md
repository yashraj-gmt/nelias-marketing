# NELIAS Marketing Portal - UI/UX Specification: Visual Verification Matrix

## 1. Overview

This directory serves as the repository for visual verification captures and multi-breakpoint visual regression artifacts.
Per Debass guidelines, screenshot image files are added manually or during dedicated visual testing sessions.

---

## 2. Naming Standard

All visual capture artifacts must follow this standardized naming pattern:

```
<page>_<lang>_<theme>_<width>.png
```

- `<page>`: Route slug (e.g. `home`, `why`, `how`, `industries`, `industry-detail`, `features`, `pricing`, `resources`, `about`, `contact`, `demo`, `configure`, `terms`, `404`).
- `<lang>`: Language code (`en` or `fr`).
- `<theme>`: Active theme mode (`light` or `dark`).
- `<width>`: Pixel width of viewport (`320`, `375`, `768`, `1024`, `1280`, `1920`).

_Example:_ `pricing_fr_dark_1280.png`

---

## 3. Required Capture Matrix

The standard manual verification run requires the following captures:

| Page                          | Route                             | Languages  | Themes          | Target Viewports      |
| ----------------------------- | --------------------------------- | ---------- | --------------- | --------------------- |
| Home                          | `/`                               | `en`, `fr` | `light`, `dark` | 320px, 768px, 1280px  |
| Why NELIAS                    | `/why-nelias`                     | `en`, `fr` | `light`, `dark` | 375px, 1024px, 1440px |
| How It Works                  | `/how-it-works`                   | `en`, `fr` | `light`, `dark` | 375px, 1024px, 1440px |
| Industries Hub                | `/industries`                     | `en`, `fr` | `light`, `dark` | 320px, 768px, 1280px  |
| Industry Detail (Retail)      | `/industries/retail-distribution` | `en`, `fr` | `light`, `dark` | 375px, 1024px, 1440px |
| Industry Detail (Pharmacies)  | `/industries/pharmacies`          | `en`, `fr` | `light`, `dark` | 375px, 1024px, 1440px |
| Features                      | `/features`                       | `en`, `fr` | `light`, `dark` | 320px, 768px, 1280px  |
| Pricing (Public Gate ON)      | `/pricing`                        | `en`, `fr` | `light`, `dark` | 375px, 1024px, 1440px |
| Pricing (Public Gate OFF)     | `/pricing`                        | `en`, `fr` | `light`, `dark` | 1280px                |
| Resources                     | `/resources`                      | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
| About Us                      | `/about`                          | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
| Contact                       | `/contact`                        | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
| Demo                          | `/demo`                           | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
| Configurator (Step 2 Quota)   | `/configure`                      | `en`, `fr` | `light`, `dark` | 375px, 1024px, 1440px |
| Configurator (Step 5 Summary) | `/configure`                      | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
| Legal Page (Terms of Use)     | `/terms`                          | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
| 404 Not Found                 | `/nonexistent-route`              | `en`, `fr` | `light`, `dark` | 375px, 1280px         |
