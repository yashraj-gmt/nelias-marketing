import os
import json
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Brand Palette Constants
NAVY = RGBColor(0x0F, 0x17, 0x2A)      # #0F172A - Headings, Primary Brand
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary Accent / CTA / Featured
AZURE = RGBColor(0x02, 0x84, 0xC7)     # #0284C7 - Secondary links, Badges, Subheadings
SLATE = RGBColor(0x47, 0x55, 0x69)     # #475569 - Secondary text, Subtitles, Meta
INK = RGBColor(0x1E, 0x29, 0x3B)       # #1E293B - Primary Body Text
WHITE = RGBColor(0xFF, 0xFF, 0xFF)     # #FFFFFF

HEX_NAVY = "0F172A"
HEX_ORANGE = "EA580C"
HEX_AZURE = "0284C7"
HEX_LIGHT_BG = "F8FAFC"
HEX_BORDER = "CBD5E1"
HEX_MUTED_BG = "F1F5F9"
HEX_ACCENT_SOFT = "FFF7ED"
HEX_WHITE = "FFFFFF"

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_callout_border(cell, color_hex=HEX_ORANGE, sz="36"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def set_card_borders(cell, color_hex=HEX_BORDER, sz="6"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>'
        f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>'
        f'<w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>'
        f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def set_table_borders(table, color=HEX_BORDER, sz="4"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_callout(doc, text, label=None, border_color=HEX_ORANGE, bg_color=HEX_LIGHT_BG):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, bg_color)
    set_callout_border(cell, border_color, "36")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    if label:
        run_lbl = p.add_run(f"{label}\n")
        run_lbl.bold = True
        run_lbl.font.color.rgb = NAVY
        run_lbl.font.size = Pt(10)
    
    run_txt = p.add_run(text)
    run_txt.font.size = Pt(10)
    run_txt.font.color.rgb = INK
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def format_row(row, is_header=False, bg_color=None, text_align=WD_ALIGN_PARAGRAPH.LEFT):
    for cell in row.cells:
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        set_cell_margins(cell, top=110, bottom=110, left=140, right=140)
        if bg_color:
            set_cell_background(cell, bg_color)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.alignment = text_align
            for r in p.runs:
                if is_header:
                    r.bold = True
                    r.font.color.rgb = WHITE
                    r.font.size = Pt(9.5)
                else:
                    r.font.size = Pt(9.5)
                    r.font.color.rgb = INK

def add_heading_1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(15.5)
    r.font.color.rgb = NAVY
    return h

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(12)
    r.font.color.rgb = AZURE
    return h

def add_heading_3(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(10.5)
    r.font.color.rgb = NAVY
    return h

def add_meta_item(doc, label, en_text, fr_text=None, element_type=None, link_url=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    # Label
    r_lbl = p.add_run(f"• {label}: ")
    r_lbl.bold = True
    r_lbl.font.color.rgb = NAVY
    r_lbl.font.size = Pt(10)
    
    # EN Text
    r_en = p.add_run(f"\"{en_text}\"")
    r_en.font.color.rgb = INK
    r_en.font.size = Pt(10)
    
    # FR Text
    if fr_text and fr_text != en_text:
        r_fr_tag = p.add_run(" | [FR]: ")
        r_fr_tag.font.color.rgb = SLATE
        r_fr_tag.font.size = Pt(9.5)
        r_fr = p.add_run(f"\"{fr_text}\"")
        r_fr.font.color.rgb = INK
        r_fr.font.size = Pt(9.5)
        
    # Element Details
    if element_type or link_url:
        meta_parts = []
        if element_type:
            meta_parts.append(element_type)
        if link_url:
            meta_parts.append(f"Target: {link_url}")
        tag_str = f" [{', '.join(meta_parts)}]"
        r_tag = p.add_run(tag_str)
        r_tag.font.color.rgb = AZURE
        r_tag.font.size = Pt(9)
        r_tag.bold = True

def add_plan_card(doc, plan_name, audience_en, audience_fr, monthly_price_en, monthly_price_fr, 
                  annual_price_en, annual_price_fr, modules_val, users_val, entities_val, 
                  storage_val_en, storage_val_fr, engine_val_en, engine_val_fr, level_val_en, level_val_fr,
                  included_en, included_fr, cta_en, cta_fr, cta_url, is_featured=False):
    
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    
    border_color = HEX_ORANGE if is_featured else HEX_BORDER
    bg_color = HEX_ACCENT_SOFT if is_featured else HEX_LIGHT_BG
    set_cell_background(cell, bg_color)
    set_card_borders(cell, border_color, "16" if is_featured else "8")
    set_cell_margins(cell, top=160, bottom=160, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    
    if is_featured:
        r_badge = p.add_run("[★ RECOMMENDED PLAN / FORMULE RECOMMANDÉE]\n")
        r_badge.bold = True
        r_badge.font.size = Pt(10)
        r_badge.font.color.rgb = ORANGE
        
    r_title = p.add_run(f"PLAN: {plan_name}\n")
    r_title.bold = True
    r_title.font.size = Pt(14)
    r_title.font.color.rgb = NAVY
    
    r_aud = p.add_run(f"Target Audience: \"{audience_en}\" | [FR]: \"{audience_fr}\"\n\n")
    r_aud.font.size = Pt(10)
    r_aud.font.color.rgb = SLATE
    
    # Pricing info
    r_pr_lbl = p.add_run("Commercial Pricing:\n")
    r_pr_lbl.bold = True
    r_pr_lbl.font.size = Pt(10)
    r_pr_lbl.font.color.rgb = NAVY
    
    p.add_run(f"  • Monthly Rate: {monthly_price_en} / month · excl. tax | [FR]: {monthly_price_fr} / mois · hors taxes\n")
    p.add_run(f"  • Annual Rate: {annual_price_en} / year · excl. tax | [FR]: {annual_price_fr} / an · hors taxes\n\n")
    
    # Specifications
    r_spec_lbl = p.add_run("Included Capacity & Platform Specifications:\n")
    r_spec_lbl.bold = True
    r_spec_lbl.font.size = Pt(10)
    r_spec_lbl.font.color.rgb = NAVY
    
    p.add_run(f"  • Standard Modules: {modules_val}\n")
    p.add_run(f"  • Included Users: {users_val}\n")
    p.add_run(f"  • Legal Entities: {entities_val}\n")
    p.add_run(f"  • Included Storage: {storage_val_en} | [FR]: {storage_val_fr}\n")
    p.add_run(f"  • Sector Engine: {engine_val_en} | [FR]: {engine_val_fr}\n")
    p.add_run(f"  • Service Level Commitment: {level_val_en} | [FR]: {level_val_fr}\n\n")
    
    # Key Value Inclusions
    if included_en:
        r_inc_lbl = p.add_run("Core Highlights & Value Inclusions:\n")
        r_inc_lbl.bold = True
        r_inc_lbl.font.size = Pt(10)
        r_inc_lbl.font.color.rgb = NAVY
        for inc_e, inc_f in zip(included_en, included_fr):
            p.add_run(f"  - {inc_e} | [FR]: {inc_f}\n")
        p.add_run("\n")
        
    # CTA Button
    r_cta_lbl = p.add_run("Action Call-to-Action:\n")
    r_cta_lbl.bold = True
    r_cta_lbl.font.size = Pt(10)
    r_cta_lbl.font.color.rgb = NAVY
    
    cta_line = p.add_run(f"  • Button Label: \"{cta_en}\" | [FR]: \"{cta_fr}\" [Link Target: {cta_url}]\n")
    cta_line.font.size = Pt(10)
    cta_line.font.color.rgb = AZURE
    cta_line.bold = True
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(6)

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    def load_json(rel_path):
        with open(os.path.join(base_dir, rel_path), "r", encoding="utf-8") as f:
            return json.load(f)
            
    en_pricing = load_json("src/i18n/locales/en/pricing.json")
    fr_pricing = load_json("src/i18n/locales/fr/pricing.json")
    en_home = load_json("src/i18n/locales/en/home.json")
    fr_home = load_json("src/i18n/locales/fr/home.json")
    en_common = load_json("src/i18n/locales/en/common.json")
    fr_common = load_json("src/i18n/locales/fr/common.json")
    en_seo = load_json("src/i18n/locales/en/seo.json")
    fr_seo = load_json("src/i18n/locales/fr/seo.json")

    doc = Document()
    
    # 1-inch margins
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # Base typography
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(10.5)
    style_normal.font.color.rgb = INK

    # =========================================================================
    # DOCUMENT HEADER / TITLE BLOCK
    # =========================================================================
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("NELIAS Marketing Portal - Pricing Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Components, Locales, Data Catalogs & Layouts)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    # Overview Metadata Box
    add_callout(
        doc,
        "Document Purpose: Exhaustive reference of all existing content for the NELIAS Pricing Page, rendered in original visual order. Preserves exact wording, spelling, punctuation, capitalization, numbers, currencies (FCFA), and formatting directly from source code.\n"
        "• Target URL: https://nelias.app/pricing (Route: /pricing)\n"
        "• Source Files: src/pages/PricingPage.jsx, src/sections/pricing/*, src/data/pricing-catalog.js, src/data/home-pricing.js, src/i18n/locales/*/pricing.json, src/i18n/locales/*/home.json, src/i18n/locales/*/seo.json, src/components/layout/*\n"
        "• Primary Language: English (EN) | Complete Bilingual Translations: French (FR)\n"
        "• Publisher & Platform: NELIAS Business Management Platform (Debass Technologies, Abidjan, Côte d'Ivoire)\n"
        "• Commercial Basis: FCFA (XOF), excluding taxes (HT); Annual billing reflects 12 months for the price of 10 months.",
        label="DOCUMENT OVERVIEW & AUDIT METADATA:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 1: PAGE-LEVEL METADATA & SEO
    # =========================================================================
    add_heading_1(doc, "1. Page-Level Metadata & SEO")
    p_seo_intro = doc.add_paragraph("Extracted from src/pages/PricingPage.jsx, src/components/common/Seo.jsx, and src/i18n/locales/*/seo.json:")
    p_seo_intro.paragraph_format.space_after = Pt(4)

    add_meta_item(doc, "SEO Page Title", en_seo["pricing"]["title"], fr_seo["pricing"]["title"], element_type="<title> tag")
    add_meta_item(doc, "Meta Description", en_seo["pricing"]["description"], fr_seo["pricing"]["description"], element_type="meta[name='description']")
    add_meta_item(doc, "Canonical URL", "https://nelias.app/pricing", element_type="link[rel='canonical']")
    add_meta_item(doc, "OpenGraph Title", en_seo["pricing"]["title"], fr_seo["pricing"]["title"], element_type="meta[property='og:title']")
    add_meta_item(doc, "OpenGraph Description", en_seo["pricing"]["description"], fr_seo["pricing"]["description"], element_type="meta[property='og:description']")
    add_meta_item(doc, "OpenGraph Type", "website", element_type="meta[property='og:type']")
    add_meta_item(doc, "OpenGraph Site Name", "NELIAS", element_type="meta[property='og:site_name']")
    add_meta_item(doc, "OpenGraph Locale", "en_US | [FR]: fr_FR", element_type="meta[property='og:locale']")
    add_meta_item(doc, "Twitter Card Type", "summary", element_type="meta[name='twitter:card']")
    add_meta_item(doc, "Page Analytics Tracking Event", "pricing_view", element_type="lib/analytics.js (EVENTS.PRICING_VIEW)")

    # =========================================================================
    # SECTION 2: GLOBAL HEADER & NAVIGATION
    # =========================================================================
    add_heading_1(doc, "2. Global Header, Utility Bar & Navigation")
    doc.add_paragraph("Persistent top navigation rendered on the Pricing Page via RootLayout.jsx, UtilityBar.jsx, and Header.jsx:")

    add_heading_2(doc, "2.1 Top Utility Bar (Desktop xl+)")
    add_meta_item(doc, "Contact Email Channel", "contact@nelias.app", element_type="Text Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Contact Phone Channel", "+225 05 64 05 90 60", element_type="Text Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "Theme Toggle Label", en_common["theme"]["darkMode"], fr_common["theme"]["darkMode"], element_type="Toggle Control")
    add_meta_item(doc, "Language Switcher Options", "English / Français (EN / FR)", element_type="Language Toggle")
    add_meta_item(doc, "Utility Contact Link", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Navigation Link", link_url="/contact")
    add_meta_item(doc, "Sign In Link", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="External Link", link_url="https://login.nelias.app")

    add_heading_2(doc, "2.2 Main Header Navigation Bar")
    add_meta_item(doc, "Brand Logo", "NELIAS", element_type="Brand Link", link_url="/")
    add_meta_item(doc, "Logo Accessible Label", en_common["header"]["homeLink"], fr_common["header"]["homeLink"], element_type="aria-label")
    add_meta_item(doc, "Nav Item 1", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Header Nav Link", link_url="/about")
    add_meta_item(doc, "Nav Item 2", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Header Nav Link", link_url="/industries")
    add_meta_item(doc, "Nav Item 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Header Nav Link", link_url="/features")
    add_meta_item(doc, "Nav Item 4 (Active Page)", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Header Nav Link (aria-current='page')", link_url="/pricing")
    add_meta_item(doc, "Header Primary CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button", link_url="/demo")
    add_meta_item(doc, "Mobile Menu Trigger", en_common["a11y"]["openMenu"], fr_common["a11y"]["openMenu"], element_type="Hamburger Button")

    # =========================================================================
    # SECTION 3: PRICING HERO & INTRO HEADER
    # =========================================================================
    add_heading_1(doc, "3. Pricing Hero Header (PageHeader.jsx)")
    doc.add_paragraph("The hero header sets the commercial tone and transparent pricing philosophy of the platform:")

    add_meta_item(doc, "Hero Headline (H1)", en_pricing["hero"]["title"], fr_pricing["hero"]["title"], element_type="Main Headline (H1)")
    add_meta_item(doc, "Hero Subtitle / Lead", en_pricing["hero"]["lead"], fr_pricing["hero"]["lead"], element_type="Lead Paragraph")
    add_meta_item(doc, "Hero Action Button", en_common["cta"]["simulatePrice"], fr_common["cta"]["simulatePrice"], element_type="Primary Button (Orange)", link_url="/configure")
    add_meta_item(doc, "Visual Background Tone", "tint", element_type="Section Tone")

    add_callout(
        doc,
        f"[EN]: \"{en_pricing['hero']['lead']}\"\n"
        f"[FR]: \"{fr_pricing['hero']['lead']}\"",
        label="CORE PRICING PRINCIPLE / REASSURANCE STATEMENT:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 4: PLANS SECTION & BILLING CONTROLS
    # =========================================================================
    add_heading_1(doc, "4. Plans Section, Billing Cadence & Plan Cards (PlansSection.jsx & PlanCard.jsx)")
    doc.add_paragraph("Displays the four subscription tiers, interactive monthly/annual billing period segmented control, and detailed capability cards:")

    add_heading_2(doc, "4.1 Billing Controls & Commercial Rules")
    add_meta_item(doc, "Section Title (Accessible)", en_pricing["page"]["plansTitle"], fr_pricing["page"]["plansTitle"], element_type="Accessible Section Heading (H2)")
    add_meta_item(doc, "Billing Period Selector Label", en_pricing["page"]["billingLabel"], fr_pricing["page"]["billingLabel"], element_type="Segmented Control Label")
    add_meta_item(doc, "Monthly Option Label", en_pricing["page"]["monthly"], fr_pricing["page"]["monthly"], element_type="Segmented Option (Default)")
    add_meta_item(doc, "Annual Option Label", en_pricing["page"]["annual"], fr_pricing["page"]["annual"], element_type="Segmented Option")
    
    en_announce_mo = en_pricing["page"]["announce"].replace("{{period}}", en_pricing["page"]["periodMonthly"])
    fr_announce_mo = fr_pricing["page"]["announce"].replace("{{period}}", fr_pricing["page"]["periodMonthly"])
    add_meta_item(doc, "Live Announcer (Monthly)", en_announce_mo, fr_announce_mo, element_type="aria-live polite announcement")
    
    en_announce_an = en_pricing["page"]["announce"].replace("{{period}}", en_pricing["page"]["periodAnnual"])
    fr_announce_an = fr_pricing["page"]["announce"].replace("{{period}}", fr_pricing["page"]["periodAnnual"])
    add_meta_item(doc, "Live Announcer (Annual)", en_announce_an, fr_announce_an, element_type="aria-live polite announcement")

    add_callout(
        doc,
        f"[EN]: {en_pricing['page']['annualNote']}\n"
        f"[FR]: {fr_pricing['page']['annualNote']}",
        label="ANNUAL SUBSCRIPTION COMMERCIAL DISCOUNT POLICY:",
        border_color=HEX_ORANGE
    )

    add_callout(
        doc,
        f"[EN]: {en_pricing['page']['modulesNote']}\n"
        f"[FR]: {fr_pricing['page']['modulesNote']}",
        label="STANDARD MODULES INCLUSION & REPLACEMENT POLICY:",
        border_color=HEX_AZURE
    )

    add_heading_2(doc, "4.2 Plan Specifications: 4 Individual Plan Cards")

    # 1. START
    add_plan_card(
        doc,
        plan_name="START",
        audience_en=en_home["pricing"]["table"]["for"]["start"],
        audience_fr=fr_home["pricing"]["table"]["for"]["start"],
        monthly_price_en="49,000 FCFA",
        monthly_price_fr="49 000 FCFA",
        annual_price_en="490,000 FCFA",
        annual_price_fr="490 000 FCFA",
        modules_val="4",
        users_val="5",
        entities_val="1",
        storage_val_en="10 GB",
        storage_val_fr="10 Go",
        engine_val_en="Included",
        engine_val_fr="Inclus",
        level_val_en=en_home["pricing"]["table"]["levels"]["start"],
        level_val_fr=fr_home["pricing"]["table"]["levels"]["start"],
        included_en=en_pricing["plans"]["start"]["included"],
        included_fr=fr_pricing["plans"]["start"]["included"],
        cta_en=en_common["cta"]["configure"],
        cta_fr=fr_common["cta"]["configure"],
        cta_url="https://login.nelias.app/ (aria-label: \"Configure START\" / \"Configurer START\")",
        is_featured=False
    )

    # 2. BUSINESS
    add_plan_card(
        doc,
        plan_name="BUSINESS",
        audience_en=en_home["pricing"]["table"]["for"]["business"],
        audience_fr=fr_home["pricing"]["table"]["for"]["business"],
        monthly_price_en="129,000 FCFA",
        monthly_price_fr="129 000 FCFA",
        annual_price_en="1,290,000 FCFA",
        annual_price_fr="1 290 000 FCFA",
        modules_val="6",
        users_val="15",
        entities_val="1",
        storage_val_en="25 GB",
        storage_val_fr="25 Go",
        engine_val_en="Included",
        engine_val_fr="Inclus",
        level_val_en=en_home["pricing"]["table"]["levels"]["business"],
        level_val_fr=fr_home["pricing"]["table"]["levels"]["business"],
        included_en=en_pricing["plans"]["business"]["included"],
        included_fr=fr_pricing["plans"]["business"]["included"],
        cta_en=en_common["cta"]["configure"],
        cta_fr=fr_common["cta"]["configure"],
        cta_url="https://login.nelias.app/ (aria-label: \"Configure BUSINESS\" / \"Configurer BUSINESS\")",
        is_featured=True
    )

    # 3. PROFESSIONAL
    add_plan_card(
        doc,
        plan_name="PROFESSIONAL",
        audience_en=en_home["pricing"]["table"]["for"]["professional"],
        audience_fr=fr_home["pricing"]["table"]["for"]["professional"],
        monthly_price_en="249,000 FCFA",
        monthly_price_fr="249 000 FCFA",
        annual_price_en="2,490,000 FCFA",
        annual_price_fr="2 490 000 FCFA",
        modules_val="8",
        users_val="40",
        entities_val="2",
        storage_val_en="50 GB",
        storage_val_fr="50 Go",
        engine_val_en="Included",
        engine_val_fr="Inclus",
        level_val_en=en_home["pricing"]["table"]["levels"]["professional"],
        level_val_fr=fr_home["pricing"]["table"]["levels"]["professional"],
        included_en=en_pricing["plans"]["professional"]["included"],
        included_fr=fr_pricing["plans"]["professional"]["included"],
        cta_en=en_common["cta"]["configure"],
        cta_fr=fr_common["cta"]["configure"],
        cta_url="https://login.nelias.app/ (aria-label: \"Configure PROFESSIONAL\" / \"Configurer PROFESSIONAL\")",
        is_featured=False
    )

    # 4. ENTERPRISE
    add_plan_card(
        doc,
        plan_name="ENTERPRISE",
        audience_en=en_home["pricing"]["table"]["for"]["enterprise"],
        audience_fr=fr_home["pricing"]["table"]["for"]["enterprise"],
        monthly_price_en="On quote (Sur devis)",
        monthly_price_fr="Sur devis",
        annual_price_en="On quote (Sur devis)",
        annual_price_fr="Sur devis",
        modules_val=f"{en_home['pricing']['table']['asNeeded']} | [FR]: {fr_home['pricing']['table']['asNeeded']}",
        users_val=f"{en_home['pricing']['table']['asNeeded']} | [FR]: {fr_home['pricing']['table']['asNeeded']}",
        entities_val=f"{en_home['pricing']['table']['multiEntity']} | [FR]: {fr_home['pricing']['table']['multiEntity']}",
        storage_val_en=en_home["pricing"]["table"]["sizedToNeed"],
        storage_val_fr=fr_home["pricing"]["table"]["sizedToNeed"],
        engine_val_en="Included",
        engine_val_fr="Inclus",
        level_val_en=en_home["pricing"]["table"]["levels"]["enterprise"],
        level_val_fr=fr_home["pricing"]["table"]["levels"]["enterprise"],
        included_en=en_pricing["plans"]["enterprise"]["included"],
        included_fr=fr_pricing["plans"]["enterprise"]["included"],
        cta_en=en_common["cta"]["talkToExpert"],
        cta_fr=fr_common["cta"]["talkToExpert"],
        cta_url="/contact",
        is_featured=False
    )

    # =========================================================================
    # SECTION 5: SUBSCRIPTION GROWTH & MODULAR EXTENSIONS
    # =========================================================================
    add_heading_1(doc, "5. Subscription Growth & Modular Extensions (ExtensionsSection.jsx)")
    doc.add_paragraph("Displays the unit pricing for scaling platform capacity, users, legal entities, and modules, alongside an interactive math breakdown:")

    add_heading_2(doc, "5.1 Extensions Catalog Table")
    add_meta_item(doc, "Section Heading (H2)", en_pricing["grow"]["title"], fr_pricing["grow"]["title"], element_type="Section Heading (H2)")

    tbl_ext = doc.add_table(rows=1, cols=4)
    tbl_ext.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_ext)
    hdr_ext = tbl_ext.rows[0]
    hdr_ext.cells[0].paragraphs[0].add_run("Item ID")
    hdr_ext.cells[1].paragraphs[0].add_run("Extension (English)")
    hdr_ext.cells[2].paragraphs[0].add_run("Extension (French)")
    hdr_ext.cells[3].paragraphs[0].add_run("Monthly Price excl. VAT")
    format_row(hdr_ext, is_header=True, bg_color=HEX_NAVY)

    ext_data = [
        ("module", en_pricing["grow"]["items"]["module"]["label"], fr_pricing["grow"]["items"]["module"]["label"], "15,000 FCFA per module | [FR]: 15 000 FCFA par module"),
        ("user", en_pricing["grow"]["items"]["user"]["label"], fr_pricing["grow"]["items"]["user"]["label"], "5,000 FCFA | [FR]: 5 000 FCFA"),
        ("users5", en_pricing["grow"]["items"]["users5"]["label"], fr_pricing["grow"]["items"]["users5"]["label"], "20,000 FCFA | [FR]: 20 000 FCFA"),
        ("users10", en_pricing["grow"]["items"]["users10"]["label"], fr_pricing["grow"]["items"]["users10"]["label"], "35,000 FCFA | [FR]: 35 000 FCFA"),
        ("entity", en_pricing["grow"]["items"]["entity"]["label"], fr_pricing["grow"]["items"]["entity"]["label"], "25,000 FCFA | [FR]: 25 000 FCFA"),
        ("pack", en_pricing["grow"]["items"]["pack"]["label"], fr_pricing["grow"]["items"]["pack"]["label"], "50,000 FCFA per pack | [FR]: 50 000 FCFA par pack"),
        ("storage", en_pricing["grow"]["items"]["storage"]["label"], fr_pricing["grow"]["items"]["storage"]["label"], f"{en_pricing['grow']['items']['storage']['value']} | [FR]: {fr_pricing['grow']['items']['storage']['value']}"),
        ("addons", en_pricing["grow"]["items"]["addons"]["label"], fr_pricing["grow"]["items"]["addons"]["label"], f"{en_pricing['grow']['items']['addons']['value']} | [FR]: {fr_pricing['grow']['items']['addons']['value']}"),
    ]
    for idx, (e_id, e_lbl_en, e_lbl_fr, e_val) in enumerate(ext_data):
        row = tbl_ext.add_row()
        row.cells[0].paragraphs[0].add_run(e_id)
        row.cells[1].paragraphs[0].add_run(e_lbl_en)
        row.cells[2].paragraphs[0].add_run(e_lbl_fr)
        row.cells[3].paragraphs[0].add_run(e_val)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.2 Dynamic Calculation Showcase & Mathematical Transparency")
    doc.add_paragraph("Interactive visual card showing step-by-step price composition for subscription growth:")

    add_meta_item(doc, "Showcase Title", "START + 1 Standard modules included", "START + 1 Modules standard inclus", element_type="Card Headline (H3)")
    add_meta_item(doc, "Base Plan Component", "START (4 mod.): 49,000 FCFA", "START (4 mod.) : 49 000 FCFA", element_type="Math Component 1")
    add_meta_item(doc, "Modular Add-on Component", "+1 mod.: 15,000 FCFA", "+1 mod. : 15 000 FCFA", element_type="Math Component 2")
    add_meta_item(doc, "Total Monthly Calculation", "Total / mo: 64,000 FCFA", "Total / mois : 64 000 FCFA", element_type="Math Total")

    en_grow_ex = en_pricing["grow"]["example"].replace("{{base}}", "49,000").replace("{{extra}}", "15,000").replace("{{total}}", "64,000 FCFA")
    fr_grow_ex = fr_pricing["grow"]["example"].replace("{{base}}", "49 000").replace("{{extra}}", "15 000").replace("{{total}}", "64 000 FCFA")
    add_callout(
        doc,
        f"[EN]: {en_grow_ex}\n\n"
        f"[FR]: {fr_grow_ex}",
        label="PRICING CALCULATION & FAIRNESS COMMITMENT NOTE:",
        border_color=HEX_ORANGE
    )

    add_heading_2(doc, "5.3 Professional Project & Legal Consultation Callout")
    add_callout(
        doc,
        f"[EN]: {en_home['pricing']['legal']}\n\n"
        f"[FR]: {fr_home['pricing']['legal']}",
        label="LEGAL & IMPLEMENTATION SERVICES CALLOUT (Info Icon):",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 6: OPTIONAL CHARGES & DEVELOPER PRICING DETAILS
    # =========================================================================
    add_heading_1(doc, "6. Optional Charges & Developer Pricing Details (OptionalChargesSection.jsx)")
    doc.add_paragraph("Extracted from OptionalChargesSection.jsx, pricing-catalog.js, and price-format.js. Features an expandable interactive container displaying granular pricing rules for advanced modules, add-ons, and connectors:")

    add_heading_2(doc, "6.1 Section Header & Interactive Controls")
    add_meta_item(doc, "Section Headline (H2)", en_pricing["page"]["devPricingTitle"], fr_pricing["page"]["devPricingTitle"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Section Subtitle / Lead", en_pricing["page"]["optionalLead"], fr_pricing["page"]["optionalLead"], element_type="Lead Paragraph")
    add_meta_item(doc, "Collapse Toggle Button Label", en_pricing["page"]["collapseDetails"], fr_pricing["page"]["collapseDetails"], element_type="Interactive Button (Expanded State)")
    add_meta_item(doc, "Expand Toggle Button Label", en_pricing["page"]["expandDetails"], fr_pricing["page"]["expandDetails"], element_type="Interactive Button (Collapsed State)")

    add_heading_2(doc, "6.2 Table A: Advanced Add-ons (9 Items)")

    tbl_addons = doc.add_table(rows=1, cols=4)
    tbl_addons.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_addons)
    hdr_addons = tbl_addons.rows[0]
    hdr_addons.cells[0].paragraphs[0].add_run("Item ID")
    hdr_addons.cells[1].paragraphs[0].add_run("Item (English)")
    hdr_addons.cells[2].paragraphs[0].add_run("Item (French)")
    hdr_addons.cells[3].paragraphs[0].add_run("Internal V2 Price / Rule")
    format_row(hdr_addons, is_header=True, bg_color=HEX_NAVY)

    addons_data = [
        ("advanced-workflow", en_pricing["optional"]["items"]["advanced-workflow"], fr_pricing["optional"]["items"]["advanced-workflow"], "20,000 FCFA / month | [FR]: 20 000 FCFA / mois"),
        ("advanced-bi", en_pricing["optional"]["items"]["advanced-bi"], fr_pricing["optional"]["items"]["advanced-bi"], "25,000 FCFA / month | [FR]: 25 000 FCFA / mois"),
        ("marketing-automation", en_pricing["optional"]["items"]["marketing-automation"], fr_pricing["optional"]["items"]["marketing-automation"], "20,000 FCFA / month | [FR]: 20 000 FCFA / mois"),
        ("customer-portal-plus", en_pricing["optional"]["items"]["customer-portal-plus"], fr_pricing["optional"]["items"]["customer-portal-plus"], "15,000 FCFA / month | [FR]: 15 000 FCFA / mois"),
        ("field-service-plus", en_pricing["optional"]["items"]["field-service-plus"], fr_pricing["optional"]["items"]["field-service-plus"], "25,000 FCFA / month | [FR]: 25 000 FCFA / mois"),
        ("assets-maintenance-plus", en_pricing["optional"]["items"]["assets-maintenance-plus"], fr_pricing["optional"]["items"]["assets-maintenance-plus"], "25,000 FCFA / month | [FR]: 25 000 FCFA / mois"),
        ("data-api-plus", en_pricing["optional"]["items"]["data-api-plus"], fr_pricing["optional"]["items"]["data-api-plus"], "25,000 FCFA / month | [FR]: 25 000 FCFA / mois"),
        ("nelias-ai", en_pricing["optional"]["items"]["nelias-ai"], fr_pricing["optional"]["items"]["nelias-ai"], "From 15,000 FCFA / month + usage | [FR]: À partir de 15 000 FCFA / mois + usage"),
        ("audit-compliance", en_pricing["optional"]["items"]["audit-compliance"], fr_pricing["optional"]["items"]["audit-compliance"], "20,000 FCFA / month | [FR]: 20 000 FCFA / mois"),
    ]
    for idx, (a_id, a_lbl_en, a_lbl_fr, a_rule) in enumerate(addons_data):
        row = tbl_addons.add_row()
        row.cells[0].paragraphs[0].add_run(a_id)
        row.cells[1].paragraphs[0].add_run(a_lbl_en)
        row.cells[2].paragraphs[0].add_run(a_lbl_fr)
        row.cells[3].paragraphs[0].add_run(a_rule)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "6.3 Table B: Connectors (4 Items)")

    tbl_conn = doc.add_table(rows=1, cols=4)
    tbl_conn.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_conn)
    hdr_conn = tbl_conn.rows[0]
    hdr_conn.cells[0].paragraphs[0].add_run("Connector ID")
    hdr_conn.cells[1].paragraphs[0].add_run("Connector (English)")
    hdr_conn.cells[2].paragraphs[0].add_run("Connector (French)")
    hdr_conn.cells[3].paragraphs[0].add_run("Internal V2 Price / Rule")
    format_row(hdr_conn, is_header=True, bg_color=HEX_NAVY)

    conn_data = [
        ("connector-standard", en_pricing["optional"]["items"]["connector-standard"], fr_pricing["optional"]["items"]["connector-standard"], "Included or 10,000 FCFA / month | [FR]: Inclus ou 10 000 FCFA / mois"),
        ("connector-business", en_pricing["optional"]["items"]["connector-business"], fr_pricing["optional"]["items"]["connector-business"], "15,000–35,000 FCFA / month | [FR]: 15 000–35 000 FCFA / mois"),
        ("connector-premium", en_pricing["optional"]["items"]["connector-premium"], fr_pricing["optional"]["items"]["connector-premium"], "From 50,000 FCFA / month | [FR]: À partir de 50 000 FCFA / mois"),
        ("connector-custom", en_pricing["optional"]["items"]["connector-custom"], fr_pricing["optional"]["items"]["connector-custom"], "Quote | [FR]: Sur devis"),
    ]
    for idx, (c_id, c_lbl_en, c_lbl_fr, c_rule) in enumerate(conn_data):
        row = tbl_conn.add_row()
        row.cells[0].paragraphs[0].add_run(c_id)
        row.cells[1].paragraphs[0].add_run(c_lbl_en)
        row.cells[2].paragraphs[0].add_run(c_lbl_fr)
        row.cells[3].paragraphs[0].add_run(c_rule)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "6.4 Commercial Pricing Disclaimer Note")
    add_callout(
        doc,
        f"[EN]: \"{en_pricing['disclaimer']}\"\n\n"
        f"[FR]: \"{fr_pricing['disclaimer']}\"",
        label="STATUTORY PRICING DISCLAIMER (Tone: Note):",
        border_color=HEX_ORANGE
    )

    # =========================================================================
    # SECTION 7: ENTERPRISE BLOCK
    # =========================================================================
    add_heading_1(doc, "7. Enterprise Solution Panel (EnterpriseSection.jsx)")
    doc.add_paragraph("Dedicated panel for large organizations, multi-company groups, holding structures, and sovereign deployment requirements:")

    add_meta_item(doc, "Panel Headline (H2)", en_home["pricing"]["table"]["plans"]["enterprise"], fr_home["pricing"]["table"]["plans"]["enterprise"], element_type="Panel Heading (H2)")
    add_meta_item(doc, "Enterprise Scope & Inclusions", en_home["pricing"]["enterprise"], fr_home["pricing"]["enterprise"], element_type="Description Paragraph")
    add_meta_item(doc, "Enterprise Action CTA", en_common["cta"]["talkToExpert"], fr_common["cta"]["talkToExpert"], element_type="Primary Button (Orange)", link_url="/contact (location: 'pricing-enterprise')")

    add_callout(
        doc,
        f"[EN]: {en_home['pricing']['enterprise']}\n\n"
        f"[FR]: {fr_home['pricing']['enterprise']}\n\n"
        f"Primary CTA: \"{en_common['cta']['talkToExpert']}\" | [FR]: \"{fr_common['cta']['talkToExpert']}\" [Target: /contact]",
        label="ENTERPRISE VALUE PROPOSITION & CONSULTATION CALLOUT:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 8: SECTOR ENGINE REASSURANCE & INDUSTRY+ PACKS PREVIEW
    # =========================================================================
    add_heading_1(doc, "8. Sector Engine Inclusions & Industry+ Packs (PacksSection.jsx)")
    doc.add_paragraph("Extracted from PacksSection.jsx and locales/*/pricing.json. Previews vertical sector specializations and planned business packs:")

    add_heading_2(doc, "8.1 Sector Engine Included Reassurance Card")
    add_meta_item(doc, "Card Heading (H2)", en_pricing["sectors"]["title"], fr_pricing["sectors"]["title"], element_type="Card Heading (H2)")
    add_meta_item(doc, "Inclusion Badge", en_home["pricing"]["table"]["included"], fr_home["pricing"]["table"]["included"], element_type="Accent Pill Badge")
    add_meta_item(doc, "Sector Engine Policy Statement", en_pricing["sectors"]["body"], fr_pricing["sectors"]["body"], element_type="Reassurance Paragraph")
    add_meta_item(doc, "Supported Sectors Coverage", en_pricing["sectors"]["supportedSectors"], fr_pricing["sectors"]["supportedSectors"], element_type="Coverage Subtext")

    add_heading_3(doc, "Key Sector Engine Architectural Highlights")
    add_meta_item(doc, "Highlight 1: Tailored to Activity", f"{en_pricing['sectors']['highlights']['tailored']['title']} - {en_pricing['sectors']['highlights']['tailored']['text']}", f"{fr_pricing['sectors']['highlights']['tailored']['title']} - {fr_pricing['sectors']['highlights']['tailored']['text']}", element_type="Feature Point")
    add_meta_item(doc, "Highlight 2: Zero Extra Fee", f"{en_pricing['sectors']['highlights']['zeroFee']['title']} - {en_pricing['sectors']['highlights']['zeroFee']['text']}", f"{fr_pricing['sectors']['highlights']['zeroFee']['title']} - {fr_pricing['sectors']['highlights']['zeroFee']['text']}", element_type="Feature Point")
    add_meta_item(doc, "Highlight 3: Interchangeable Modules", f"{en_pricing['sectors']['highlights']['flexible']['title']} - {en_pricing['sectors']['highlights']['flexible']['text']}", f"{fr_pricing['sectors']['highlights']['flexible']['title']} - {fr_pricing['sectors']['highlights']['flexible']['text']}", element_type="Feature Point")

    add_heading_2(doc, "8.2 Industry+ Packs Preview (5 Planned Industry Solutions)")
    add_meta_item(doc, "Preview Headline (H3)", en_pricing["packs"]["title"], fr_pricing["packs"]["title"], element_type="Heading (H3)")
    add_meta_item(doc, "Availability Lead", en_pricing["packs"]["intro"], fr_pricing["packs"]["intro"], element_type="Lead Paragraph")
    
    en_pack_pr = en_pricing["packs"]["price"].replace("{{amount}}", "50,000 FCFA")
    fr_pack_pr = fr_pricing["packs"]["price"].replace("{{amount}}", "50 000 FCFA")
    add_meta_item(doc, "Projected Pack Monthly Price", en_pack_pr, fr_pack_pr, element_type="Price Notice")
    add_meta_item(doc, "Notification Call-to-Action", en_pricing["packs"]["notify"], fr_pricing["packs"]["notify"], element_type="Text Link", link_url="/contact")

    # Table of 5 Planned Packs
    tbl_packs = doc.add_table(rows=1, cols=4)
    tbl_packs.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_packs)
    hdr_packs = tbl_packs.rows[0]
    hdr_packs.cells[0].paragraphs[0].add_run("Pack ID")
    hdr_packs.cells[1].paragraphs[0].add_run("Pack Name")
    hdr_packs.cells[2].paragraphs[0].add_run("Sector / Industry")
    hdr_packs.cells[3].paragraphs[0].add_run("Envisaged Functions & Capabilities")
    format_row(hdr_packs, is_header=True, bg_color=HEX_NAVY)

    pack_data = [
        ("immo", en_pricing["packs"]["items"]["immo"]["name"], f"{en_pricing['packs']['items']['immo']['sector']} | [FR]: {fr_pricing['packs']['items']['immo']['sector']}", f"{en_pricing['packs']['items']['immo']['functions']}\n[FR]: {fr_pricing['packs']['items']['immo']['functions']}"),
        ("courtage", en_pricing["packs"]["items"]["courtage"]["name"], f"{en_pricing['packs']['items']['courtage']['sector']} | [FR]: {fr_pricing['packs']['items']['courtage']['sector']}", f"{en_pricing['packs']['items']['courtage']['functions']}\n[FR]: {fr_pricing['packs']['items']['courtage']['functions']}"),
        ("pharma", en_pricing["packs"]["items"]["pharma"]["name"], f"{en_pricing['packs']['items']['pharma']['sector']} | [FR]: {fr_pricing['packs']['items']['pharma']['sector']}", f"{en_pricing['packs']['items']['pharma']['functions']}\n[FR]: {fr_pricing['packs']['items']['pharma']['functions']}"),
        ("chantier", en_pricing["packs"]["items"]["chantier"]["name"], f"{en_pricing['packs']['items']['chantier']['sector']} | [FR]: {fr_pricing['packs']['items']['chantier']['sector']}", f"{en_pricing['packs']['items']['chantier']['functions']}\n[FR]: {fr_pricing['packs']['items']['chantier']['functions']}"),
        ("services", en_pricing["packs"]["items"]["services"]["name"], f"{en_pricing['packs']['items']['services']['sector']} | [FR]: {fr_pricing['packs']['items']['services']['sector']}", f"{en_pricing['packs']['items']['services']['functions']}\n[FR]: {fr_pricing['packs']['items']['services']['functions']}"),
    ]
    for idx, (p_id, p_name, p_sec, p_func) in enumerate(pack_data):
        row = tbl_packs.add_row()
        row.cells[0].paragraphs[0].add_run(p_id)
        row.cells[1].paragraphs[0].add_run(p_name)
        row.cells[2].paragraphs[0].add_run(p_sec)
        row.cells[3].paragraphs[0].add_run(p_func)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 9: COMPREHENSIVE PLAN COMPARISON MATRIX
    # =========================================================================
    add_heading_1(doc, "9. Comprehensive Plan Comparison Matrix (PlanComparison.jsx)")
    doc.add_paragraph("Structured side-by-side technical comparison across all 4 plans (START, BUSINESS, PROFESSIONAL, ENTERPRISE):")

    add_meta_item(doc, "Section Title (H2)", en_pricing["compare"]["title"], fr_pricing["compare"]["title"], element_type="Section Heading (H2)")

    tbl_comp = doc.add_table(rows=1, cols=5)
    tbl_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_comp)
    hdr_comp = tbl_comp.rows[0]
    hdr_comp.cells[0].paragraphs[0].add_run("Criteria / Metric")
    hdr_comp.cells[1].paragraphs[0].add_run("START")
    hdr_comp.cells[2].paragraphs[0].add_run("BUSINESS (★)")
    hdr_comp.cells[3].paragraphs[0].add_run("PROFESSIONAL")
    hdr_comp.cells[4].paragraphs[0].add_run("ENTERPRISE")
    format_row(hdr_comp, is_header=True, bg_color=HEX_NAVY)

    matrix_rows = [
        ("Target Audience / For", "Very small and small businesses\n[FR]: Très petites et petites entreprises", "SMEs\n[FR]: PME", "Structured companies\n[FR]: Entreprises structurées", "Large companies, groups\n[FR]: Grandes entreprises, groupes"),
        ("Monthly Price (excl. VAT)", "49,000 FCFA", "129,000 FCFA", "249,000 FCFA", "On quote | [FR]: Sur devis"),
        ("Annual Price (excl. VAT)", "490,000 FCFA", "1,290,000 FCFA", "2,490,000 FCFA", "On quote | [FR]: Sur devis"),
        ("Standard Modules Included", "4 modules", "6 modules", "8 modules", "As needed | [FR]: Selon les besoins"),
        ("Users Included", "5 users", "15 users", "40 users", "As needed | [FR]: Selon les besoins"),
        ("Legal Entities", "1 entity", "1 entity", "2 entities", "Multi-entity | [FR]: Multi-entités"),
        ("Storage Included", "10 GB | [FR]: 10 Go", "25 GB | [FR]: 25 Go", "50 GB | [FR]: 50 Go", "Sized to need | [FR]: Dimensionné selon le besoin"),
        ("Sector Engine", "Included | [FR]: Inclus", "Included | [FR]: Inclus", "Included | [FR]: Inclus", "Included | [FR]: Inclus"),
        ("Service Level Commitment", "Standard", "Standard+", "Priority | [FR]: Prioritaire", "SLA"),
    ]

    for idx, (m_crit, m_s, m_b, m_p, m_e) in enumerate(matrix_rows):
        row = tbl_comp.add_row()
        row.cells[0].paragraphs[0].add_run(m_crit)
        row.cells[1].paragraphs[0].add_run(m_s)
        row.cells[2].paragraphs[0].add_run(m_b)
        row.cells[3].paragraphs[0].add_run(m_p)
        row.cells[4].paragraphs[0].add_run(m_e)
        # Highlight business column
        bg_c = HEX_ACCENT_SOFT if idx % 2 == 1 else HEX_WHITE
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)
        # give column 2 slight highlight
        set_cell_background(row.cells[2], HEX_ACCENT_SOFT)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 10: MOBILE DRAWER & STICKY CTA
    # =========================================================================
    add_heading_1(doc, "10. Mobile Drawer & Floating CTA (MobileNavDrawer.jsx & StickyMobileCta.jsx)")
    doc.add_paragraph("Navigation and conversion elements optimized for mobile viewports on the Pricing Page:")

    add_heading_2(doc, "10.1 Mobile Navigation Drawer (MobileNavDrawer.jsx)")
    add_meta_item(doc, "Drawer Accessible Label", en_common["header"]["menu"], fr_common["header"]["menu"], element_type="dialog[aria-label]")
    add_meta_item(doc, "Close Button Accessible Label", en_common["a11y"]["closeMenu"], fr_common["a11y"]["closeMenu"], element_type="button[aria-label]")
    add_meta_item(doc, "Drawer Nav Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Nav Link", link_url="/")
    add_meta_item(doc, "Drawer Nav Link 2", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Nav Link", link_url="/about")
    add_meta_item(doc, "Drawer Nav Link 3", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Nav Link", link_url="/industries")
    add_meta_item(doc, "Drawer Nav Link 4", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Nav Link", link_url="/features")
    add_meta_item(doc, "Drawer Nav Link 5 (Active)", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Nav Link (Active)", link_url="/pricing")
    add_meta_item(doc, "Drawer Nav Link 6", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Nav Link", link_url="/contact")
    add_meta_item(doc, "Drawer External Sign In", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="External Link", link_url="https://login.nelias.app")
    add_meta_item(doc, "Drawer Full-width CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Full-width Button", link_url="/demo")

    add_heading_2(doc, "10.2 Sticky Mobile Floating CTA Bar (StickyMobileCta.jsx)")
    doc.add_paragraph("Floating bar appearing on viewports < 768px after scrolling 480px, auto-hidden when the footer is reached:")
    add_meta_item(doc, "Floating CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Sticky Fixed Button", link_url="/demo")

    # =========================================================================
    # SECTION 11: SITE FOOTER
    # =========================================================================
    add_heading_1(doc, "11. Site Footer (Footer.jsx)")
    doc.add_paragraph("Persistent dark footer rendered on the Pricing Page, with brand attribution, navigation links, direct contact channels, and legal agreements:")

    add_heading_2(doc, "11.1 Brand & Corporate Attribution")
    add_meta_item(doc, "Brand Name", en_common["brand"]["name"], fr_common["brand"]["name"], element_type="Logo text")
    add_meta_item(doc, "Footer Brand Tagline", en_common["brand"]["footerTagline"], fr_common["brand"]["footerTagline"], element_type="Brand Mission Statement")

    add_heading_2(doc, "11.2 Explore Column Links")
    add_meta_item(doc, "Explore Column Heading", en_common["footer"]["exploreHeading"], fr_common["footer"]["exploreHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Explore Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Footer Link", link_url="/")
    add_meta_item(doc, "Explore Link 2", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Footer Link", link_url="/industries")
    add_meta_item(doc, "Explore Link 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Footer Link", link_url="/features")
    add_meta_item(doc, "Explore Link 4 (Active Page)", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Footer Link (Current)", link_url="/pricing")
    add_meta_item(doc, "Explore Link 5", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Footer Link", link_url="/contact")

    add_heading_2(doc, "11.3 Contact Column Details")
    add_meta_item(doc, "Contact Column Heading", en_common["footer"]["contactHeading"], fr_common["footer"]["contactHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Email Channel", "contact@nelias.app", element_type="Contact Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Phone Channel", "+225 05 64 05 90 60", element_type="Contact Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "WhatsApp Channel", "WhatsApp: +225 07 00 40 92 41", element_type="External Link", link_url="https://wa.me/2250700409241")
    add_meta_item(doc, "Physical Address", "Abidjan, Côte d'Ivoire", element_type="Location Item")

    add_heading_2(doc, "11.4 Legal Hairline & Copyright")
    add_meta_item(doc, "Copyright Notice", en_common["brand"]["copyright"], fr_common["brand"]["copyright"], element_type="Copyright String")
    add_meta_item(doc, "Legal Link 1", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="Legal Link", link_url="/privacy")
    add_meta_item(doc, "Legal Link 2", en_common["nav"]["terms"], fr_common["nav"]["terms"], element_type="Legal Link", link_url="/terms")
    add_meta_item(doc, "Legal Link 3", en_common["nav"]["faq"], fr_common["nav"]["faq"], element_type="Legal Link", link_url="/faq")
    add_meta_item(doc, "Legal Link 4", en_common["nav"]["dpa"], fr_common["nav"]["dpa"], element_type="Legal Link", link_url="/dpa")
    add_meta_item(doc, "Legal Link 5", en_common["nav"]["sla"], fr_common["nav"]["sla"], element_type="Legal Link", link_url="/sla")

    # Output directory and save
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "pricing_page_Content.docx")
    
    doc.save(out_file)
    print(f"Document successfully created and saved at: {out_file}")

if __name__ == "__main__":
    main()
