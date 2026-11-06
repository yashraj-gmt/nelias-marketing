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
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary Accent / CTAs
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

def add_industry_spec_card(doc, slug, name_en, name_fr, headline_en, headline_fr, summary_en, summary_fr,
                           capabilities, walkthrough_en, walkthrough_fr, demo_url):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    
    set_cell_background(cell, HEX_LIGHT_BG)
    set_card_borders(cell, HEX_BORDER, "10")
    set_cell_margins(cell, top=160, bottom=160, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    
    r_title = p.add_run(f"SECTOR: {name_en}\n")
    r_title.bold = True
    r_title.font.size = Pt(13)
    r_title.font.color.rgb = NAVY
    
    if name_fr != name_en:
        p.add_run(f"[French Name]: {name_fr}\n")
        
    if headline_en:
        r_head = p.add_run(f"Sector Headline: \"{headline_en}\" | [FR]: \"{headline_fr}\"\n")
        r_head.bold = True
        r_head.font.size = Pt(10.5)
        r_head.font.color.rgb = AZURE
        
    p.add_run(f"Summary Scope:\n[EN]: {summary_en}\n[FR]: {summary_fr}\n\n")
    
    # Suggested capabilities
    r_cap_lbl = p.add_run("Suggested Capabilities:\n")
    r_cap_lbl.bold = True
    r_cap_lbl.font.size = Pt(10)
    r_cap_lbl.font.color.rgb = NAVY
    for cap_e, cap_f in capabilities:
        p.add_run(f"  • {cap_e} | [FR]: {cap_f} [Badge: Demo only / Démo uniquement]\n")
    p.add_run("\n")
    
    # Practical walkthrough
    if walkthrough_en:
        r_walk_lbl = p.add_run("Practical Walkthrough Sequence:\n")
        r_walk_lbl.bold = True
        r_walk_lbl.font.size = Pt(10)
        r_walk_lbl.font.color.rgb = NAVY
        for i, (w_e, w_f) in enumerate(zip(walkthrough_en, walkthrough_fr)):
            p.add_run(f"  Step {i + 1}: {w_e} | [FR]: {w_f}\n")
        p.add_run("\n")
        
    # Reassurance note
    r_note = p.add_run("Sector Reassurance Policy:\n")
    r_note.bold = True
    r_note.font.size = Pt(9.5)
    r_note.font.color.rgb = SLATE
    p.add_run("  \"The base sector configuration is included in all plans, at no extra charge.\"\n")
    p.add_run("  [FR]: \"La configuration sectorielle de base est incluse dans toutes les offres, sans supplément.\"\n\n")
    
    # Actions
    r_act = p.add_run("Interactive Actions:\n")
    r_act.bold = True
    r_act.font.size = Pt(10)
    r_act.font.color.rgb = NAVY
    p.add_run(f"  • Primary Action: \"Request a Demo\" (FR: \"Demander une démo\") -> {demo_url}\n")
    p.add_run(f"  • Inline Collapse Button: \"Close\" (FR: \"Fermer\")\n")

    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(6)

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    def load_json(rel_path):
        with open(os.path.join(base_dir, rel_path), "r", encoding="utf-8") as f:
            return json.load(f)
            
    en_industries = load_json("src/i18n/locales/en/industries.json")
    fr_industries = load_json("src/i18n/locales/fr/industries.json")
    en_features = load_json("src/i18n/locales/en/features.json")
    fr_features = load_json("src/i18n/locales/fr/features.json")
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
    r_title = p_title.add_run("NELIAS Marketing Portal - Industries Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Components, Sector Data, Catalogs & Layouts)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    # Overview Metadata Box
    add_callout(
        doc,
        "Document Purpose: Exhaustive reference of all existing content for the NELIAS Industries Page, rendered in original visual order. Preserves exact wording, spelling, punctuation, capitalization, symbols, and formatting directly from source code.\n"
        "• Target URL: https://nelias.app/industries (Route: /industries)\n"
        "• Source Files: src/pages/IndustriesPage.jsx, src/sections/industries/*, src/data/industries.js, src/data/industry-areas.js, src/data/home-content.js, src/sections/features/FeaturesSectors.jsx, src/sections/home/WhySection.jsx, src/i18n/locales/*/industries.json, src/i18n/locales/*/features.json, src/i18n/locales/*/pricing.json, src/i18n/locales/*/seo.json\n"
        "• Primary Language: English (EN) | Complete Bilingual Translations: French (FR)\n"
        "• Publisher & Platform: NELIAS Business Management Platform (Debass Technologies, Abidjan, Côte d'Ivoire)\n"
        "• Core Scope: Hero with Industries Hub Mosaic, Interactive 12-Sector Explorer with Inline Detailed Specifications, Sector Engine Policy & Industry+ Packs, Why NELIAS Propositions, and Final Conversion Band.",
        label="DOCUMENT OVERVIEW & AUDIT METADATA:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 1: PAGE-LEVEL METADATA & SEO
    # =========================================================================
    add_heading_1(doc, "1. Page-Level Metadata & SEO")
    p_seo_intro = doc.add_paragraph("Extracted from src/pages/IndustriesPage.jsx, src/components/common/Seo.jsx, and src/i18n/locales/*/seo.json:")
    p_seo_intro.paragraph_format.space_after = Pt(4)

    add_meta_item(doc, "SEO Page Title", en_seo["industries"]["title"], fr_seo["industries"]["title"], element_type="<title> tag")
    add_meta_item(doc, "Meta Description", en_seo["industries"]["description"], fr_seo["industries"]["description"], element_type="meta[name='description']")
    add_meta_item(doc, "Canonical URL", "https://nelias.app/industries", element_type="link[rel='canonical']")
    add_meta_item(doc, "OpenGraph Title", en_seo["industries"]["title"], fr_seo["industries"]["title"], element_type="meta[property='og:title']")
    add_meta_item(doc, "OpenGraph Description", en_seo["industries"]["description"], fr_seo["industries"]["description"], element_type="meta[property='og:description']")
    add_meta_item(doc, "OpenGraph Type", "website", element_type="meta[property='og:type']")
    add_meta_item(doc, "OpenGraph Site Name", "NELIAS", element_type="meta[property='og:site_name']")
    add_meta_item(doc, "OpenGraph Locale", "en_US | [FR]: fr_FR", element_type="meta[property='og:locale']")
    add_meta_item(doc, "Twitter Card Type", "summary", element_type="meta[name='twitter:card']")

    # =========================================================================
    # SECTION 2: GLOBAL HEADER & NAVIGATION
    # =========================================================================
    add_heading_1(doc, "2. Global Header, Utility Bar & Navigation")
    doc.add_paragraph("Persistent top navigation rendered on the Industries Page via RootLayout.jsx, UtilityBar.jsx, and Header.jsx:")

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
    add_meta_item(doc, "Nav Item 2 (Active Page)", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Header Nav Link (aria-current='page')", link_url="/industries")
    add_meta_item(doc, "Nav Item 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Header Nav Link", link_url="/features")
    add_meta_item(doc, "Nav Item 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Header Nav Link", link_url="/pricing")
    add_meta_item(doc, "Header Primary CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button", link_url="/demo")
    add_meta_item(doc, "Mobile Menu Trigger", en_common["a11y"]["openMenu"], fr_common["a11y"]["openMenu"], element_type="Hamburger Button")

    # =========================================================================
    # SECTION 3: INDUSTRIES HERO & HUB ILLUSTRATION
    # =========================================================================
    add_heading_1(doc, "3. Industries Hero Header & Sector Hub (PageHeader.jsx & IndustriesHub.jsx)")
    doc.add_paragraph("The hero header presents the sector-aware architecture of the platform alongside a 12-sector icon hub:")

    add_heading_2(doc, "3.1 Hero Text & Core Value Proposition")
    add_meta_item(doc, "Hero Headline (H1)", en_industries["landing"]["title"], fr_industries["landing"]["title"], element_type="Main Headline (H1)")
    add_meta_item(doc, "Hero Subtitle / Lead", en_industries["landing"]["lead"], fr_industries["landing"]["lead"], element_type="Lead Paragraph")
    add_meta_item(doc, "Visual Background Tone", "tint", element_type="Section Tone")

    add_callout(
        doc,
        f"[EN]: \"{en_industries['landing']['lead']}\"\n\n"
        f"[FR]: \"{fr_industries['landing']['lead']}\"",
        label="CORE PLATFORM ARCHITECTURAL PHILOSOPHY:",
        border_color=HEX_AZURE
    )

    add_heading_2(doc, "3.2 Industries Hub Visual Art (IndustriesHub.jsx)")
    doc.add_paragraph("Decorative 4x4 interactive hub layout showcasing the 12 industry icons surrounding a central brand-ribbon medallion with an SVG gradient sweep (Flame-500 to Sun-300):")
    add_meta_item(doc, "Hub Layout Composition", "4x4 Grid with central 2x2 Brand Ribbon Medallion", element_type="Decorative Visual Composition")
    add_meta_item(doc, "Center Medallion", "Brand ribbon SVG sweep in Flame/Sun gradient over Selected Navy", element_type="Visual Centerpiece")

    # =========================================================================
    # SECTION 4: INTERACTIVE INDUSTRY EXPLORER
    # =========================================================================
    add_heading_1(doc, "4. Interactive Industry Explorer (IndustryExplorer.jsx, IndustryCard.jsx & IndustryDetail.jsx)")
    doc.add_paragraph("Extracted from IndustryExplorer.jsx, IndustryCard.jsx, IndustryDetail.jsx, industry-areas.js, and locales/*/industries.json. Features a 12-sector card selector with expandable inline detail panels:")

    add_heading_2(doc, "4.1 Explorer Controls & Selector Header")
    add_meta_item(doc, "Selector Section Heading (H2)", en_industries["page"]["selectorTitle"], fr_industries["page"]["selectorTitle"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Selection Hint", en_industries["page"]["selectHint"], fr_industries["page"]["selectHint"], element_type="Helper Paragraph")
    add_meta_item(doc, "Suggested Capabilities Subheading", en_industries["page"]["suggestedLabel"], fr_industries["page"]["suggestedLabel"], element_type="Detail Subheading (H4)")
    add_meta_item(doc, "Walkthrough Sequence Subheading", en_industries["detail"]["walkthroughTitle"], fr_industries["detail"]["walkthroughTitle"], element_type="Detail Subheading (H4)")
    add_meta_item(doc, "Challenges & Outcomes Subheading", en_industries["detail"]["challengesTitle"], fr_industries["detail"]["challengesTitle"], element_type="Detail Subheading (H4)")
    add_meta_item(doc, "Close Detail Button Label", en_industries["page"]["close"], fr_industries["page"]["close"], element_type="Interactive Button")

    add_heading_2(doc, "4.2 Overview Table: The 12 Supported Industry Sectors")

    tbl_summary = doc.add_table(rows=1, cols=4)
    tbl_summary.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_summary)
    hdr_sum = tbl_summary.rows[0]
    hdr_sum.cells[0].paragraphs[0].add_run("Sector Slug")
    hdr_sum.cells[1].paragraphs[0].add_run("Sector Name (English)")
    hdr_sum.cells[2].paragraphs[0].add_run("Sector Name (French)")
    hdr_sum.cells[3].paragraphs[0].add_run("Summary Description (English)")
    format_row(hdr_sum, is_header=True, bg_color=HEX_NAVY)

    ind_slugs = [
        "retail-distribution", "professional-services", "manufacturing", "healthcare",
        "hospitality", "education-training", "insurance-financial-services",
        "energy-field-services", "real-estate", "pharmacies", "construction-btp",
        "it-technology-services"
    ]

    for idx, slug in enumerate(ind_slugs):
        row = tbl_summary.add_row()
        row.cells[0].paragraphs[0].add_run(slug)
        row.cells[1].paragraphs[0].add_run(en_industries["items"][slug]["name"])
        row.cells[2].paragraphs[0].add_run(fr_industries["items"][slug]["name"])
        row.cells[3].paragraphs[0].add_run(en_industries["items"][slug]["summary"])
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "4.3 Detailed Specification Cards for all 12 Business Sectors")

    # Mapping of capabilities from industry-areas.js
    industry_areas_map = {
        "retail-distribution": ["crm-sales", "purchasing-inventory"],
        "professional-services": ["crm-sales", "projects-timesheets", "finance-accounting", "reporting-analytics"],
        "manufacturing": ["purchasing-inventory", "manufacturing-quality"],
        "healthcare": ["purchasing-inventory", "customer-support-portal"],
        "hospitality": ["purchasing-inventory", "finance-accounting", "human-resources"],
        "education-training": ["finance-accounting", "projects-timesheets"],
        "insurance-financial-services": ["crm-sales", "customer-support-portal", "workflows-automation"],
        "energy-field-services": ["assets-maintenance", "projects-timesheets"],
        "real-estate": ["crm-sales", "projects-timesheets", "finance-accounting", "reporting-analytics"],
        "pharmacies": ["purchasing-inventory", "point-of-sale", "finance-accounting"],
        "construction-btp": ["purchasing-inventory", "projects-timesheets", "finance-accounting"],
        "it-technology-services": ["crm-sales", "projects-timesheets", "customer-support-portal", "reporting-analytics", "finance-accounting"],
    }

    for slug in ind_slugs:
        item_e = en_industries["items"][slug]
        item_f = fr_industries["items"][slug]
        
        name_e = item_e["name"]
        name_f = item_f["name"]
        headline_e = item_e.get("headline")
        headline_f = item_f.get("headline")
        summary_e = item_e["summary"]
        summary_f = item_f["summary"]
        
        raw_walk_e = item_e.get("walkthrough", [])
        raw_walk_f = item_f.get("walkthrough", [])
        
        raw_caps = industry_areas_map.get(slug, [])
        caps_pairs = [
            (en_features["areas"][k]["name"], fr_features["areas"][k]["name"])
            for k in raw_caps if k in en_features["areas"]
        ]
        
        demo_url = f"/demo?industry={slug}&needs={','.join(raw_caps)}"
        
        add_industry_spec_card(
            doc,
            slug=slug,
            name_en=name_e,
            name_fr=name_f,
            headline_en=headline_e,
            headline_fr=headline_f,
            summary_en=summary_e,
            summary_fr=summary_f,
            capabilities=caps_pairs,
            walkthrough_en=raw_walk_e,
            walkthrough_fr=raw_walk_f,
            demo_url=demo_url
        )

    # =========================================================================
    # SECTION 5: SECTOR CONFIGURATIONS & INDUSTRY+ PACKS
    # =========================================================================
    add_heading_1(doc, "5. Sector Configurations & Industry+ Packs (FeaturesSectors.jsx)")
    doc.add_paragraph("Extracted from FeaturesSectors.jsx, home-pricing.js, and locales/*/pricing.json. Explains Sector Engine inclusion and previews 5 specialized vertical packs:")

    add_heading_2(doc, "5.1 Sector Engine Reassurance Card")
    add_meta_item(doc, "Badge 1: Core Engine", en_pricing["sectors"]["badge"], fr_pricing["sectors"]["badge"], element_type="Pill Badge")
    add_meta_item(doc, "Badge 2: Inclusion Basis", en_home["pricing"]["table"]["included"], fr_home["pricing"]["table"]["included"], element_type="Accent Badge")
    add_meta_item(doc, "Badge 3: Preconfiguration Scope", en_pricing["sectors"]["supportedSectors"], fr_pricing["sectors"]["supportedSectors"], element_type="Pill Badge")
    add_meta_item(doc, "Section Headline (H2)", en_pricing["sectors"]["title"], fr_pricing["sectors"]["title"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Reassurance Narrative", en_pricing["sectors"]["body"], fr_pricing["sectors"]["body"], element_type="Lead Paragraph")

    add_heading_3(doc, "The 3 Architectural Pillars")
    add_meta_item(
        doc,
        "Pillar 01: Tailored to Activity",
        f"{en_pricing['sectors']['highlights']['tailored']['title']} - {en_pricing['sectors']['highlights']['tailored']['text']}",
        f"{fr_pricing['sectors']['highlights']['tailored']['title']} - {fr_pricing['sectors']['highlights']['tailored']['text']}",
        element_type="Pillar Card"
    )
    add_meta_item(
        doc,
        "Pillar 02: No Extra Fee",
        f"{en_pricing['sectors']['highlights']['zeroFee']['title']} - {en_pricing['sectors']['highlights']['zeroFee']['text']}",
        f"{fr_pricing['sectors']['highlights']['zeroFee']['title']} - {fr_pricing['sectors']['highlights']['zeroFee']['text']}",
        element_type="Pillar Card"
    )
    add_meta_item(
        doc,
        "Pillar 03: Interchangeable Modules",
        f"{en_pricing['sectors']['highlights']['flexible']['title']} - {en_pricing['sectors']['highlights']['flexible']['text']}",
        f"{fr_pricing['sectors']['highlights']['flexible']['title']} - {fr_pricing['sectors']['highlights']['flexible']['text']}",
        element_type="Pillar Card"
    )

    add_heading_2(doc, "5.2 Industry+ Packs Preview (5 Planned Industry Packs)")
    add_meta_item(doc, "Packs Headline (H3)", en_pricing["packs"]["title"], fr_pricing["packs"]["title"], element_type="Section Heading (H3)")
    add_meta_item(doc, "Packs Availability Lead", en_pricing["packs"]["intro"], fr_pricing["packs"]["intro"], element_type="Lead Paragraph")
    
    en_pack_pr = en_pricing["packs"]["price"].replace("{{amount}}", "50,000 FCFA")
    fr_pack_pr = fr_pricing["packs"]["price"].replace("{{amount}}", "50 000 FCFA")
    add_meta_item(doc, "Projected Pack Price", en_pack_pr, fr_pack_pr, element_type="Monthly Price Callout (Shown when pricingPublic=true)")

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
        ("immo", en_pricing["packs"]["items"]["immo"]["name"], f"{en_pricing['packs']['items']['immo']['sector']} | [FR]: {fr_pricing['packs']['items']['immo']['sector']}", f"{en_pricing['packs']['items']['immo']['functions']}\n\n[FR]: {fr_pricing['packs']['items']['immo']['functions']}"),
        ("courtage", en_pricing["packs"]["items"]["courtage"]["name"], f"{en_pricing['packs']['items']['courtage']['sector']} | [FR]: {fr_pricing['packs']['items']['courtage']['sector']}", f"{en_pricing['packs']['items']['courtage']['functions']}\n\n[FR]: {fr_pricing['packs']['items']['courtage']['functions']}"),
        ("pharma", en_pricing["packs"]["items"]["pharma"]["name"], f"{en_pricing['packs']['items']['pharma']['sector']} | [FR]: {fr_pricing['packs']['items']['pharma']['sector']}", f"{en_pricing['packs']['items']['pharma']['functions']}\n\n[FR]: {fr_pricing['packs']['items']['pharma']['functions']}"),
        ("chantier", en_pricing["packs"]["items"]["chantier"]["name"], f"{en_pricing['packs']['items']['chantier']['sector']} | [FR]: {fr_pricing['packs']['items']['chantier']['sector']}", f"{en_pricing['packs']['items']['chantier']['functions']}\n\n[FR]: {fr_pricing['packs']['items']['chantier']['functions']}"),
        ("services", en_pricing["packs"]["items"]["services"]["name"], f"{en_pricing['packs']['items']['services']['sector']} | [FR]: {fr_pricing['packs']['items']['services']['sector']}", f"{en_pricing['packs']['items']['services']['functions']}\n\n[FR]: {fr_pricing['packs']['items']['services']['functions']}"),
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
    # SECTION 6: WHY NELIAS (VALUE PROPOSITIONS)
    # =========================================================================
    add_heading_1(doc, "6. Why NELIAS Value Propositions (WhySection.jsx)")
    doc.add_paragraph("Extracted from WhySection.jsx, home-content.js, and locales/*/home.json. Institutional reasons why organizations choose the NELIAS platform:")

    add_meta_item(doc, "Section Heading (H2)", en_home["why"]["title"], fr_home["why"]["title"], element_type="Section Heading (H2)")

    tbl_why = doc.add_table(rows=1, cols=4)
    tbl_why.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_why)
    hdr_why = tbl_why.rows[0]
    hdr_why.cells[0].paragraphs[0].add_run("Pillar ID")
    hdr_why.cells[1].paragraphs[0].add_run("Title (English)")
    hdr_why.cells[2].paragraphs[0].add_run("Title (French)")
    hdr_why.cells[3].paragraphs[0].add_run("Verbatim Description (EN / FR)")
    format_row(hdr_why, is_header=True, bg_color=HEX_NAVY)

    why_keys = ["prices", "africa", "configured", "path", "proximity"]
    for idx, k in enumerate(why_keys):
        row = tbl_why.add_row()
        row.cells[0].paragraphs[0].add_run(k)
        row.cells[1].paragraphs[0].add_run(en_home["why"]["items"][k]["title"])
        row.cells[2].paragraphs[0].add_run(fr_home["why"]["items"][k]["title"])
        row.cells[3].paragraphs[0].add_run(f"[EN]: {en_home['why']['items'][k]['text']}\n[FR]: {fr_home['why']['items'][k]['text']}")
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 7: CLOSING CONVERSION CTA BAND
    # =========================================================================
    add_heading_1(doc, "7. Closing Conversion CTA Band (IndustriesClosing.jsx)")
    doc.add_paragraph("Full-width high-contrast inverse band closing the Industries Page with two clear conversion pathways:")

    add_meta_item(doc, "Band Headline (H2)", en_home["final"]["title"], fr_home["final"]["title"], element_type="Band Heading (H2)")
    add_meta_item(doc, "Band Description / Lead", en_home["final"]["body"], fr_home["final"]["body"], element_type="Lead Paragraph")
    add_meta_item(doc, "Primary CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button (Orange)", link_url="/demo")
    add_meta_item(doc, "Secondary CTA Button", en_common["cta"]["signUp"], fr_common["cta"]["signUp"], element_type="Outline On-Dark Button", link_url="https://login.nelias.app/")

    add_callout(
        doc,
        f"Headline: \"{en_home['final']['title']}\" | [FR]: \"{fr_home['final']['title']}\"\n\n"
        f"Body: \"{en_home['final']['body']}\"\n[FR]: \"{fr_home['final']['body']}\"\n\n"
        f"Primary CTA: \"{en_common['cta']['bookDemo']}\" -> /demo\n"
        f"Secondary CTA: \"{en_common['cta']['signUp']}\" -> https://login.nelias.app/",
        label="CLOSING CONVERSION CALL-TO-ACTION BAND:",
        border_color=HEX_ORANGE
    )

    # =========================================================================
    # SECTION 8: MOBILE DRAWER & STICKY CTA
    # =========================================================================
    add_heading_1(doc, "8. Mobile Drawer & Floating CTA (MobileNavDrawer.jsx & StickyMobileCta.jsx)")
    doc.add_paragraph("Responsive navigation and conversion elements rendered on mobile viewports on the Industries Page:")

    add_heading_2(doc, "8.1 Mobile Navigation Drawer (MobileNavDrawer.jsx)")
    add_meta_item(doc, "Drawer Accessible Label", en_common["header"]["menu"], fr_common["header"]["menu"], element_type="dialog[aria-label]")
    add_meta_item(doc, "Close Button Accessible Label", en_common["a11y"]["closeMenu"], fr_common["a11y"]["closeMenu"], element_type="button[aria-label]")
    add_meta_item(doc, "Drawer Nav Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Nav Link", link_url="/")
    add_meta_item(doc, "Drawer Nav Link 2", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Nav Link", link_url="/about")
    add_meta_item(doc, "Drawer Nav Link 3 (Active)", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Nav Link (Active)", link_url="/industries")
    add_meta_item(doc, "Drawer Nav Link 4", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Nav Link", link_url="/features")
    add_meta_item(doc, "Drawer Nav Link 5", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Nav Link", link_url="/pricing")
    add_meta_item(doc, "Drawer Nav Link 6", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Nav Link", link_url="/contact")
    add_meta_item(doc, "Drawer External Sign In", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="External Link", link_url="https://login.nelias.app")
    add_meta_item(doc, "Drawer Full-width CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Full-width Button", link_url="/demo")

    add_heading_2(doc, "8.2 Sticky Mobile Floating CTA Bar (StickyMobileCta.jsx)")
    doc.add_paragraph("Floating bar appearing on viewports < 768px after scrolling 480px, auto-hidden when the footer is reached:")
    add_meta_item(doc, "Floating CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Sticky Fixed Button", link_url="/demo")

    # =========================================================================
    # SECTION 9: SITE FOOTER
    # =========================================================================
    add_heading_1(doc, "9. Site Footer (Footer.jsx)")
    doc.add_paragraph("Persistent dark footer rendered on the Industries Page, containing corporate attribution, navigation links, direct contact channels, and legal agreements:")

    add_heading_2(doc, "9.1 Brand & Corporate Attribution")
    add_meta_item(doc, "Brand Name", en_common["brand"]["name"], fr_common["brand"]["name"], element_type="Logo text")
    add_meta_item(doc, "Footer Brand Tagline", en_common["brand"]["footerTagline"], fr_common["brand"]["footerTagline"], element_type="Brand Mission Statement")

    add_heading_2(doc, "9.2 Explore Column Links")
    add_meta_item(doc, "Explore Column Heading", en_common["footer"]["exploreHeading"], fr_common["footer"]["exploreHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Explore Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Footer Link", link_url="/")
    add_meta_item(doc, "Explore Link 2 (Active Page)", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Footer Link (Current)", link_url="/industries")
    add_meta_item(doc, "Explore Link 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Footer Link", link_url="/features")
    add_meta_item(doc, "Explore Link 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Footer Link", link_url="/pricing")
    add_meta_item(doc, "Explore Link 5", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Footer Link", link_url="/contact")

    add_heading_2(doc, "9.3 Contact Column Details")
    add_meta_item(doc, "Contact Column Heading", en_common["footer"]["contactHeading"], fr_common["footer"]["contactHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Email Channel", "contact@nelias.app", element_type="Contact Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Phone Channel", "+225 05 64 05 90 60", element_type="Contact Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "WhatsApp Channel", "WhatsApp: +225 07 00 40 92 41", element_type="External Link", link_url="https://wa.me/2250700409241")
    add_meta_item(doc, "Physical Address", "Abidjan, Côte d'Ivoire", element_type="Location Item")

    add_heading_2(doc, "9.4 Legal Hairline & Copyright")
    add_meta_item(doc, "Copyright Notice", en_common["brand"]["copyright"], fr_common["brand"]["copyright"], element_type="Copyright String")
    add_meta_item(doc, "Legal Link 1", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="Legal Link", link_url="/privacy")
    add_meta_item(doc, "Legal Link 2", en_common["nav"]["terms"], fr_common["nav"]["terms"], element_type="Legal Link", link_url="/terms")
    add_meta_item(doc, "Legal Link 3", en_common["nav"]["faq"], fr_common["nav"]["faq"], element_type="Legal Link", link_url="/faq")
    add_meta_item(doc, "Legal Link 4", en_common["nav"]["dpa"], fr_common["nav"]["dpa"], element_type="Legal Link", link_url="/dpa")
    add_meta_item(doc, "Legal Link 5", en_common["nav"]["sla"], fr_common["nav"]["sla"], element_type="Legal Link", link_url="/sla")

    # Output directory and save
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "industries_page_Content.docx")
    
    doc.save(out_file)
    print(f"Document successfully created and saved at: {out_file}")

if __name__ == "__main__":
    main()
