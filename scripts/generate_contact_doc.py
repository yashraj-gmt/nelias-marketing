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
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary Accent / CTA
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
    r_title = p_title.add_run("NELIAS Marketing Portal - Contact Page Content Specification")
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
        "Document Purpose: Exhaustive reference of all existing content for the NELIAS Contact Page, rendered in original visual order. Preserves exact wording, spelling, punctuation, capitalization, symbols, field limits, validation messages, and formatting directly from source code.\n"
        "• Target URL: https://nelias.app/contact (Route: /contact)\n"
        "• Source Files: src/pages/ContactPage.jsx, src/sections/contact/*, src/components/patterns/PageHeader.jsx, src/i18n/locales/*/contact.json, src/i18n/locales/*/common.json, src/config/site.js, src/lib/validators.js\n"
        "• Primary Language: English (EN) | Complete Bilingual Translations: French (FR)\n"
        "• Publisher & Platform: NELIAS Business Management Platform (Debass Technologies, Abidjan, Côte d'Ivoire)\n"
        "• Core Channels: Direct Email (contact@nelias.app), Telephone (+225 05 64 05 90 60), WhatsApp (+225 07 00 40 92 41), Physical HQ (Abidjan, Côte d'Ivoire).",
        label="DOCUMENT OVERVIEW & AUDIT METADATA:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 1: PAGE-LEVEL METADATA & SEO
    # =========================================================================
    add_heading_1(doc, "1. Page-Level Metadata & SEO")
    p_seo_intro = doc.add_paragraph("Extracted from src/pages/ContactPage.jsx, src/components/common/Seo.jsx, and src/i18n/locales/*/contact.json:")
    p_seo_intro.paragraph_format.space_after = Pt(4)

    add_meta_item(doc, "SEO Page Title", en_contact["seo"]["contactTitle"], fr_contact["seo"]["contactTitle"], element_type="<title> tag")
    add_meta_item(doc, "Meta Description", en_contact["seo"]["description"], fr_contact["seo"]["description"], element_type="meta[name='description']")
    add_meta_item(doc, "Canonical URL", "https://nelias.app/contact", element_type="link[rel='canonical']")
    add_meta_item(doc, "OpenGraph Title", en_contact["seo"]["contactTitle"], fr_contact["seo"]["contactTitle"], element_type="meta[property='og:title']")
    add_meta_item(doc, "OpenGraph Description", en_contact["seo"]["description"], fr_contact["seo"]["description"], element_type="meta[property='og:description']")
    add_meta_item(doc, "OpenGraph Type", "website", element_type="meta[property='og:type']")
    add_meta_item(doc, "OpenGraph Site Name", "NELIAS", element_type="meta[property='og:site_name']")
    add_meta_item(doc, "OpenGraph Locale", "en_US | [FR]: fr_FR", element_type="meta[property='og:locale']")
    add_meta_item(doc, "Twitter Card Type", "summary", element_type="meta[name='twitter:card']")

    # =========================================================================
    # SECTION 2: GLOBAL HEADER & NAVIGATION
    # =========================================================================
    add_heading_1(doc, "2. Global Header, Utility Bar & Navigation")
    doc.add_paragraph("Persistent top navigation rendered on the Contact Page via RootLayout.jsx, UtilityBar.jsx, and Header.jsx:")

    add_heading_2(doc, "2.1 Top Utility Bar (Desktop xl+)")
    add_meta_item(doc, "Contact Email Channel", "contact@nelias.app", element_type="Text Link", link_url="mailto:contact@nelias.app")
    add_meta_item(doc, "Contact Phone Channel", "+225 05 64 05 90 60", element_type="Text Link", link_url="tel:+2250564059060")
    add_meta_item(doc, "Theme Toggle Label", en_common["theme"]["darkMode"], fr_common["theme"]["darkMode"], element_type="Toggle Control")
    add_meta_item(doc, "Language Switcher Options", "English / Français (EN / FR)", element_type="Language Toggle")
    add_meta_item(doc, "Utility Contact Link (Active)", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Navigation Link", link_url="/contact")
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
    # SECTION 3: CONTACT HERO & INTRO HEADER
    # =========================================================================
    add_heading_1(doc, "3. Contact Hero Header (PageHeader.jsx)")
    doc.add_paragraph("The hero header introduces the dialogue with the business and emphasizes collaborative discovery:")

    add_meta_item(doc, "Hero Headline (H1)", en_contact["hero"]["title"], fr_contact["hero"]["title"], element_type="Main Headline (H1)")
    add_meta_item(doc, "Hero Subtitle / Lead", en_contact["hero"]["lead"], fr_contact["hero"]["lead"], element_type="Lead Paragraph")
    add_meta_item(doc, "Visual Background Tone", "tint", element_type="Section Tone")
    add_meta_item(doc, "Accent Decoration", "Brand ribbon accent (h-1 w-12 rounded-full)", element_type="Visual Decorator")

    add_callout(
        doc,
        f"[EN]: \"{en_contact['hero']['lead']}\"\n\n"
        f"[FR]: \"{fr_contact['hero']['lead']}\"",
        label="CORE VALUE & DISCOVERY PROMISE:",
        border_color=HEX_AZURE
    )

    # =========================================================================
    # SECTION 4: CONTACT LAYOUT & 2-COLUMN STRUCTURE
    # =========================================================================
    add_heading_1(doc, "4. Contact Section Layout (ContactLayout.jsx)")
    doc.add_paragraph("Rendered via a responsive 12-column grid (`lg:grid-cols-12`) featuring the Lead Capture Form in the primary column (7 cols) and the Direct Contact Details Sidebar in the secondary column (5 cols, sticky on desktop):")

    add_heading_2(doc, "4.1 Left Column: Concise Lead Capture Form (LeadForm.jsx, short=true)")
    add_meta_item(doc, "Accessible Section Heading", en_contact["form"]["srTitle"]["contact"], fr_contact["form"]["srTitle"]["contact"], element_type="h2.sr-only")
    add_meta_item(doc, "Required Fields Indicator Note", en_contact["form"]["requiredNote"], fr_contact["form"]["requiredNote"], element_type="Form Explanatory Text")

    # Form fields table
    tbl_fields = doc.add_table(rows=1, cols=5)
    tbl_fields.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_fields)
    hdr_fields = tbl_fields.rows[0]
    hdr_fields.cells[0].paragraphs[0].add_run("Field ID")
    hdr_fields.cells[1].paragraphs[0].add_run("Label (English)")
    hdr_fields.cells[2].paragraphs[0].add_run("Label (French)")
    hdr_fields.cells[3].paragraphs[0].add_run("Requirement / Limits")
    hdr_fields.cells[4].paragraphs[0].add_run("Validation Error Message")
    format_row(hdr_fields, is_header=True, bg_color=HEX_NAVY)

    fields_data = [
        ("lead-full-name", en_contact["form"]["fullName"], fr_contact["form"]["fullName"], "Required (*)\nMax 100 characters\nautoComplete='name'", f"[EN]: {en_contact['errors']['fullName']}\n[FR]: {fr_contact['errors']['fullName']}"),
        ("lead-work-email", en_contact["form"]["workEmail"], fr_contact["form"]["workEmail"], "Required (*)\nMax 254 characters\nautoComplete='email'\nFormat: user@domain.tld", f"[EN]: {en_contact['errors']['emailRequired']}\n{en_contact['errors']['emailInvalid']}\n[FR]: {fr_contact['errors']['emailRequired']}\n{fr_contact['errors']['emailInvalid']}"),
        ("lead-company", en_contact["form"]["company"], fr_contact["form"]["company"], "Required (*)\nMax 120 characters\nautoComplete='organization'", f"[EN]: {en_contact['errors']['company']}\n[FR]: {fr_contact['errors']['company']}"),
        ("lead-message", en_contact["form"]["message"], fr_contact["form"]["message"], "Optional\nMax 1000 characters\n5 rows textarea", f"Live Counter: \"{en_contact['form']['counter']}\" (displayed when > 800 chars)"),
        ("lead-consent", en_contact["form"]["consent"], fr_contact["form"]["consent"], "Required (*)\nCheckbox control", f"[EN]: {en_contact['errors']['consent']}\n[FR]: {fr_contact['errors']['consent']}"),
    ]
    for idx, (f_id, f_lbl_en, f_lbl_fr, f_req, f_err) in enumerate(fields_data):
        row = tbl_fields.add_row()
        row.cells[0].paragraphs[0].add_run(f_id)
        row.cells[1].paragraphs[0].add_run(f_lbl_en)
        row.cells[2].paragraphs[0].add_run(f_lbl_fr)
        row.cells[3].paragraphs[0].add_run(f_req)
        row.cells[4].paragraphs[0].add_run(f_err)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_3(doc, "Consent Privacy Link & Security Honeypot")
    add_meta_item(doc, "Privacy Policy Link", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], element_type="TextLink", link_url="/privacy")
    add_meta_item(doc, "Spam Honeypot Field", "company_website", element_type="Hidden input for automated bot protection (tabIndex=-1)")

    add_heading_3(doc, "Form Action Buttons")
    add_meta_item(doc, "Primary Submit Button", en_common["cta"]["requestConversation"], fr_common["cta"]["requestConversation"], element_type="Primary Button (Orange)", link_url="Form Submission Event")
    add_meta_item(doc, "Secondary Navigation Button", en_common["cta"]["exploreNelias"], fr_common["cta"]["exploreNelias"], element_type="Outline Button", link_url="/features")

    add_heading_2(doc, "4.2 Validation Errors, Alerts & Feedback States")
    add_meta_item(doc, "Error Summary Box Title", en_contact["errors"]["summaryTitle"], fr_contact["errors"]["summaryTitle"], element_type="Alert (tone='danger', role='alert')")
    add_meta_item(doc, "Generic Submission Failure Alert", en_contact["errors"]["submitFailed"], fr_contact["errors"]["submitFailed"], element_type="Alert Body")
    add_meta_item(doc, "Message Too Long For Mailto Alert", en_contact["errors"]["mailtoTooLong"], fr_contact["errors"]["mailtoTooLong"], element_type="Alert Body")
    
    # Success State Callout
    add_callout(
        doc,
        f"Title: \"{en_contact['feedback']['successTitle']}\" | [FR]: \"{fr_contact['feedback']['successTitle']}\"\n\n"
        f"Message (Contact): \"{en_contact['feedback']['success']['contact']}\" | [FR]: \"{fr_contact['feedback']['success']['contact']}\"\n"
        f"Message (Demo): \"{en_contact['feedback']['success']['demo']}\" | [FR]: \"{fr_contact['feedback']['success']['demo']}\"",
        label="SUBMISSION SUCCESS FEEDBACK STATE (Alert tone='success'):",
        border_color=HEX_AZURE
    )

    # Mailto Fallback State Callout
    en_mailto_body = en_contact["feedback"]["mailtoBody"].replace("{{email}}", "contact@nelias.app")
    fr_mailto_body = fr_contact["feedback"]["mailtoBody"].replace("{{email}}", "contact@nelias.app")
    en_mailto_write = en_contact["feedback"]["writeTo"].replace("{{email}}", "contact@nelias.app")
    fr_mailto_write = fr_contact["feedback"]["writeTo"].replace("{{email}}", "contact@nelias.app")
    add_callout(
        doc,
        f"Title: \"{en_contact['feedback']['mailtoTitle']}\" | [FR]: \"{fr_contact['feedback']['mailtoTitle']}\"\n\n"
        f"Body: \"{en_mailto_body}\"\n[FR]: \"{fr_mailto_body}\"\n\n"
        f"Direct Action Link: \"{en_mailto_write}\" | [FR]: \"{fr_mailto_write}\" [Target: mailto:contact@nelias.app]\n"
        f"Email Subject Line: \"{en_contact['mail']['subject']['contact']}\" | [FR]: \"{fr_contact['mail']['subject']['contact']}\"",
        label="MAILTO CLIENT FALLBACK STATE (Alert tone='info'):",
        border_color=HEX_ORANGE
    )

    # =========================================================================
    # SECTION 5: CONTACT DETAILS SIDEBAR PANEL
    # =========================================================================
    add_heading_1(doc, "5. Contact Details Sidebar Panel (ContactDetails.jsx)")
    doc.add_paragraph("Sticky panel on desktop (`lg:col-span-5 lg:sticky lg:top-28`) displaying direct corporate contact channels, office operating hours, and cross-linking to Demo:")

    add_heading_2(doc, "5.1 Direct Corporate Communication Channels")
    add_meta_item(doc, "Panel Heading (H2)", en_contact["details"]["title"], fr_contact["details"]["title"], element_type="Panel Heading (H2)")

    tbl_details = doc.add_table(rows=1, cols=4)
    tbl_details.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_details)
    hdr_details = tbl_details.rows[0]
    hdr_details.cells[0].paragraphs[0].add_run("Channel")
    hdr_details.cells[1].paragraphs[0].add_run("Label (English / French)")
    hdr_details.cells[2].paragraphs[0].add_run("Value / Display Text")
    hdr_details.cells[3].paragraphs[0].add_run("Interactive Target")
    format_row(hdr_details, is_header=True, bg_color=HEX_NAVY)

    details_data = [
        ("Email", f"{en_contact['details']['email']} | [FR]: {fr_contact['details']['email']}", "contact@nelias.app", "mailto:contact@nelias.app"),
        ("Phone", f"{en_contact['details']['phone']} | [FR]: {fr_contact['details']['phone']}", "+225 05 64 05 90 60", "tel:+2250564059060"),
        ("WhatsApp", "WhatsApp", "+225 07 00 40 92 41", "https://wa.me/2250700409241 (New tab)"),
        ("Location", f"{en_contact['details']['address']} | [FR]: {fr_contact['details']['address']}", "Abidjan, Côte d'Ivoire", "Physical Headquarters"),
    ]
    for idx, (d_ch, d_lbl, d_val, d_tgt) in enumerate(details_data):
        row = tbl_details.add_row()
        row.cells[0].paragraphs[0].add_run(d_ch)
        row.cells[1].paragraphs[0].add_run(d_lbl)
        row.cells[2].paragraphs[0].add_run(d_val)
        row.cells[3].paragraphs[0].add_run(d_tgt)
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "5.2 Business Hours & SLA Commitment")
    add_meta_item(doc, "Hours Section Heading", en_contact["hours"]["title"], fr_contact["hours"]["title"], element_type="Subsection Title")
    add_meta_item(doc, "Operating Schedule", en_contact["hours"]["schedule"], fr_contact["hours"]["schedule"], element_type="Schedule Text")
    add_meta_item(doc, "Response Time Commitment", en_contact["hours"]["response"], fr_contact["hours"]["response"], element_type="SLA Notice")

    add_callout(
        doc,
        f"Schedule: \"{en_contact['hours']['schedule']}\" | [FR]: \"{fr_contact['hours']['schedule']}\"\n\n"
        f"Commitment: \"{en_contact['hours']['response']}\" | [FR]: \"{fr_contact['hours']['response']}\"",
        label="OPERATING SCHEDULE & RESPONSE COMMITMENT:",
        border_color=HEX_AZURE
    )

    add_heading_2(doc, "5.3 Demo Cross-Link CTA")
    add_meta_item(doc, "Cross-Link Label", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="TextLink", link_url="/demo")

    # =========================================================================
    # SECTION 6: INTERACTIVE LOCATION MAP SECTION
    # =========================================================================
    add_heading_1(doc, "6. Headquarters Location & Interactive Map (ContactLocation.jsx)")
    doc.add_paragraph("Displays the physical location of Debass Technologies / NELIAS headquarters in Abidjan, Côte d'Ivoire with an embedded Google Maps iframe:")

    add_meta_item(doc, "Section Heading (H2)", en_contact["map"]["title"], fr_contact["map"]["title"], element_type="Section Heading (H2)")
    add_meta_item(doc, "Section Subtitle / Lead", en_contact["map"]["lead"], fr_contact["map"]["lead"], element_type="Lead Paragraph")
    add_meta_item(doc, "City / Location Label", en_contact["map"]["city"], fr_contact["map"]["city"], element_type="Location Tag")
    add_meta_item(doc, "Interactive Map Frame", "Google Maps Embed (Abidjan, Côte d'Ivoire, Coordinates: 5.348769, -4.144481)", element_type="iframe[width='100%', height='450']")

    add_callout(
        doc,
        f"[EN]: \"{en_contact['map']['lead']}\"\n\n"
        f"[FR]: \"{fr_contact['map']['lead']}\"\n\n"
        f"Location: {en_contact['map']['city']}",
        label="PHYSICAL HEADQUARTERS & CONSULTATION SCOPE:",
        border_color=HEX_ORANGE
    )

    # =========================================================================
    # SECTION 7: FULL QUALIFICATION FORM & BUSINESS NEEDS CATALOG
    # =========================================================================
    add_heading_1(doc, "7. Extended Qualification Form & Business Needs Catalog (LeadForm.jsx & NeedsFieldset.jsx)")
    doc.add_paragraph("The lead capture architecture supports optional qualification fields for deep customer scoping (utilized in full mode and demo requests):")

    add_heading_2(doc, "7.1 Dropdown Options: Company Size Tiers (5 Tiers)")
    add_meta_item(doc, "Company Size Label", en_contact["form"]["companySize"], fr_contact["form"]["companySize"], element_type="Select Label")
    add_meta_item(doc, "Company Size Hint", en_contact["form"]["companySizeHint"], fr_contact["form"]["companySizeHint"], element_type="Helper Text")

    tbl_sizes = doc.add_table(rows=1, cols=3)
    tbl_sizes.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sizes)
    hdr_sizes = tbl_sizes.rows[0]
    hdr_sizes.cells[0].paragraphs[0].add_run("Size ID")
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

    add_heading_2(doc, "7.2 Dropdown Options: 12 Industry Sectors + Other")
    add_meta_item(doc, "Industry Field Label", en_contact["form"]["industry"], fr_contact["form"]["industry"], element_type="Select Label")
    add_meta_item(doc, "Other Option Label", en_contact["form"]["other"], fr_contact["form"]["other"], element_type="Select Fallback Option")

    tbl_ind = doc.add_table(rows=1, cols=3)
    tbl_ind.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_ind)
    hdr_ind = tbl_ind.rows[0]
    hdr_ind.cells[0].paragraphs[0].add_run("Industry Slug")
    hdr_ind.cells[1].paragraphs[0].add_run("Industry Name (English)")
    hdr_ind.cells[2].paragraphs[0].add_run("Industry Name (French)")
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

    # Add other option
    row_oth = tbl_ind.add_row()
    row_oth.cells[0].paragraphs[0].add_run("other")
    row_oth.cells[1].paragraphs[0].add_run(en_contact["form"]["other"])
    row_oth.cells[2].paragraphs[0].add_run(fr_contact["form"]["other"])
    format_row(row_oth, bg_color=HEX_LIGHT_BG if len(ind_slugs) % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_heading_2(doc, "7.3 Business Needs Capability Checklist (NeedsFieldset.jsx)")
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

    # =========================================================================
    # SECTION 8: DEMO EXPECTATIONS SIDEBAR REFERENCE
    # =========================================================================
    add_heading_1(doc, "8. Demo Expectations Walkthrough Reference (DemoExpectations.jsx)")
    doc.add_paragraph("Shared companion component explaining live product walkthrough steps (referenced via cross-link on the Contact page):")

    add_meta_item(doc, "Panel Title (H2)", en_contact["demoSidebar"]["title"], fr_contact["demoSidebar"]["title"], element_type="Panel Heading (H2)")
    add_meta_item(doc, "Panel Lead", en_contact["demoSidebar"]["lead"], fr_contact["demoSidebar"]["lead"], element_type="Lead Paragraph")

    tbl_demo = doc.add_table(rows=1, cols=3)
    tbl_demo.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_demo)
    hdr_demo = tbl_demo.rows[0]
    hdr_demo.cells[0].paragraphs[0].add_run("Item Title")
    hdr_demo.cells[1].paragraphs[0].add_run("Walkthrough Description (English)")
    hdr_demo.cells[2].paragraphs[0].add_run("Walkthrough Description (French)")
    format_row(hdr_demo, is_header=True, bg_color=HEX_NAVY)

    for idx, (item_e, item_f) in enumerate(zip(en_contact["demoSidebar"]["items"], fr_contact["demoSidebar"]["items"])):
        row = tbl_demo.add_row()
        row.cells[0].paragraphs[0].add_run(f"{item_e['title']}\n[FR]: {item_f['title']}")
        row.cells[1].paragraphs[0].add_run(item_e["desc"])
        row.cells[2].paragraphs[0].add_run(item_f["desc"])
        format_row(row, bg_color=HEX_LIGHT_BG if idx % 2 == 1 else HEX_WHITE)

    doc.add_paragraph()

    add_meta_item(doc, "Alternative Contact Title", en_contact["demoSidebar"]["altContactTitle"], fr_contact["demoSidebar"]["altContactTitle"], element_type="Section Heading (H3)")
    add_meta_item(doc, "Alternative Contact Description", en_contact["demoSidebar"]["altContactDesc"], fr_contact["demoSidebar"]["altContactDesc"], element_type="Paragraph")
    add_meta_item(doc, "Alternative Contact Action Link", en_contact["demoSidebar"]["altContactLink"], fr_contact["demoSidebar"]["altContactLink"], element_type="TextLink", link_url="/contact")

    # =========================================================================
    # SECTION 9: MOBILE DRAWER & STICKY CTA
    # =========================================================================
    add_heading_1(doc, "9. Mobile Drawer & Floating CTA (MobileNavDrawer.jsx & StickyMobileCta.jsx)")
    doc.add_paragraph("Responsive navigation and conversion elements rendered on mobile viewports on the Contact Page:")

    add_heading_2(doc, "9.1 Mobile Navigation Drawer (MobileNavDrawer.jsx)")
    add_meta_item(doc, "Drawer Accessible Label", en_common["header"]["menu"], fr_common["header"]["menu"], element_type="dialog[aria-label]")
    add_meta_item(doc, "Close Button Accessible Label", en_common["a11y"]["closeMenu"], fr_common["a11y"]["closeMenu"], element_type="button[aria-label]")
    add_meta_item(doc, "Drawer Nav Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Nav Link", link_url="/")
    add_meta_item(doc, "Drawer Nav Link 2", en_common["nav"]["about"], fr_common["nav"]["about"], element_type="Nav Link", link_url="/about")
    add_meta_item(doc, "Drawer Nav Link 3", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Nav Link", link_url="/industries")
    add_meta_item(doc, "Drawer Nav Link 4", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Nav Link", link_url="/features")
    add_meta_item(doc, "Drawer Nav Link 5", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Nav Link", link_url="/pricing")
    add_meta_item(doc, "Drawer Nav Link 6 (Active)", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Nav Link (Active)", link_url="/contact")
    add_meta_item(doc, "Drawer External Sign In", en_common["nav"]["signIn"], fr_common["nav"]["signIn"], element_type="External Link", link_url="https://login.nelias.app")
    add_meta_item(doc, "Drawer Full-width CTA", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Full-width Button", link_url="/demo")

    add_heading_2(doc, "9.2 Sticky Mobile Floating CTA Bar (StickyMobileCta.jsx)")
    doc.add_paragraph("Floating bar appearing on viewports < 768px after scrolling 480px, auto-hidden when the footer is reached:")
    add_meta_item(doc, "Floating CTA Button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], element_type="Sticky Fixed Button", link_url="/demo")

    # =========================================================================
    # SECTION 10: SITE FOOTER
    # =========================================================================
    add_heading_1(doc, "10. Site Footer (Footer.jsx)")
    doc.add_paragraph("Persistent dark footer rendered on the Contact Page, containing corporate attribution, navigation links, direct contact channels, and legal agreements:")

    add_heading_2(doc, "10.1 Brand & Corporate Attribution")
    add_meta_item(doc, "Brand Name", en_common["brand"]["name"], fr_common["brand"]["name"], element_type="Logo text")
    add_meta_item(doc, "Footer Brand Tagline", en_common["brand"]["footerTagline"], fr_common["brand"]["footerTagline"], element_type="Brand Mission Statement")

    add_heading_2(doc, "10.2 Explore Column Links")
    add_meta_item(doc, "Explore Column Heading", en_common["footer"]["exploreHeading"], fr_common["footer"]["exploreHeading"], element_type="Column Header (H2)")
    add_meta_item(doc, "Explore Link 1", en_common["nav"]["home"], fr_common["nav"]["home"], element_type="Footer Link", link_url="/")
    add_meta_item(doc, "Explore Link 2", en_common["nav"]["industries"], fr_common["nav"]["industries"], element_type="Footer Link", link_url="/industries")
    add_meta_item(doc, "Explore Link 3", en_common["nav"]["features"], fr_common["nav"]["features"], element_type="Footer Link", link_url="/features")
    add_meta_item(doc, "Explore Link 4", en_common["nav"]["pricing"], fr_common["nav"]["pricing"], element_type="Footer Link", link_url="/pricing")
    add_meta_item(doc, "Explore Link 5 (Active Page)", en_common["nav"]["contact"], fr_common["nav"]["contact"], element_type="Footer Link (Current)", link_url="/contact")

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
    out_file = os.path.join(out_dir, "contact_page_Content.docx")
    
    doc.save(out_file)
    print(f"Document successfully created and saved at: {out_file}")

if __name__ == "__main__":
    main()
