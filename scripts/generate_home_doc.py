import os
import json
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Colors
NAVY = RGBColor(0x0F, 0x17, 0x2A)      # #0F172A - Headings, Primary brand
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary CTA, accent
AZURE = RGBColor(0x02, 0x84, 0xC7)     # #0284C7 - Secondary links, badges
SLATE = RGBColor(0x47, 0x55, 0x69)     # #475569 - Secondary text, muted
INK = RGBColor(0x1E, 0x29, 0x3B)       # #1E293B - Body text
WHITE = RGBColor(0xFF, 0xFF, 0xFF)     # #FFFFFF

HEX_NAVY = "0F172A"
HEX_ORANGE = "EA580C"
HEX_AZURE = "0284C7"
HEX_LIGHT_BG = "F8FAFC"
HEX_BORDER = "CBD5E1"
HEX_MUTED_BG = "F1F5F9"
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
        run_lbl = p.add_run(f"{label} ")
        run_lbl.bold = True
        run_lbl.font.color.rgb = NAVY
        run_lbl.font.size = Pt(10)
    
    run_txt = p.add_run(text)
    run_txt.font.size = Pt(10)
    run_txt.font.color.rgb = INK
    
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)

def format_row(row, is_header=False, bg_color=None):
    for cell in row.cells:
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
        if bg_color:
            set_cell_background(cell, bg_color)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
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
    r.font.size = Pt(16)
    r.font.color.rgb = NAVY
    return h

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(12.5)
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
    
    # Load JSON resources
    def load_json(rel_path):
        with open(os.path.join(base_dir, rel_path), "r", encoding="utf-8") as f:
            return json.load(f)
            
    en_home = load_json("src/i18n/locales/en/home.json")
    fr_home = load_json("src/i18n/locales/fr/home.json")
    en_common = load_json("src/i18n/locales/en/common.json")
    fr_common = load_json("src/i18n/locales/fr/common.json")
    en_pricing = load_json("src/i18n/locales/en/pricing.json")
    fr_pricing = load_json("src/i18n/locales/fr/pricing.json")

    doc = Document()
    
    # Configure 1-inch margins
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # Base style
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
    r_title = p_title.add_run("NELIAS Marketing Portal - Home Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Components, Locales & Catalogs)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    # Overview Metadata Box
    add_callout(
        doc,
        "Document Purpose: Exhaustive reference of all existing content for the NELIAS Home Page, rendered in original visual order. Preserves exact wording, spelling, punctuation, capitalization, symbols, and formatting directly from source code.\n"
        "• Target URL: https://nelias.app/ (Route: /)\n"
        "• Source Files: src/pages/HomePage.jsx, src/sections/home/*, src/components/layout/*, src/i18n/locales/*\n"
        "• Primary Language: English (EN) | Translations Included: French (FR)\n"
        "• Publisher & Platform: NELIAS Business Management Platform (Debass Technologies, Abidjan, Côte d'Ivoire)",
        label="DOCUMENT OVERVIEW & AUDIT METADATA:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 0: PAGE METADATA & SEO
    # =========================================================================
    add_heading_1(doc, "1. Page-Level Metadata & SEO")
    p_intro = doc.add_paragraph("Extracted from src/pages/HomePage.jsx and locales/*/home.json:")
    p_intro.paragraph_format.space_after = Pt(4)
    
    add_meta_item(doc, "SEO Page Title", en_home["seo"]["title"], fr_home["seo"]["title"], element_type="<title> tag")
    add_meta_item(doc, "Meta Description (With Public Prices)", en_home["seo"]["description"], fr_home["seo"]["description"], element_type="meta[name='description']")
    add_meta_item(doc, "Meta Description (No Public Prices Gated)", en_home["seo"]["descriptionNoPrices"], fr_home["seo"]["descriptionNoPrices"], element_type="meta[name='description'] (Gated mode)")
    add_meta_item(doc, "Canonical URL", "https://nelias.app/", element_type="link[rel='canonical']")
    add_meta_item(doc, "OpenGraph Type", "website", element_type="meta[property='og:type']")

    # =========================================================================
    # SECTION 1: GLOBAL HEADER & NAVIGATION
    # =========================================================================
    add_heading_1(doc, "2. Global Header, Utility Bar & Navigation")
    doc.add_paragraph("Persistent top navigation rendered on the Home Page through RootLayout.jsx, UtilityBar.jsx, and Header.jsx:")

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
    add_meta_item(doc, "Nav Item 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Header Nav Link", link_url="/pricing")
    add_meta_item(doc, "Header Primary CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button", link_url="/demo")
    add_meta_item(doc, "Mobile Menu Trigger", en_common["a11y"]["openMenu"], fr_common["a11y"]["openMenu"], element_type="Hamburger Button")

    # =========================================================================
    # SECTION 2: HERO SECTION
    # =========================================================================
    add_heading_1(doc, "3. Home Section 1: Hero (HomeHero.jsx & HeroComposition.jsx)")
    doc.add_paragraph("The hero section presents the platform value proposition, two primary call-to-action buttons, public price reassurance, and an animated workspace composition:")

    add_heading_2(doc, "3.1 Hero Text & CTAs")
    add_meta_item(doc, "Eyebrow Category", en_home["hero"]["eyebrow"], fr_home["hero"]["eyebrow"], element_type="Small Heading / Pill")
    add_meta_item(doc, "Hero Headline (H1)", en_home["hero"]["title"], fr_home["hero"]["title"], element_type="Main Headline (H1)")
    add_meta_item(doc, "Hero Subtitle / Lead", en_home["hero"]["subtitle"], fr_home["hero"]["subtitle"], element_type="Lead Paragraph")
    add_meta_item(doc, "Primary Action Button", en_home["hero"]["simulatePrice"], fr_home["hero"]["simulatePrice"], element_type="Primary Button (Orange)", link_url="/configure")
    add_meta_item(doc, "Secondary Action Button", en_common["cta"]["talkToExpert"], fr_common["cta"]["talkToExpert"], element_type="Outline Button", link_url="/contact")
    add_meta_item(doc, "Reassurance Statement", en_home["hero"]["reassurance"], fr_home["hero"]["reassurance"], element_type="Reassurance Text (Shown when pricingPublic=true)")

    add_heading_2(doc, "3.2 Hero Visual Composition (HeroComposition.jsx)")
    doc.add_paragraph("Visual workspace preview panel with browser chrome and 6 live capability tiles:")
    add_meta_item(doc, "Chrome Address Bar", en_home["composition"]["address"], fr_home["composition"]["address"], element_type="Simulated URL Pill")
    
    # Table for 6 Hero Capability Tiles
    tbl_tiles = doc.add_table(rows=1, cols=3)
    tbl_tiles.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_tiles)
    hdr_tiles = tbl_tiles.rows[0]
    hdr_tiles.cells[0].paragraphs[0].add_run("Tile ID")
    hdr_tiles.cells[1].paragraphs[0].add_run("English Label")
    hdr_tiles.cells[2].paragraphs[0].add_run("French Label")
    format_row(hdr_tiles, is_header=True, bg_color=HEX_NAVY)

    tile_ids = [
        ("sales", en_home["heroTiles"]["sales"], fr_home["heroTiles"]["sales"]),
        ("crm", en_home["heroTiles"]["crm"], fr_home["heroTiles"]["crm"]),
        ("purchasing", en_home["heroTiles"]["purchasing"], fr_home["heroTiles"]["purchasing"]),
        ("inventory", en_home["heroTiles"]["inventory"], fr_home["heroTiles"]["inventory"]),
        ("accounting", en_home["heroTiles"]["accounting"], fr_home["heroTiles"]["accounting"]),
        ("projects", en_home["heroTiles"]["projects"], fr_home["heroTiles"]["projects"]),
    ]
    for idx, (t_id, en_val, fr_val) in enumerate(tile_ids):
        row = tbl_tiles.add_row()
        row.cells[0].paragraphs[0].add_run(t_id)
        row.cells[1].paragraphs[0].add_run(en_val)
        row.cells[2].paragraphs[0].add_run(fr_val)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    # =========================================================================
    # SECTION 3: MODULES SECTION
    # =========================================================================
    add_heading_1(doc, "4. Home Section 2: Modules (ModulesSection.jsx)")
    doc.add_paragraph("Presents the 14 standard platform modules organized into 3 functional families, standard module allotments per plan, extra module pricing, and 3 platform architectural benefits:")

    add_heading_2(doc, "4.1 Section Title & Plan Allotment Intro")
    add_meta_item(doc, "Section Title (H2)", en_home["modules"]["title"], fr_home["modules"]["title"], element_type="Section Heading (H2)")
    
    en_modules_intro = en_home["modules"]["intro"].replace("{{start}}", "4").replace("{{business}}", "6").replace("{{professional}}", "8")
    fr_modules_intro = fr_home["modules"]["intro"].replace("{{start}}", "4").replace("{{business}}", "6").replace("{{professional}}", "8")
    add_meta_item(doc, "Intro Paragraph", en_modules_intro, fr_modules_intro, element_type="Lead Paragraph")

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
        ("Customer relations (5 modules)", "sales", en_home["modules"]["names"]["sales"], fr_home["modules"]["names"]["sales"]),
        ("Customer relations", "crm", en_home["modules"]["names"]["crm"], fr_home["modules"]["names"]["crm"]),
        ("Customer relations", "marketing", en_home["modules"]["names"]["marketing"], fr_home["modules"]["names"]["marketing"]),
        ("Customer relations", "customerSupport", en_home["modules"]["names"]["customerSupport"], fr_home["modules"]["names"]["customerSupport"]),
        ("Customer relations", "pointOfSale", en_home["modules"]["names"]["pointOfSale"], fr_home["modules"]["names"]["pointOfSale"]),
        # Operations (5)
        ("Operations (5 modules)", "purchasing", en_home["modules"]["names"]["purchasing"], fr_home["modules"]["names"]["purchasing"]),
        ("Operations", "inventory", en_home["modules"]["names"]["inventory"], fr_home["modules"]["names"]["inventory"]),
        ("Operations", "production", en_home["modules"]["names"]["production"], fr_home["modules"]["names"]["production"]),
        ("Operations", "quality", en_home["modules"]["names"]["quality"], fr_home["modules"]["names"]["quality"]),
        ("Operations", "assets", en_home["modules"]["names"]["assets"], fr_home["modules"]["names"]["assets"]),
        # Finance and teams (4)
        ("Finance and teams (4 modules)", "accounting", en_home["modules"]["names"]["accounting"], fr_home["modules"]["names"]["accounting"]),
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

    add_heading_2(doc, "4.3 Additional Standard Module Callout")
    en_extra_mod = en_home["modules"]["extraModule"].replace("{{amount}}", "15,000 FCFA")
    fr_extra_mod = fr_home["modules"]["extraModule"].replace("{{amount}}", "15 000 FCFA")
    add_callout(
        doc,
        f"[EN]: {en_extra_mod}\n[FR]: {fr_extra_mod}",
        label="PRICING CALLOUT (Shown when pricingPublic=true):",
        border_color=HEX_ORANGE
    )

    add_heading_2(doc, "4.4 Platform Architectural Benefits (Divided Surface Panel)")
    add_meta_item(
        doc,
        "Benefit 1",
        f"{en_home['modules']['benefits']['zeroReentry']['title']} - {en_home['modules']['benefits']['zeroReentry']['text']}",
        f"{fr_home['modules']['benefits']['zeroReentry']['title']} - {fr_home['modules']['benefits']['zeroReentry']['text']}",
        element_type="Platform Benefit Card"
    )
    add_meta_item(
        doc,
        "Benefit 2",
        f"{en_home['modules']['benefits']['tracking']['title']} - {en_home['modules']['benefits']['tracking']['text']}",
        f"{fr_home['modules']['benefits']['tracking']['text']}",
        element_type="Platform Benefit Card"
    )
    add_meta_item(
        doc,
        "Benefit 3",
        f"{en_home['modules']['benefits']['roles']['title']} - {en_home['modules']['benefits']['roles']['text']}",
        f"{fr_home['modules']['benefits']['roles']['text']}",
        element_type="Platform Benefit Card"
    )

    # =========================================================================
    # SECTION 4: PRICING SECTION
    # =========================================================================
    add_heading_1(doc, "5. Home Section 3: Pricing (HomePricingSection.jsx)")
    doc.add_paragraph("Displays the four pricing formulas in card format with interactive billing switcher, feature specification table, plan CTAs, and commercial notes:")

    add_heading_2(doc, "5.1 Section Title & Location Policy")
    add_meta_item(doc, "Section Title (H2)", en_home["pricing"]["title"], fr_home["pricing"]["title"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Public Prices Intro", en_home["pricing"]["introPrices"], fr_home["pricing"]["introPrices"], element_type="Lead Text (When pricingPublic=true)")
    add_meta_item(doc, "Location Agnostic Policy", en_home["pricing"]["introLocation"], fr_home["pricing"]["introLocation"], element_type="Lead Text")

    add_heading_2(doc, "5.2 Billing Switcher & Annual Note")
    add_meta_item(doc, "Billing Period Label", en_pricing["page"]["billingLabel"], fr_pricing["page"]["billingLabel"], element_type="Control Label")
    add_meta_item(doc, "Monthly Option", en_pricing["page"]["monthly"], fr_pricing["page"]["monthly"], element_type="Toggle Option")
    add_meta_item(doc, "Annual Option & Badge", f"{en_pricing['page']['annual']} (Badge: -16%)", f"{fr_pricing['page']['annual']} (Badge: -16%)", element_type="Toggle Option")
    add_meta_item(doc, "Annual Discount Formula", en_home["pricing"]["annual"], fr_home["pricing"]["annual"], element_type="Billing Rule Note")

    add_heading_2(doc, "5.3 Four Plan Cards Comparison Matrix")
    doc.add_paragraph("Detailed specifications for all four formulas rendered on the Home Page:")

    tbl_pricing = doc.add_table(rows=1, cols=5)
    tbl_pricing.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_pricing)
    hdr_p = tbl_pricing.rows[0]
    hdr_p.cells[0].paragraphs[0].add_run("Specification")
    hdr_p.cells[1].paragraphs[0].add_run("START")
    hdr_p.cells[2].paragraphs[0].add_run("BUSINESS (★)")
    hdr_p.cells[3].paragraphs[0].add_run("PROFESSIONAL")
    hdr_p.cells[4].paragraphs[0].add_run("ENTERPRISE")
    format_row(hdr_p, is_header=True, bg_color=HEX_NAVY)

    pricing_matrix = [
        ("Target Audience", "Very small and small businesses", "SMEs", "Structured companies", "Large companies, groups"),
        ("Monthly Price (excl. VAT)", "49,000 FCFA / month", "129,000 FCFA / month", "249,000 FCFA / month", "On quote (Custom quote)"),
        ("Annual Price (excl. VAT)", "490,000 FCFA / year", "1,290,000 FCFA / year", "2,490,000 FCFA / year", "On quote (Custom quote)"),
        ("Hidden Price State", "Pricing on request", "Pricing on request", "Pricing on request", "On quote"),
        ("Standard Modules Included", "4 modules", "6 modules", "8 modules", "As needed"),
        ("Users Included", "5 users", "15 users", "40 users", "As needed"),
        ("Legal Entities Included", "1 entity", "1 entity", "2 entities", "Multi-entity"),
        ("Storage Included", "10 GB", "25 GB", "50 GB", "Sized to need"),
        ("Sector Engine", "Included", "Included", "Included", "Included"),
        ("Service Level", "Standard", "Standard+", "Priority", "SLA"),
        ("Card CTA Button", "Configure My NELIAS", "Configure My NELIAS (Featured)", "Configure My NELIAS", "Talk to an Expert"),
        ("CTA Destination", "https://login.nelias.app/", "https://login.nelias.app/", "https://login.nelias.app/", "/contact"),
    ]
    for idx, row_data in enumerate(pricing_matrix):
        row = tbl_pricing.add_row()
        for c_idx, val in enumerate(row_data):
            row.cells[c_idx].paragraphs[0].add_run(val)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.4 Enterprise Specifications & Bottom CTA")
    add_meta_item(doc, "Enterprise Environment Note", en_home["pricing"]["enterprise"], fr_home["pricing"]["enterprise"], element_type="Enterprise Card Note")
    add_meta_item(doc, "Pricing Section CTA Button", en_home["pricing"]["cta"], fr_home["pricing"]["cta"], element_type="Outline Link Button", link_url="/pricing")
    add_meta_item(doc, "Legal Disclaimer", en_home["pricing"]["legal"], fr_home["pricing"]["legal"], element_type="Disclaimer Text (When pricingPublic=true)")

    # =========================================================================
    # SECTION 5: SECURITY SECTION
    # =========================================================================
    add_heading_1(doc, "6. Home Section 4: Security & Data Isolation (SecuritySection.jsx)")
    doc.add_paragraph("Presents the four core commitments on security, data governance, and isolation:")

    add_meta_item(doc, "Section Title (H2)", en_home["security"]["title"], fr_home["security"]["title"], element_type="Section Heading (H2)")
    
    sec_items = [
        ("Access Control & SSO", en_home["security"]["items"]["access"], fr_home["security"]["items"]["access"]),
        ("Encryption (TLS & At Rest)", en_home["security"]["items"]["encryption"], fr_home["security"]["items"]["encryption"]),
        ("Tenant Isolation & Backups", en_home["security"]["items"]["isolation"], fr_home["security"]["items"]["isolation"]),
        ("Audit Logging", en_home["security"]["items"]["audit"], fr_home["security"]["items"]["audit"]),
    ]
    for label, en_text, fr_text in sec_items:
        add_meta_item(doc, label, en_text, fr_text, element_type="Security Commitment Item")

    # =========================================================================
    # SECTION 6: WHY NELIAS SECTION
    # =========================================================================
    add_heading_1(doc, "7. Home Section 5: Why NELIAS (WhySection.jsx & home-content.js)")
    doc.add_paragraph("Displays the strategic value propositions distinguishing NELIAS in the African market:")

    add_meta_item(doc, "Section Title (H2)", en_home["why"]["title"], fr_home["why"]["title"], element_type="Section Heading (H2)")

    why_list = [
        ("Value Proposition 1", en_home["why"]["items"]["prices"]["title"], en_home["why"]["items"]["prices"]["text"], fr_home["why"]["items"]["prices"]["title"], fr_home["why"]["items"]["prices"]["text"], "Card (Shown when pricingPublic=true)"),
        ("Value Proposition 2", en_home["why"]["items"]["africa"]["title"], en_home["why"]["items"]["africa"]["text"], fr_home["why"]["items"]["africa"]["title"], fr_home["why"]["items"]["africa"]["text"], "Card"),
        ("Value Proposition 3", en_home["why"]["items"]["configured"]["title"], en_home["why"]["items"]["configured"]["text"], fr_home["why"]["items"]["configured"]["title"], fr_home["why"]["items"]["configured"]["text"], "Card"),
        ("Value Proposition 4", en_home["why"]["items"]["path"]["title"], en_home["why"]["items"]["path"]["text"], fr_home["why"]["items"]["path"]["title"], fr_home["why"]["items"]["path"]["text"], "Card"),
        ("Value Proposition 5", en_home["why"]["items"]["proximity"]["title"], en_home["why"]["items"]["proximity"]["text"], fr_home["why"]["items"]["proximity"]["title"], fr_home["why"]["items"]["proximity"]["text"], "Card"),
        ("Value Proposition 6 (Provisional)", en_home["why"]["items"]["payment"]["title"], en_home["why"]["items"]["payment"]["text"], fr_home["why"]["items"]["payment"]["title"], fr_home["why"]["items"]["payment"]["text"], "Card (Provisioned in catalog, hidden until gateway confirmation)"),
    ]

    for item_lbl, en_t, en_b, fr_t, fr_b, note in why_list:
        add_meta_item(
            doc,
            item_lbl,
            f"{en_t} - {en_b}",
            f"{fr_t} - {fr_b}",
            element_type=note
        )

    # =========================================================================
    # SECTION 7: ABOUT SECTION
    # =========================================================================
    add_heading_1(doc, "8. Home Section 6: About NELIAS (AboutSection.jsx)")
    doc.add_paragraph("The company narrative, publisher identity, philosophy, and three pillar statements:")

    add_heading_2(doc, "8.1 Narrative Story & Debass Technologies Identity")
    add_meta_item(doc, "Section Title (H2)", en_home["about"]["title"], fr_home["about"]["title"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Core Philosophy (p1)", en_home["about"]["p1"], fr_home["about"]["p1"], element_type="Lead Paragraph")
    add_meta_item(doc, "Transparency Principle (p2a)", en_home["about"]["p2a"], fr_home["about"]["p2a"], element_type="Story Column 1")
    add_meta_item(doc, "Public Price Policy (p2b)", en_home["about"]["p2b"], fr_home["about"]["p2b"], element_type="Story Column 1 (When pricingPublic=true)")
    add_meta_item(doc, "Publisher & Support (p3)", en_home["about"]["p3"], fr_home["about"]["p3"], element_type="Story Column 2 (Debass Technologies Identity)")

    add_heading_2(doc, "8.2 The 3 Platform Pillar Cards")
    for idx, (en_tag, fr_tag) in enumerate(zip(en_home["about"]["taglines"], fr_home["about"]["taglines"])):
        add_meta_item(doc, f"Pillar Card {idx+1}", en_tag, fr_tag, element_type="Brand Pillar Card")

    # =========================================================================
    # SECTION 8: FINAL CTA SECTION
    # =========================================================================
    add_heading_1(doc, "9. Home Section 7: Final Conversion (HomeFinalCta.jsx)")
    doc.add_paragraph("Closing high-contrast call-to-action band with advisor validation reassurance and dual buttons:")

    add_meta_item(doc, "Closing Headline (H2)", en_home["final"]["title"], fr_home["final"]["title"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Closing Reassurance Body", en_home["final"]["body"], fr_home["final"]["body"], element_type="Paragraph")
    add_meta_item(doc, "Primary Action Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button (Orange)", link_url="/demo")
    add_meta_item(doc, "Secondary Action Button", en_common["cta"]["signUp"], fr_common["cta"]["signUp"], element_type="On-Dark Button (White plate)", link_url="https://login.nelias.app/")

    # =========================================================================
    # SECTION 9: MOBILE DRAWER MENU
    # =========================================================================
    add_heading_1(doc, "10. Mobile Menu Drawer (MobileMenu.jsx)")
    doc.add_paragraph("Full-screen navigation drawer rendered on tablet and mobile viewports (< xl):")

    add_meta_item(doc, "Drawer Title / Label", en_common["header"]["menu"], fr_common["header"]["menu"], element_type="dialog[aria-label]")
    add_meta_item(doc, "Close Button Label", en_common["a11y"]["closeMenu"], fr_common["a11y"]["closeMenu"], element_type="button[aria-label]")
    add_meta_item(doc, "Mobile Nav Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Drawer Nav Link", link_url="/")
    add_meta_item(doc, "Mobile Nav Link 2", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Drawer Nav Link", link_url="/about")
    add_meta_item(doc, "Mobile Nav Link 3", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Drawer Nav Link", link_url="/industries")
    add_meta_item(doc, "Mobile Nav Link 4", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Drawer Nav Link", link_url="/features")
    add_meta_item(doc, "Mobile Nav Link 5", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Drawer Nav Link", link_url="/pricing")
    add_meta_item(doc, "Drawer Contact Link", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Drawer Nav Link", link_url="/contact")
    add_meta_item(doc, "Drawer Sign In Link", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="Drawer External Link", link_url="https://login.nelias.app")
    add_meta_item(doc, "Drawer Sticky CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Full-width Button", link_url="/demo")

    # =========================================================================
    # SECTION 10: STICKY MOBILE CTA BAR
    # =========================================================================
    add_heading_1(doc, "11. Sticky Mobile CTA Bar (StickyMobileCta.jsx)")
    doc.add_paragraph("Floating action bar displayed on viewports below 768px after scrolling 480px, automatically hidden when the footer is in view:")
    add_meta_item(doc, "Floating CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Fixed Bottom Button", link_url="/demo")

    # =========================================================================
    # SECTION 11: SITE FOOTER
    # =========================================================================
    add_heading_1(doc, "12. Site Footer (Footer.jsx)")
    doc.add_paragraph("Persistent dark footer rendered on the Home Page, containing brand identity, explore links, direct contact channels, legal links, and copyright:")

    add_heading_2(doc, "12.1 Brand & Tagline")
    add_meta_item(doc, "Brand Name", en_common["brand"]["name"], fr_common["brand"]["name"], element_type="Logo text")
    add_meta_item(doc, "Footer Brand Tagline", en_common["brand"]["footerTagline"], fr_common["brand"]["footerTagline"], element_type="Brand Mission Statement")

    add_heading_2(doc, "12.2 Explore Column Links")
    add_meta_item(doc, "Explore Column Heading", en_common["footer"]["exploreHeading"], fr_common["footer"]["exploreHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Explore Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Footer Link", link_url="/")
    add_meta_item(doc, "Explore Link 2", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Footer Link", link_url="/industries")
    add_meta_item(doc, "Explore Link 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Footer Link", link_url="/features")
    add_meta_item(doc, "Explore Link 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Footer Link", link_url="/pricing")
    add_meta_item(doc, "Explore Link 5", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Footer Link", link_url="/contact")

    add_heading_2(doc, "12.3 Contact Column Details")
    add_meta_item(doc, "Contact Column Heading", en_common["footer"]["contactHeading"], fr_common["footer"]["contactHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Email Channel", "contact@nelias.app", element_type="Contact Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Phone Channel", "+225 05 64 05 90 60", element_type="Contact Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "WhatsApp Channel", "WhatsApp: +225 07 00 40 92 41", element_type="External Link", link_url="https://wa.me/2250700409241")
    add_meta_item(doc, "Physical Address", "Abidjan, Côte d'Ivoire", element_type="Location Item")

    add_heading_2(doc, "12.4 Legal Hairline & Copyright")
    add_meta_item(doc, "Copyright Notice", en_common["brand"]["copyright"], fr_common["brand"]["copyright"], element_type="Copyright String")
    add_meta_item(doc, "Legal Link 1", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="Legal Link", link_url="/privacy")
    add_meta_item(doc, "Legal Link 2", en_common["nav"]["terms"], fr_common["nav"]["terms"], element_type="Legal Link", link_url="/terms")
    add_meta_item(doc, "Legal Link 3", en_common["nav"]["faq"], fr_common["nav"]["faq"], element_type="Legal Link", link_url="/faq")
    add_meta_item(doc, "Legal Link 4", en_common["nav"]["dpa"], fr_common["nav"]["dpa"], element_type="Legal Link", link_url="/dpa")
    add_meta_item(doc, "Legal Link 5", en_common["nav"]["sla"], fr_common["nav"]["sla"], element_type="Legal Link", link_url="/sla")

    # Ensure output directory exists
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "home_page_Content.docx")
    
    doc.save(out_file)
    print(f"Document successfully created and saved at: {out_file}")

if __name__ == "__main__":
    main()
