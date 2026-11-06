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
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary Accent / Demo CTA
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
            
    en_contact = load_json("src/i18n/locales/en/contact.json")
    fr_contact = load_json("src/i18n/locales/fr/contact.json")
    en_common = load_json("src/i18n/locales/en/common.json")
    fr_common = load_json("src/i18n/locales/fr/common.json")
    en_seo = load_json("src/i18n/locales/en/seo.json")
    fr_seo = load_json("src/i18n/locales/fr/seo.json")
    en_industries = load_json("src/i18n/locales/en/industries.json")
    fr_industries = load_json("src/i18n/locales/fr/industries.json")
    en_features = load_json("src/i18n/locales/en/features.json")
    fr_features = load_json("src/i18n/locales/fr/features.json")

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
    r_title = p_title.add_run("NELIAS Marketing Portal - Request Demo Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Components, Form Controls, Locales & Layouts)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    # Overview Metadata Box
    add_callout(
        doc,
        "Document Purpose: Exhaustive reference of all existing content for the NELIAS Request Demo Page, rendered in original visual order. Preserves exact wording, spelling, punctuation, capitalization, symbols, field limits, dropdown options, and validation messages directly from source code.\n"
        "• Target URL: https://nelias.app/demo (Route: /demo)\n"
        "• Source Files: src/pages/DemoPage.jsx, src/sections/contact/ContactLayout.jsx, src/sections/contact/LeadForm.jsx, src/sections/contact/DemoExpectations.jsx, src/sections/contact/NeedsFieldset.jsx, src/components/patterns/PageHeader.jsx, src/i18n/locales/*/contact.json, src/i18n/locales/*/common.json, src/config/site.js, src/lib/validators.js\n"
        "• Primary Language: English (EN) | Complete Bilingual Translations: French (FR)\n"
        "• Publisher & Platform: NELIAS Business Management Platform (Debass Technologies, Abidjan, Côte d'Ivoire)\n"
        "• Page Type & Architecture: Comprehensive Qualification & Lead Capture Form with interactive live walkthrough expectations sidebar.",
        label="DOCUMENT OVERVIEW & AUDIT METADATA:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 1: PAGE-LEVEL METADATA & SEO
    # =========================================================================
    add_heading_1(doc, "1. Page-Level Metadata & SEO")
    p_seo_intro = doc.add_paragraph("Extracted from src/pages/DemoPage.jsx, src/components/common/Seo.jsx, and src/i18n/locales/*/contact.json:")
    p_seo_intro.paragraph_format.space_after = Pt(4)

    add_meta_item(doc, "SEO Page Title", en_contact["seo"]["demoTitle"], fr_contact["seo"]["demoTitle"], element_type="<title> tag")
    add_meta_item(doc, "Meta Description", en_contact["seo"]["description"], fr_contact["seo"]["description"], element_type="meta[name='description']")
    add_meta_item(doc, "Canonical URL", "https://nelias.app/demo", element_type="link[rel='canonical']")
    add_meta_item(doc, "OpenGraph Title", en_contact["seo"]["demoTitle"], fr_contact["seo"]["demoTitle"], element_type="meta[property='og:title']")
    add_meta_item(doc, "OpenGraph Description", en_contact["seo"]["description"], fr_contact["seo"]["description"], element_type="meta[property='og:description']")
    add_meta_item(doc, "OpenGraph Type", "website", element_type="meta[property='og:type']")
    add_meta_item(doc, "OpenGraph Site Name", "NELIAS", element_type="meta[property='og:site_name']")
    add_meta_item(doc, "OpenGraph Locale", "en_US | [FR]: fr_FR", element_type="meta[property='og:locale']")
    add_meta_item(doc, "Twitter Card Type", "summary", element_type="meta[name='twitter:card']")

    # =========================================================================
    # SECTION 2: GLOBAL HEADER & NAVIGATION
    # =========================================================================
    add_heading_1(doc, "2. Global Header, Utility Bar & Navigation")
    doc.add_paragraph("Persistent top navigation rendered on the Demo Page via RootLayout.jsx, UtilityBar.jsx, and Header.jsx:")

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
    add_meta_item(doc, "Header Primary CTA (Current Page Action)", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button (Orange)", link_url="/demo")
    add_meta_item(doc, "Mobile Menu Trigger", en_common["a11y"]["openMenu"], fr_common["a11y"]["openMenu"], element_type="Hamburger Button")

    # =========================================================================
    # SECTION 3: REQUEST DEMO HERO HEADER
    # =========================================================================
    add_heading_1(doc, "3. Request Demo Hero Header (PageHeader.jsx)")
    doc.add_paragraph("The hero header presents the demo request purpose and invites organizations to explore customized management configurations:")

    add_meta_item(doc, "Hero Headline (H1)", en_contact["demo"]["title"], fr_contact["demo"]["title"], element_type="Main Headline (H1)")
    add_meta_item(doc, "Hero Subtitle / Lead", en_contact["hero"]["lead"], fr_contact["hero"]["lead"], element_type="Lead Paragraph")
    add_meta_item(doc, "Visual Background Tone", "tint", element_type="Section Tone")
    add_meta_item(doc, "Accent Decoration", "Brand ribbon accent (h-1 w-12 rounded-full)", element_type="Visual Decorator")

    add_callout(
        doc,
        f"[EN]: \"{en_contact['hero']['lead']}\"\n\n"
        f"[FR]: \"{fr_contact['hero']['lead']}\"",
        label="DEMO SCOPING & OPERATIONAL DISCOVERY STATEMENT:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 4: 2-COLUMN DEMO SECTION ARCHITECTURE
    # =========================================================================
    add_heading_1(doc, "4. 2-Column Demo Layout Architecture (ContactLayout.jsx)")
    doc.add_paragraph("Structured responsive 12-column grid (`lg:grid-cols-12`): the Left Column (7 cols) hosts the Comprehensive Qualification Lead Form in a raised card, and the Right Column (5 cols, sticky on desktop `lg:sticky lg:top-28`) presents the Demo Expectations Walkthrough Panel:")

    # =========================================================================
    # SECTION 5: COMPREHENSIVE QUALIFICATION LEAD FORM (LEFT COLUMN)
    # =========================================================================
    add_heading_1(doc, "5. Left Column: Comprehensive Demo Qualification Form (LeadForm.jsx, short=false)")
    doc.add_paragraph("The full qualification lead form captures corporate identification, operating jurisdiction, industry vertical, organization headcount, functional needs checklist, and scoping notes:")

    add_heading_2(doc, "5.1 Form Identity & Requirements Indicator")
    add_meta_item(doc, "Accessible Section Heading", en_contact["form"]["srTitle"]["demo"], fr_contact["form"]["srTitle"]["demo"], element_type="h2.sr-only")
    add_meta_item(doc, "Required Fields Indicator Note", en_contact["form"]["requiredNote"], fr_contact["form"]["requiredNote"], element_type="Form Explanatory Text")

    add_heading_2(doc, "5.2 Primary & Qualification Fields Specification")

    tbl_fields = doc.add_table(rows=1, cols=5)
    tbl_fields.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_fields)
    hdr_fields = tbl_fields.rows[0]
    hdr_fields.cells[0].paragraphs[0].add_run("Field ID")
    hdr_fields.cells[1].paragraphs[0].add_run("Field Label (English)")
    hdr_fields.cells[2].paragraphs[0].add_run("Field Label (French)")
    hdr_fields.cells[3].paragraphs[0].add_run("Control Type / Rules")
    hdr_fields.cells[4].paragraphs[0].add_run("Validation / Error Copy")
    format_row(hdr_fields, is_header=True, bg_color=HEX_NAVY)

    fields_data = [
        ("lead-full-name", en_contact["form"]["fullName"], fr_contact["form"]["fullName"], "Text Input\nRequired (*)\nMax 100 chars\nautoComplete='name'", f"[EN]: {en_contact['errors']['fullName']}\n[FR]: {fr_contact['errors']['fullName']}"),
        ("lead-work-email", en_contact["form"]["workEmail"], fr_contact["form"]["workEmail"], "Email Input\nRequired (*)\nMax 254 chars\nautoComplete='email'\nFormat: name@domain.tld", f"[EN]: {en_contact['errors']['emailRequired']}\n{en_contact['errors']['emailInvalid']}\n[FR]: {fr_contact['errors']['emailRequired']}\n{fr_contact['errors']['emailInvalid']}"),
        ("lead-company", en_contact["form"]["company"], fr_contact["form"]["company"], "Text Input\nRequired (*)\nMax 120 chars\nautoComplete='organization'", f"[EN]: {en_contact['errors']['company']}\n[FR]: {fr_contact['errors']['company']}"),
        ("lead-country", en_contact["form"]["country"], fr_contact["form"]["country"], "Select Dropdown\nOptional\n249 ISO countries\nautoComplete='country'", "Placeholder: \"Select an option\" / \"Sélectionner une option\""),
        ("lead-industry", en_contact["form"]["industry"], fr_contact["form"]["industry"], "Select Dropdown\nOptional\n12 business sectors + Other", "Placeholder: \"Select an option\" / \"Sélectionner une option\""),
        ("lead-company-size", f"{en_contact['form']['companySize']}\n(Hint: {en_contact['form']['companySizeHint']})", f"{fr_contact['form']['companySize']}\n(Hint: {fr_contact['form']['companySizeHint']})", "Select Dropdown\nOptional\n5 headcount brackets", "Placeholder: \"Select an option\" / \"Sélectionner une option\""),
        ("lead-message", en_contact["form"]["message"], fr_contact["form"]["message"], "Textarea (5 rows)\nOptional\nMax 1000 characters", f"Live Counter: \"{en_contact['form']['counter']}\" (active when > 800 chars)"),
        ("lead-consent", en_contact["form"]["consent"], fr_contact["form"]["consent"], "Checkbox Input\nRequired (*)\nLegal compliance consent", f"[EN]: {en_contact['errors']['consent']}\n[FR]: {fr_contact['errors']['consent']}"),
    ]
    for idx, (f_id, f_lbl_en, f_lbl_fr, f_ctrl, f_err) in enumerate(fields_data):
        row = tbl_fields.add_row()
        row.cells[0].paragraphs[0].add_run(f_id)
        row.cells[1].paragraphs[0].add_run(f_lbl_en)
        row.cells[2].paragraphs[0].add_run(f_lbl_fr)
        row.cells[3].paragraphs[0].add_run(f_ctrl)
        row.cells[4].paragraphs[0].add_run(f_err)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.3 Company Size Brackets (Dropdown Options)")
    add_meta_item(doc, "Helper / Hint Text", en_contact["form"]["companySizeHint"], fr_contact["form"]["companySizeHint"], element_type="Field Hint")

    tbl_sizes = doc.add_table(rows=1, cols=3)
    tbl_sizes.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sizes)
    hdr_sizes = tbl_sizes.rows[0]
    hdr_sizes.cells[0].paragraphs[0].add_run("Size Bracket ID")
    hdr_sizes.cells[1].paragraphs[0].add_run("Option Label (English)")
    hdr_sizes.cells[2].paragraphs[0].add_run("Option Label (French)")
    format_row(hdr_sizes, is_header=True, bg_color=HEX_NAVY)

    sizes_data = [
        ("s1", en_contact["sizes"]["s1"], fr_contact["sizes"]["s1"]),
        ("s2", en_contact["sizes"]["s2"], fr_contact["sizes"]["s2"]),
        ("s3", en_contact["sizes"]["s3"], fr_contact["sizes"]["s3"]),
        ("s4", en_contact["sizes"]["s4"], fr_contact["sizes"]["s4"]),
        ("s5", en_contact["sizes"]["s5"], fr_contact["sizes"]["s5"]),
    ]
    for idx, (s_id, s_lbl_en, s_lbl_fr) in enumerate(sizes_data):
        row = tbl_sizes.add_row()
        row.cells[0].paragraphs[0].add_run(s_id)
        row.cells[1].paragraphs[0].add_run(s_lbl_en)
        row.cells[2].paragraphs[0].add_run(s_lbl_fr)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.4 Industry Sectors (Dropdown Options: 12 Sectors + Other)")
    add_meta_item(doc, "Industry Field Label", en_contact["form"]["industry"], fr_contact["form"]["industry"], element_type="Select Label")

    tbl_ind = doc.add_table(rows=1, cols=3)
    tbl_ind.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_ind)
    hdr_ind = tbl_ind.rows[0]
    hdr_ind.cells[0].paragraphs[0].add_run("Sector Slug")
    hdr_ind.cells[1].paragraphs[0].add_run("Sector Name (English)")
    hdr_ind.cells[2].paragraphs[0].add_run("Sector Name (French)")
    format_row(hdr_ind, is_header=True, bg_color=HEX_NAVY)

    ind_slugs = [
        "retail-distribution", "professional-services", "manufacturing", "healthcare",
        "hospitality", "education-training", "insurance-financial-services",
        "energy-field-services", "real-estate", "pharmacies", "construction-btp",
        "it-technology-services"
    ]
    for idx, slug in enumerate(ind_slugs):
        row = tbl_ind.add_row()
        row.cells[0].paragraphs[0].add_run(slug)
        row.cells[1].paragraphs[0].add_run(en_industries["items"][slug]["name"])
        row.cells[2].paragraphs[0].add_run(fr_industries["items"][slug]["name"])
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    # Other option
    row_oth = tbl_ind.add_row()
    row_oth.cells[0].paragraphs[0].add_run("other")
    row_oth.cells[1].paragraphs[0].add_run(en_contact["form"]["other"])
    row_oth.cells[2].paragraphs[0].add_run(fr_contact["form"]["other"])
    format_row(row_oth, bg_color=HEX_LIGHT_BG if len(ind_slugs) % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.5 Business Needs Capability Checklist (NeedsFieldset.jsx)")
    add_meta_item(doc, "Fieldset Legend", en_contact["form"]["businessNeeds"], fr_contact["form"]["businessNeeds"], element_type="Fieldset Legend")
    add_meta_item(doc, "Fieldset Hint", en_contact["form"]["businessNeedsHint"], fr_contact["form"]["businessNeedsHint"], element_type="Fieldset Helper Text")

    tbl_needs = doc.add_table(rows=1, cols=3)
    tbl_needs.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_needs)
    hdr_needs = tbl_needs.rows[0]
    hdr_needs.cells[0].paragraphs[0].add_run("Area Key")
    hdr_needs.cells[1].paragraphs[0].add_run("Capability Area (English)")
    hdr_needs.cells[2].paragraphs[0].add_run("Capability Area (French)")
    format_row(hdr_needs, is_header=True, bg_color=HEX_NAVY)

    needs_keys = [
        "finance-accounting", "crm-sales", "purchasing-inventory", "point-of-sale",
        "projects-timesheets", "human-resources", "manufacturing-quality", "assets-maintenance",
        "customer-support-portal", "reporting-analytics", "workflows-automation"
    ]
    for idx, key in enumerate(needs_keys):
        row = tbl_needs.add_row()
        row.cells[0].paragraphs[0].add_run(key)
        row.cells[1].paragraphs[0].add_run(en_features["areas"][key]["name"])
        row.cells[2].paragraphs[0].add_run(fr_features["areas"][key]["name"])
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.6 Legal Consent, Privacy & Spam Protection")
    add_meta_item(doc, "Consent Checkbox Label", en_contact["form"]["consent"], fr_contact["form"]["consent"], element_type="Checkbox Label")
    add_meta_item(doc, "Privacy Policy Link", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="TextLink", link_url="/privacy")
    add_meta_item(doc, "Bot Protection Honeypot", "company_website", element_type="Hidden input (tabIndex=-1)")

    add_heading_2(doc, "5.7 Primary Demo Submission CTA Button")
    add_meta_item(doc, "Primary Action Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Primary Button (Orange)", link_url="Form Submission Event")

    add_callout(
        doc,
        f"[EN]: Button Label: \"{en_common['cta']['bookDemo']}\"\n"
        f"[FR]: Button Label: \"{fr_common['cta']['bookDemo']}\"\n\n"
        "Behavior: Validates all required fields, emits telemetry, and submits lead payload. In offline or serverless fallback mode, opens the client's mail application with pre-filled scoping details.",
        label="PRIMARY DEMO SUBMISSION CALL-TO-ACTION:",
        border_color=HEX_ORANGE
    )

    add_heading_2(doc, "5.8 Validation Rules, Alerts & Feedback States")
    add_meta_item(doc, "Error Summary Alert Title", en_contact["errors"]["summaryTitle"], fr_contact["errors"]["summaryTitle"], element_type="Alert (tone='danger', role='alert')")
    add_meta_item(doc, "Submission Failure Message", en_contact["errors"]["submitFailed"], fr_contact["errors"]["submitFailed"], element_type="Alert Body")
    add_meta_item(doc, "Message Too Long For Mailto", en_contact["errors"]["mailtoTooLong"], fr_contact["errors"]["mailtoTooLong"], element_type="Alert Body")

    # Success feedback callout
    add_callout(
        doc,
        f"Success Title: \"{en_contact['feedback']['successTitle']}\" | [FR]: \"{fr_contact['feedback']['successTitle']}\"\n\n"
        f"Confirmation Message: \"{en_contact['feedback']['success']['demo']}\"\n"
        f"[FR]: \"{fr_contact['feedback']['success']['demo']}\"",
        label="DEMO REQUEST SUCCESS FEEDBACK (Alert tone='success'):",
        border_color=HEX_AZURE
    )

    # Mailto fallback callout
    en_mailto_body = en_contact["feedback"]["mailtoBody"].replace("{{email}}", "contact@nelias.app")
    fr_mailto_body = fr_contact["feedback"]["mailtoBody"].replace("{{email}}", "contact@nelias.app")
    en_mailto_write = en_contact["feedback"]["writeTo"].replace("{{email}}", "contact@nelias.app")
    fr_mailto_write = fr_contact["feedback"]["writeTo"].replace("{{email}}", "contact@nelias.app")
    add_callout(
        doc,
        f"Title: \"{en_contact['feedback']['mailtoTitle']}\" | [FR]: \"{fr_contact['feedback']['mailtoTitle']}\"\n\n"
        f"Body: \"{en_mailto_body}\"\n[FR]: \"{fr_mailto_body}\"\n\n"
        f"Action Link: \"{en_mailto_write}\" | [FR]: \"{fr_mailto_write}\" [Target: mailto:contact@nelias.app]\n"
        f"Email Subject Line: \"{en_contact['mail']['subject']['demo']}\" | [FR]: \"{fr_contact['mail']['subject']['demo']}\"",
        label="MAILTO FALLBACK CLIENT HANDOFF (Alert tone='info'):",
        border_color=HEX_ORANGE
    )

    # =========================================================================
    # SECTION 6: WHAT TO EXPECT FROM YOUR DEMO (RIGHT COLUMN)
    # =========================================================================
    add_heading_1(doc, "6. Right Column: What to Expect from Your Demo (DemoExpectations.jsx)")
    doc.add_paragraph("Sticky panel on desktop (`lg:col-span-5 lg:sticky lg:top-28`) providing structured expectations for the live walkthrough session and direct alternative inquiry routes:")

    add_heading_2(doc, "6.1 Panel Header & Walkthrough Introduction")
    add_meta_item(doc, "Panel Heading (H2)", en_contact["demoSidebar"]["title"], fr_contact["demoSidebar"]["title"], element_type="Panel Heading (H2)")
    add_meta_item(doc, "Panel Subtitle / Lead", en_contact["demoSidebar"]["lead"], fr_contact["demoSidebar"]["lead"], element_type="Lead Paragraph")

    add_heading_2(doc, "6.2 The 4 Live Walkthrough Pillars")

    tbl_demo = doc.add_table(rows=1, cols=4)
    tbl_demo.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_demo)
    hdr_demo = tbl_demo.rows[0]
    hdr_demo.cells[0].paragraphs[0].add_run("Pillar #")
    hdr_demo.cells[1].paragraphs[0].add_run("Pillar Title")
    hdr_demo.cells[2].paragraphs[0].add_run("Walkthrough Description (English)")
    hdr_demo.cells[3].paragraphs[0].add_run("Walkthrough Description (French)")
    format_row(hdr_demo, is_header=True, bg_color=HEX_NAVY)

    for idx, (item_e, item_f) in enumerate(zip(en_contact["demoSidebar"]["items"], fr_contact["demoSidebar"]["items"])):
        row = tbl_demo.add_row()
        row.cells[0].paragraphs[0].add_run(f"Pillar {idx + 1}")
        row.cells[1].paragraphs[0].add_run(f"{item_e['title']}\n[FR]: {item_f['title']}")
        row.cells[2].paragraphs[0].add_run(item_e["desc"])
        row.cells[3].paragraphs[0].add_run(item_f["desc"])
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "6.3 General Assistance & Alternative Contact Card")
    add_meta_item(doc, "Assistance Card Heading (H3)", en_contact["demoSidebar"]["altContactTitle"], fr_contact["demoSidebar"]["altContactTitle"], element_type="Card Heading (H3)")
    add_meta_item(doc, "Assistance Description", en_contact["demoSidebar"]["altContactDesc"], fr_contact["demoSidebar"]["altContactDesc"], element_type="Paragraph")
    add_meta_item(doc, "Direct Contact Link", en_contact["demoSidebar"]["altContactLink"], fr_contact["demoSidebar"]["altContactLink"], element_type="TextLink", link_url="/contact")

    add_callout(
        doc,
        f"[EN]: \"{en_contact['demoSidebar']['altContactDesc']}\"\n"
        f"[FR]: \"{fr_contact['demoSidebar']['altContactDesc']}\"\n\n"
        f"Action Link: \"{en_contact['demoSidebar']['altContactLink']}\" | [FR]: \"{fr_contact['demoSidebar']['altContactLink']}\" [Target: /contact]",
        label="ALTERNATIVE ASSISTANCE & SUPPORT ROUTING:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 7: MOBILE DRAWER & STICKY CTA
    # =========================================================================
    add_heading_1(doc, "7. Mobile Drawer & Floating CTA (MobileNavDrawer.jsx & StickyMobileCta.jsx)")
    doc.add_paragraph("Responsive navigation and conversion elements rendered on mobile viewports on the Demo Page:")

    add_heading_2(doc, "7.1 Mobile Navigation Drawer (MobileNavDrawer.jsx)")
    add_meta_item(doc, "Drawer Accessible Label", en_common["header"]["menu"], fr_common["header"]["menu"], element_type="dialog[aria-label]")
    add_meta_item(doc, "Close Button Accessible Label", en_common["a11y"]["closeMenu"], fr_common["a11y"]["closeMenu"], element_type="button[aria-label]")
    add_meta_item(doc, "Drawer Nav Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Nav Link", link_url="/")
    add_meta_item(doc, "Drawer Nav Link 2", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Nav Link", link_url="/about")
    add_meta_item(doc, "Drawer Nav Link 3", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Nav Link", link_url="/industries")
    add_meta_item(doc, "Drawer Nav Link 4", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Nav Link", link_url="/features")
    add_meta_item(doc, "Drawer Nav Link 5", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Nav Link", link_url="/pricing")
    add_meta_item(doc, "Drawer Nav Link 6", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Nav Link", link_url="/contact")
    add_meta_item(doc, "Drawer External Sign In", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="External Link", link_url="https://login.nelias.app")
    add_meta_item(doc, "Drawer Full-width CTA (Active Action)", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Full-width Button (Active Page)", link_url="/demo")

    add_heading_2(doc, "7.2 Sticky Mobile Floating CTA Bar (StickyMobileCta.jsx)")
    doc.add_paragraph("Floating bar appearing on viewports < 768px after scrolling 480px, auto-hidden when the footer is reached:")
    add_meta_item(doc, "Floating CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Sticky Fixed Button", link_url="/demo")

    # =========================================================================
    # SECTION 8: SITE FOOTER
    # =========================================================================
    add_heading_1(doc, "8. Site Footer (Footer.jsx)")
    doc.add_paragraph("Persistent dark footer rendered on the Demo Page, containing corporate attribution, navigation links, direct contact channels, and legal agreements:")

    add_heading_2(doc, "8.1 Brand & Corporate Attribution")
    add_meta_item(doc, "Brand Name", en_common["brand"]["name"], fr_common["brand"]["name"], element_type="Logo text")
    add_meta_item(doc, "Footer Brand Tagline", en_common["brand"]["footerTagline"], fr_common["brand"]["footerTagline"], element_type="Brand Mission Statement")

    add_heading_2(doc, "8.2 Explore Column Links")
    add_meta_item(doc, "Explore Column Heading", en_common["footer"]["exploreHeading"], fr_common["footer"]["exploreHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Explore Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Footer Link", link_url="/")
    add_meta_item(doc, "Explore Link 2", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Footer Link", link_url="/industries")
    add_meta_item(doc, "Explore Link 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Footer Link", link_url="/features")
    add_meta_item(doc, "Explore Link 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Footer Link", link_url="/pricing")
    add_meta_item(doc, "Explore Link 5", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Footer Link", link_url="/contact")

    add_heading_2(doc, "8.3 Contact Column Details")
    add_meta_item(doc, "Contact Column Heading", en_common["footer"]["contactHeading"], fr_common["footer"]["contactHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Email Channel", "contact@nelias.app", element_type="Contact Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Phone Channel", "+225 05 64 05 90 60", element_type="Contact Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "WhatsApp Channel", "WhatsApp: +225 07 00 40 92 41", element_type="External Link", link_url="https://wa.me/2250700409241")
    add_meta_item(doc, "Physical Address", "Abidjan, Côte d'Ivoire", element_type="Location Item")

    add_heading_2(doc, "8.4 Legal Hairline & Copyright")
    add_meta_item(doc, "Copyright Notice", en_common["brand"]["copyright"], fr_common["brand"]["copyright"], element_type="Copyright String")
    add_meta_item(doc, "Legal Link 1", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="Legal Link", link_url="/privacy")
    add_meta_item(doc, "Legal Link 2", en_common["nav"]["terms"], fr_common["nav"]["terms"], element_type="Legal Link", link_url="/terms")
    add_meta_item(doc, "Legal Link 3", en_common["nav"]["faq"], fr_common["nav"]["faq"], element_type="Legal Link", link_url="/faq")
    add_meta_item(doc, "Legal Link 4", en_common["nav"]["dpa"], fr_common["nav"]["dpa"], element_type="Legal Link", link_url="/dpa")
    add_meta_item(doc, "Legal Link 5", en_common["nav"]["sla"], fr_common["nav"]["sla"], element_type="Legal Link", link_url="/sla")

    # Output directory and save
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "request_demo_page_Content.docx")
    
    doc.save(out_file)
    print(f"Document successfully created and saved at: {out_file}")

if __name__ == "__main__":
    main()
