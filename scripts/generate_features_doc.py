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

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    def load_json(rel_path):
        with open(os.path.join(base_dir, rel_path), "r", encoding="utf-8") as f:
            return json.load(f)
            
    en_features = load_json("src/i18n/locales/en/features.json")
    fr_features = load_json("src/i18n/locales/fr/features.json")
    en_home = load_json("src/i18n/locales/en/home.json")
    fr_home = load_json("src/i18n/locales/fr/home.json")
    en_pricing = load_json("src/i18n/locales/en/pricing.json")
    fr_pricing = load_json("src/i18n/locales/fr/pricing.json")
    en_industries = load_json("src/i18n/locales/en/industries.json")
    fr_industries = load_json("src/i18n/locales/fr/industries.json")
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
    r_title = p_title.add_run("NELIAS Marketing Portal - Features Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Components, Catalogs, Locales & Layouts)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    # Overview Metadata Box
    add_callout(
        doc,
        "Document Purpose: Exhaustive reference of all existing content for the NELIAS Features Page, rendered in original visual order. Preserves exact wording, spelling, punctuation, capitalization, numbers, currencies (FCFA), and formatting directly from source code.\n"
        "• Target URL: https://nelias.app/features (Route: /features)\n"
        "• Source Files: src/pages/FeaturesPage.jsx, src/sections/features/*, src/sections/home/ModulesSection.jsx, src/sections/home/SecuritySection.jsx, src/data/feature-order.js, src/data/feature-states.js, src/data/home-content.js, src/i18n/locales/*/features.json, src/i18n/locales/*/home.json, src/i18n/locales/*/pricing.json, src/i18n/locales/*/seo.json\n"
        "• Primary Language: English (EN) | Complete Bilingual Translations: French (FR)\n"
        "• Publisher & Platform: NELIAS Business Management Platform (Debass Technologies, Abidjan, Côte d'Ivoire)\n"
        "• Core Scope: Hero with Capability Mosaic, 14 Platform Modules in 3 Families, 12 Capability Areas with Interactive Industry Filtering, Security Architecture, Sector Configurations & Industry+ Packs, and Final Conversion CTA.",
        label="DOCUMENT OVERVIEW & AUDIT METADATA:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 1: PAGE-LEVEL METADATA & SEO
    # =========================================================================
    add_heading_1(doc, "1. Page-Level Metadata & SEO")
    p_seo_intro = doc.add_paragraph("Extracted from src/pages/FeaturesPage.jsx, src/components/common/Seo.jsx, and src/i18n/locales/*/seo.json:")
    p_seo_intro.paragraph_format.space_after = Pt(4)

    add_meta_item(doc, "SEO Page Title", en_seo["features"]["title"], fr_seo["features"]["title"], element_type="<title> tag")
    add_meta_item(doc, "Meta Description", en_seo["features"]["description"], fr_seo["features"]["description"], element_type="meta[name='description']")
    add_meta_item(doc, "Canonical URL", "https://nelias.app/features", element_type="link[rel='canonical']")
    add_meta_item(doc, "OpenGraph Title", en_seo["features"]["title"], fr_seo["features"]["title"], element_type="meta[property='og:title']")
    add_meta_item(doc, "OpenGraph Description", en_seo["features"]["description"], fr_seo["features"]["description"], element_type="meta[property='og:description']")
    add_meta_item(doc, "OpenGraph Type", "website", element_type="meta[property='og:type']")
    add_meta_item(doc, "OpenGraph Site Name", "NELIAS", element_type="meta[property='og:site_name']")
    add_meta_item(doc, "OpenGraph Locale", "en_US | [FR]: fr_FR", element_type="meta[property='og:locale']")
    add_meta_item(doc, "Twitter Card Type", "summary", element_type="meta[name='twitter:card']")

    # =========================================================================
    # SECTION 2: GLOBAL HEADER & NAVIGATION
    # =========================================================================
    add_heading_1(doc, "2. Global Header, Utility Bar & Navigation")
    doc.add_paragraph("Persistent top navigation rendered on the Features Page via RootLayout.jsx, UtilityBar.jsx, and Header.jsx:")

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
    add_meta_item(doc, "Nav Item 3 (Active Page)", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Header Nav Link (aria-current='page')", link_url="/features")
    add_meta_item(doc, "Nav Item 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Header Nav Link", link_url="/pricing")
    add_meta_item(doc, "Header Primary CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button", link_url="/demo")
    add_meta_item(doc, "Mobile Menu Trigger", en_common["a11y"]["openMenu"], fr_common["a11y"]["openMenu"], element_type="Hamburger Button")

    # =========================================================================
    # SECTION 3: FEATURES HERO & CAPABILITY MOSAIC
    # =========================================================================
    add_heading_1(doc, "3. Features Hero Header & Capability Mosaic (PageHeader.jsx & CapabilityMosaic.jsx)")
    doc.add_paragraph("The hero header presents the modular platform capability scope alongside an animated SVG capability mosaic:")

    add_heading_2(doc, "3.1 Hero Text & Scope Statement")
    add_meta_item(doc, "Hero Headline (H1)", en_features["hero"]["title"], fr_features["hero"]["title"], element_type="Main Headline (H1)")
    add_meta_item(doc, "Hero Subtitle / Lead", en_features["hero"]["lead"], fr_features["hero"]["lead"], element_type="Lead Paragraph")
    add_meta_item(doc, "Visual Background Tone", "tint", element_type="Section Tone")

    add_callout(
        doc,
        f"[EN]: \"{en_features['hero']['lead']}\"\n\n"
        f"[FR]: \"{fr_features['hero']['lead']}\"",
        label="CORE PLATFORM CAPABILITY SCOPE STATEMENT:",
        border_color=HEX_AZURE
    )

    add_heading_2(doc, "3.2 Capability Mosaic Visual Art (CapabilityMosaic.jsx)")
    doc.add_paragraph("Decorative interactive mosaic layer illustrating the 12 capability areas with an animated gradient SVG ribbon sweep (Flame-500 to Sun-300) and staggered entrance tiles:")
    add_meta_item(doc, "Mosaic Grid Dimensions", "4 columns x 3 rows (Aspect ratio 4/3)", element_type="Responsive Visual Grid")
    add_meta_item(doc, "Primary Brand Highlight Tiles", "Indices 0, 5, 10 (Selected Navy / Flame fill)", element_type="Visual Highlighting")
    add_meta_item(doc, "Secondary Accent Soft Tiles", "Indices 2, 7 (Accent soft warm peach fill)", element_type="Visual Highlighting")

    # =========================================================================
    # SECTION 4: PLATFORM MODULES SECTION
    # =========================================================================
    add_heading_1(doc, "4. Platform Modules & Domain Families (ModulesSection.jsx)")
    doc.add_paragraph("Extracted from ModulesSection.jsx, home-content.js, and locales/*/home.json. Presents the 14 standard platform modules organized into 3 functional families, plan quotas, extra module pricing, and architectural benefits:")

    add_heading_2(doc, "4.1 Section Title & Plan Allotment Intro")
    add_meta_item(doc, "Section Title (H2)", en_home["modules"]["title"], fr_home["modules"]["title"], element_type="Section Heading (H2)")

    en_mod_intro = en_home["modules"]["intro"].replace("{{start}}", "4").replace("{{business}}", "6").replace("{{professional}}", "8")
    fr_mod_intro = fr_home["modules"]["intro"].replace("{{start}}", "4").replace("{{business}}", "6").replace("{{professional}}", "8")
    add_meta_item(doc, "Intro Paragraph", en_mod_intro, fr_mod_intro, element_type="Lead Paragraph")

    add_heading_2(doc, "4.2 The 14 Standard Modules Catalog across 3 Functional Domains")

    tbl_mods = doc.add_table(rows=1, cols=4)
    tbl_mods.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_mods)
    hdr_mods = tbl_mods.rows[0]
    hdr_mods.cells[0].paragraphs[0].add_run("Functional Family")
    hdr_mods.cells[1].paragraphs[0].add_run("Module ID")
    hdr_mods.cells[2].paragraphs[0].add_run("English Name")
    hdr_mods.cells[3].paragraphs[0].add_run("French Name")
    format_row(hdr_mods, is_header=True, bg_color=HEX_NAVY)

    mod_catalog = [
        # Customer relations (5)
        ("Customer relations (5 modules)\n[FR]: Relation client", "sales", en_home["modules"]["names"]["sales"], fr_home["modules"]["names"]["sales"]),
        ("Customer relations", "crm", en_home["modules"]["names"]["crm"], fr_home["modules"]["names"]["crm"]),
        ("Customer relations", "marketing", en_home["modules"]["names"]["marketing"], fr_home["modules"]["names"]["marketing"]),
        ("Customer relations", "customerSupport", en_home["modules"]["names"]["customerSupport"], fr_home["modules"]["names"]["customerSupport"]),
        ("Customer relations", "pointOfSale", en_home["modules"]["names"]["pointOfSale"], fr_home["modules"]["names"]["pointOfSale"]),
        # Operations (5)
        ("Operations (5 modules)\n[FR]: Opérations", "purchasing", en_home["modules"]["names"]["purchasing"], fr_home["modules"]["names"]["purchasing"]),
        ("Operations", "inventory", en_home["modules"]["names"]["inventory"], fr_home["modules"]["names"]["inventory"]),
        ("Operations", "production", en_home["modules"]["names"]["production"], fr_home["modules"]["names"]["production"]),
        ("Operations", "quality", en_home["modules"]["names"]["quality"], fr_home["modules"]["names"]["quality"]),
        ("Operations", "assets", en_home["modules"]["names"]["assets"], fr_home["modules"]["names"]["assets"]),
        # Finance and teams (4)
        ("Finance and teams (4 modules)\n[FR]: Finance et équipes", "accounting", en_home["modules"]["names"]["accounting"], fr_home["modules"]["names"]["accounting"]),
        ("Finance and teams", "payroll", en_home["modules"]["names"]["payroll"], fr_home["modules"]["names"]["payroll"]),
        ("Finance and teams", "hr", en_home["modules"]["names"]["hr"], fr_home["modules"]["names"]["hr"]),
        ("Finance and teams", "projects", en_home["modules"]["names"]["projects"], fr_home["modules"]["names"]["projects"]),
    ]
    for idx, (fam, m_id, en_n, fr_n) in enumerate(mod_catalog):
        row = tbl_mods.add_row()
        row.cells[0].paragraphs[0].add_run(fam)
        row.cells[1].paragraphs[0].add_run(m_id)
        row.cells[2].paragraphs[0].add_run(en_n)
        row.cells[3].paragraphs[0].add_run(fr_n)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "4.3 Additional Standard Module Callout & Pricing Link")
    en_extra_mod = en_home["modules"]["extraModule"].replace("{{amount}}", "15,000 FCFA")
    fr_extra_mod = fr_home["modules"]["extraModule"].replace("{{amount}}", "15 000 FCFA")
    add_callout(
        doc,
        f"[EN]: {en_extra_mod}\n[FR]: {fr_extra_mod}",
        label="EXTRA MODULE COST CALLOUT (Shown when pricingPublic=true):",
        border_color=HEX_ORANGE
    )
    add_meta_item(doc, "Direct Pricing Navigation Link", en_home["pricing"]["cta"], fr_home["pricing"]["cta"], element_type="TextLink", link_url="/pricing")

    add_heading_2(doc, "4.4 Platform Architectural Benefits (Divided Surface Panel)")
    add_meta_item(
        doc,
        "Benefit 1: Zero Re-entry",
        f"{en_home['modules']['benefits']['zeroReentry']['title']} - {en_home['modules']['benefits']['zeroReentry']['text']}",
        f"{fr_home['modules']['benefits']['zeroReentry']['title']} - {fr_home['modules']['benefits']['zeroReentry']['text']}",
        element_type="Architectural Benefit Card"
    )
    add_meta_item(
        doc,
        "Benefit 2: End-to-End Tracking",
        f"{en_home['modules']['benefits']['tracking']['title']} - {en_home['modules']['benefits']['tracking']['text']}",
        f"{fr_home['modules']['benefits']['tracking']['title']} - {fr_home['modules']['benefits']['tracking']['text']}",
        element_type="Architectural Benefit Card"
    )
    add_meta_item(
        doc,
        "Benefit 3: Roles and Permissions",
        f"{en_home['modules']['benefits']['roles']['title']} - {en_home['modules']['benefits']['roles']['text']}",
        f"{fr_home['modules']['benefits']['roles']['title']} - {fr_home['modules']['benefits']['roles']['text']}",
        element_type="Architectural Benefit Card"
    )

    # =========================================================================
    # SECTION 5: CAPABILITY AREAS WITH INDUSTRY FILTER TABS
    # =========================================================================
    add_heading_1(doc, "5. Capability Areas with Industry Filtering (FeatureFilterList.jsx & FeatureList.jsx)")
    doc.add_paragraph("Extracted from FeatureFilterList.jsx, FeatureList.jsx, feature-order.js, feature-states.js, and locales/*/features.json. Interactive catalog of 12 capability areas with filter tabs for all 12 business sectors:")

    add_heading_2(doc, "5.1 Filtering Controls & Counter")
    add_meta_item(doc, "Filter Component Label", en_features["page"]["filterLabel"], fr_features["page"]["filterLabel"], element_type="Tabs Label")
    add_meta_item(doc, "Default Tab (All Industries)", en_features["page"]["filterAll"], fr_features["page"]["filterAll"], element_type="Tab Button (Value: 'all')")
    add_meta_item(doc, "Capability List Accessibility Label", en_features["page"]["listLabel"], fr_features["page"]["listLabel"], element_type="ul[aria-label]")
    
    en_showing_ex = en_features["page"]["showing"].replace("{{shown}}", "12").replace("{{total}}", "12")
    fr_showing_ex = fr_features["page"]["showing"].replace("{{shown}}", "12").replace("{{total}}", "12")
    add_meta_item(doc, "Live Counter", en_showing_ex, fr_showing_ex, element_type="aria-live polite counter")
    add_meta_item(doc, "Empty State Notice", en_features["page"]["empty"], fr_features["page"]["empty"], element_type="Alert (tone='note')")

    add_heading_2(doc, "5.2 The 12 Supported Industry Sector Filter Tabs")

    tbl_tabs = doc.add_table(rows=1, cols=3)
    tbl_tabs.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_tabs)
    hdr_tabs = tbl_tabs.rows[0]
    hdr_tabs.cells[0].paragraphs[0].add_run("Tab ID / Slug")
    hdr_tabs.cells[1].paragraphs[0].add_run("Tab Label (English)")
    hdr_tabs.cells[2].paragraphs[0].add_run("Tab Label (French)")
    format_row(hdr_tabs, is_header=True, bg_color=HEX_NAVY)

    row_all = tbl_tabs.add_row()
    row_all.cells[0].paragraphs[0].add_run("all")
    row_all.cells[1].paragraphs[0].add_run(en_features["page"]["filterAll"])
    row_all.cells[2].paragraphs[0].add_run(fr_features["page"]["filterAll"])
    format_row(row_all, bg_color=HEX_WHITE)

    ind_slugs = [
        "retail-distribution", "professional-services", "manufacturing", "healthcare",
        "hospitality", "education-training", "insurance-financial-services",
        "energy-field-services", "real-estate", "pharmacies", "construction-btp",
        "it-technology-services"
    ]
    for idx, slug in enumerate(ind_slugs):
        row = tbl_tabs.add_row()
        row.cells[0].paragraphs[0].add_run(slug)
        row.cells[1].paragraphs[0].add_run(en_industries["items"][slug]["name"])
        row.cells[2].paragraphs[0].add_run(fr_industries["items"][slug]["name"])
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.3 The 12 Comprehensive Capability Areas Catalog")

    tbl_caps = doc.add_table(rows=1, cols=5)
    tbl_caps.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_caps)
    hdr_caps = tbl_caps.rows[0]
    hdr_caps.cells[0].paragraphs[0].add_run("Capability Key")
    hdr_caps.cells[1].paragraphs[0].add_run("Name (English)")
    hdr_caps.cells[2].paragraphs[0].add_run("Name (French)")
    hdr_caps.cells[3].paragraphs[0].add_run("Verbatim Description (EN / FR)")
    hdr_caps.cells[4].paragraphs[0].add_run("Availability Badge")
    format_row(hdr_caps, is_header=True, bg_color=HEX_NAVY)

    cap_keys = [
        "finance-accounting", "crm-sales", "purchasing-inventory", "point-of-sale",
        "projects-timesheets", "human-resources", "manufacturing-quality", "assets-maintenance",
        "customer-support-portal", "reporting-analytics", "workflows-automation", "connectors-apis"
    ]
    for idx, key in enumerate(cap_keys):
        row = tbl_caps.add_row()
        row.cells[0].paragraphs[0].add_run(key)
        row.cells[1].paragraphs[0].add_run(en_features["areas"][key]["name"])
        row.cells[2].paragraphs[0].add_run(fr_features["areas"][key]["name"])
        row.cells[3].paragraphs[0].add_run(f"[EN]: {en_features['areas'][key]['description']}\n\n[FR]: {fr_features['areas'][key]['description']}")
        row.cells[4].paragraphs[0].add_run(f"{en_common['ui']['availability']['demoOnly']} | [FR]: {fr_common['ui']['availability']['demoOnly']}")
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.4 Capabilities Statutory Disclaimer Note")
    add_callout(
        doc,
        f"[EN]: \"{en_features['disclaimer']}\"\n\n"
        f"[FR]: \"{fr_features['disclaimer']}\"",
        label="ADVANCED CAPABILITIES & ROADMAP DISCLAIMER:",
        border_color=HEX_ORANGE
    )

    # =========================================================================
    # SECTION 6: SECURITY & DATA ISOLATION
    # =========================================================================
    add_heading_1(doc, "6. Security & Data Isolation (SecuritySection.jsx)")
    doc.add_paragraph("Extracted from SecuritySection.jsx, home-content.js, and locales/*/home.json. Institutional guarantees on security architecture, hosting, and data sovereignty:")

    add_meta_item(doc, "Section Heading (H2)", en_home["security"]["title"], fr_home["security"]["title"], element_type="Section Heading (H2)")

    tbl_sec = doc.add_table(rows=1, cols=3)
    tbl_sec.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sec)
    hdr_sec = tbl_sec.rows[0]
    hdr_sec.cells[0].paragraphs[0].add_run("Security Pillar")
    hdr_sec.cells[1].paragraphs[0].add_run("English Specification")
    hdr_sec.cells[2].paragraphs[0].add_run("French Specification")
    format_row(hdr_sec, is_header=True, bg_color=HEX_NAVY)

    sec_items = [
        ("access", en_home["security"]["items"]["access"], fr_home["security"]["items"]["access"]),
        ("encryption", en_home["security"]["items"]["encryption"], fr_home["security"]["items"]["encryption"]),
        ("isolation", en_home["security"]["items"]["isolation"], fr_home["security"]["items"]["isolation"]),
        ("audit", en_home["security"]["items"]["audit"], fr_home["security"]["items"]["audit"]),
    ]
    for idx, (s_k, s_e, s_f) in enumerate(sec_items):
        row = tbl_sec.add_row()
        row.cells[0].paragraphs[0].add_run(s_k.capitalize())
        row.cells[1].paragraphs[0].add_run(s_e)
        row.cells[2].paragraphs[0].add_run(s_f)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 7: SECTOR CONFIGURATIONS & INDUSTRY+ PACKS
    # =========================================================================
    add_heading_1(doc, "7. Sector Configurations & Industry+ Packs (FeaturesSectors.jsx)")
    doc.add_paragraph("Extracted from FeaturesSectors.jsx, home-pricing.js, and locales/*/pricing.json. Explains Sector Engine inclusion and previews 5 specialized vertical packs:")

    add_heading_2(doc, "7.1 Sector Engine Reassurance Card")
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

    add_heading_2(doc, "7.2 Industry+ Packs Preview (5 Planned Industry Packs)")
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

    add_meta_item(doc, "Explore Industries Link", en_features["extras"]["exploreIndustries"], fr_features["extras"]["exploreIndustries"], element_type="Outline Button", link_url="/industries")

    # =========================================================================
    # SECTION 8: CLOSING CONVERSION CTA BAND
    # =========================================================================
    add_heading_1(doc, "8. Final Conversion CTA Band (FeaturesClosing.jsx)")
    doc.add_paragraph("Full-width high-contrast inverse band closing the Features Page with two clear conversion pathways:")

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
    # SECTION 9: MOBILE DRAWER & STICKY CTA
    # =========================================================================
    add_heading_1(doc, "9. Mobile Drawer & Floating CTA (MobileNavDrawer.jsx & StickyMobileCta.jsx)")
    doc.add_paragraph("Responsive navigation and conversion elements rendered on mobile viewports on the Features Page:")

    add_heading_2(doc, "9.1 Mobile Navigation Drawer (MobileNavDrawer.jsx)")
    add_meta_item(doc, "Drawer Accessible Label", en_common["header"]["menu"], fr_common["header"]["menu"], element_type="dialog[aria-label]")
    add_meta_item(doc, "Close Button Accessible Label", en_common["a11y"]["closeMenu"], fr_common["a11y"]["closeMenu"], element_type="button[aria-label]")
    add_meta_item(doc, "Drawer Nav Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Nav Link", link_url="/")
    add_meta_item(doc, "Drawer Nav Link 2", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Nav Link", link_url="/about")
    add_meta_item(doc, "Drawer Nav Link 3", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Nav Link", link_url="/industries")
    add_meta_item(doc, "Drawer Nav Link 4 (Active)", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Nav Link (Active)", link_url="/features")
    add_meta_item(doc, "Drawer Nav Link 5", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Nav Link", link_url="/pricing")
    add_meta_item(doc, "Drawer Nav Link 6", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Nav Link", link_url="/contact")
    add_meta_item(doc, "Drawer External Sign In", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="External Link", link_url="https://login.nelias.app")
    add_meta_item(doc, "Drawer Full-width CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Full-width Button", link_url="/demo")

    add_heading_2(doc, "9.2 Sticky Mobile Floating CTA Bar (StickyMobileCta.jsx)")
    doc.add_paragraph("Floating bar appearing on viewports < 768px after scrolling 480px, auto-hidden when the footer is reached:")
    add_meta_item(doc, "Floating CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Sticky Fixed Button", link_url="/demo")

    # =========================================================================
    # SECTION 10: SITE FOOTER
    # =========================================================================
    add_heading_1(doc, "10. Site Footer (Footer.jsx)")
    doc.add_paragraph("Persistent dark footer rendered on the Features Page, containing corporate attribution, navigation links, direct contact channels, and legal agreements:")

    add_heading_2(doc, "10.1 Brand & Corporate Attribution")
    add_meta_item(doc, "Brand Name", en_common["brand"]["name"], fr_common["brand"]["name"], element_type="Logo text")
    add_meta_item(doc, "Footer Brand Tagline", en_common["brand"]["footerTagline"], fr_common["brand"]["footerTagline"], element_type="Brand Mission Statement")

    add_heading_2(doc, "10.2 Explore Column Links")
    add_meta_item(doc, "Explore Column Heading", en_common["footer"]["exploreHeading"], fr_common["footer"]["exploreHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Explore Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Footer Link", link_url="/")
    add_meta_item(doc, "Explore Link 2", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Footer Link", link_url="/industries")
    add_meta_item(doc, "Explore Link 3 (Active Page)", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Footer Link (Current)", link_url="/features")
    add_meta_item(doc, "Explore Link 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Footer Link", link_url="/pricing")
    add_meta_item(doc, "Explore Link 5", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Footer Link", link_url="/contact")

    add_heading_2(doc, "10.3 Contact Column Details")
    add_meta_item(doc, "Contact Column Heading", en_common["footer"]["contactHeading"], fr_common["footer"]["contactHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Email Channel", "contact@nelias.app", element_type="Contact Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Phone Channel", "+225 05 64 05 90 60", element_type="Contact Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "WhatsApp Channel", "WhatsApp: +225 07 00 40 92 41", element_type="External Link", link_url="https://wa.me/2250700409241")
    add_meta_item(doc, "Physical Address", "Abidjan, Côte d'Ivoire", element_type="Location Item")

    add_heading_2(doc, "10.4 Legal Hairline & Copyright")
    add_meta_item(doc, "Copyright Notice", en_common["brand"]["copyright"], fr_common["brand"]["copyright"], element_type="Copyright String")
    add_meta_item(doc, "Legal Link 1", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="Legal Link", link_url="/privacy")
    add_meta_item(doc, "Legal Link 2", en_common["nav"]["terms"], fr_common["nav"]["terms"], element_type="Legal Link", link_url="/terms")
    add_meta_item(doc, "Legal Link 3", en_common["nav"]["faq"], fr_common["nav"]["faq"], element_type="Legal Link", link_url="/faq")
    add_meta_item(doc, "Legal Link 4", en_common["nav"]["dpa"], fr_common["nav"]["dpa"], element_type="Legal Link", link_url="/dpa")
    add_meta_item(doc, "Legal Link 5", en_common["nav"]["sla"], fr_common["nav"]["sla"], element_type="Legal Link", link_url="/sla")

    # Output directory and save
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "features_page_Content.docx")
    
    doc.save(out_file)
    print(f"Document successfully created and saved at: {out_file}")

if __name__ == "__main__":
    main()
