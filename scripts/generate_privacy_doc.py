import os
import json
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Brand Palette Constants (Exact NELIAS Brand Design System)
NAVY = RGBColor(0x0F, 0x17, 0x2A)      # #0F172A - Headings, Primary Brand, Inverse Background
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary Accent / Callout / Legal Focus
AZURE = RGBColor(0x02, 0x84, 0xC7)     # #0284C7 - Secondary links, Badges, Section Accents
SLATE = RGBColor(0x47, 0x55, 0x69)     # #475569 - Secondary text, Subtitles, Meta
INK = RGBColor(0x1E, 0x29, 0x3B)       # #1E293B - Primary Body Text
WHITE = RGBColor(0xFF, 0xFF, 0xFF)     # #FFFFFF - Crisp White
MUTED_BORDER = RGBColor(0xCB, 0xD5, 0xE1)

HEX_NAVY = "0F172A"
HEX_ORANGE = "EA580C"
HEX_AZURE = "0284C7"
HEX_LIGHT_BG = "F8FAFC"
HEX_BORDER = "CBD5E1"
HEX_MUTED_BG = "F1F5F9"
HEX_ACCENT_SOFT = "FFF7ED"
HEX_WHITE = "FFFFFF"
HEX_NOTE_BG = "EFF6FF"
HEX_NOTE_BORDER = "3B82F6"

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
    h.paragraph_format.space_before = Pt(13)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(12)
    r.font.color.rgb = AZURE
    return h

def add_heading_3(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(9)
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

def add_bilingual_table(doc, headers, data_rows, col_widths=None):
    tbl = doc.add_table(rows=len(data_rows) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl, HEX_BORDER, "4")
    
    hdr_row = tbl.rows[0]
    for i, title in enumerate(headers):
        hdr_row.cells[i].paragraphs[0].text = title
    format_row(hdr_row, is_header=True, bg_color=HEX_NAVY)
    
    for row_idx, row_data in enumerate(data_rows):
        row = tbl.rows[row_idx + 1]
        bg = HEX_LIGHT_BG if row_idx % 2 == 1 else HEX_WHITE
        for col_idx, cell_value in enumerate(row_data):
            row.cells[col_idx].paragraphs[0].text = str(cell_value)
        format_row(row, is_header=False, bg_color=bg)
        
    if col_widths:
        for row in tbl.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)
                
    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_before = Pt(0)
    p_after.paragraph_format.space_after = Pt(4)
    return tbl

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    def load_json(rel_path):
        with open(os.path.join(base_dir, rel_path), "r", encoding="utf-8") as f:
            return json.load(f)
            
    en_privacy = load_json("src/i18n/locales/en/privacy.json")
    fr_privacy = load_json("src/i18n/locales/fr/privacy.json")
    en_common = load_json("src/i18n/locales/en/common.json")
    fr_common = load_json("src/i18n/locales/fr/common.json")

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
    r_title = p_title.add_run("NELIAS Marketing Portal - Privacy Policy Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Pages, Legal Components, Retention Matrix, Navigation & Locales)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    add_callout(
        doc,
        "This document contains all content for the NELIAS Privacy Policy page extracted verbatim directly from the repository source code (src/pages/PrivacyPage.jsx, src/sections/legal/LegalPage.jsx, src/sections/legal/LegalArticle.jsx, src/sections/legal/LegalToc.jsx, and src/i18n/locales/*/privacy.json). Every article, retention table, data recipient, security control, legal basis, and navigation element is preserved in its original sequence in both English and French without rewriting, summarizing, or omissions.",
        label="DOCUMENT OVERVIEW & VERBATIM EXTRACTION MANDATE",
        border_color=HEX_ORANGE,
        bg_color=HEX_ACCENT_SOFT
    )

    # =========================================================================
    # SECTION 1: ROUTING, SEO & DOCUMENT METADATA
    # =========================================================================
    add_heading_1(doc, "1. Page Routing, SEO & Metadata Specification")
    
    p_meta_intro = doc.add_paragraph()
    p_meta_intro.paragraph_format.space_after = Pt(4)
    p_meta_intro.add_run("The table below details page-level metadata and routing definitions declared in ")
    p_meta_intro.add_run("src/app/router.jsx").bold = True
    p_meta_intro.add_run(", ")
    p_meta_intro.add_run("src/pages/PrivacyPage.jsx").bold = True
    p_meta_intro.add_run(", and ")
    p_meta_intro.add_run("src/i18n/locales/*/privacy.json").bold = True
    p_meta_intro.add_run(":")

    meta_rows = [
        ["Target Primary Route", "/privacy", "/privacy", "Exact URL Path"],
        ["Canonical URL", "https://nelias.app/privacy", "https://nelias.app/privacy", "Canonical Link"],
        ["HTML Title Tag (<title>)", en_privacy["seo"]["title"], fr_privacy["seo"]["title"], "Browser Tab Title (<Seo />)"],
        ["Meta Description", en_privacy["seo"]["description"], fr_privacy["seo"]["description"], "Search Engine Snippet"],
        ["Document Official Version", en_privacy["meta"]["version"], fr_privacy["meta"]["version"], "Version & Publication Date"],
        ["Legal Publisher Line", en_privacy["meta"]["publisher"], fr_privacy["meta"]["publisher"], "Entity & Primary Platform Link"],
        ["Convenience Translation Notice", en_privacy["meta"]["notice"], "[None - French original prevails]", "Alert tone='note' (English view only)"],
        ["Table of Contents Label", en_privacy["page"]["contents"], fr_privacy["page"]["contents"], "TOC Component Header"],
        ["Language Switcher Action", en_privacy["page"]["languageLink"], fr_privacy["page"]["languageLink"], "Interactive Language Toggle Link"]
    ]
    add_bilingual_table(doc, ["Metadata Property", "English Content (Default)", "French Content (Français)", "Technical Placement"], meta_rows, [1.4, 2.3, 2.3, 1.0])

    if en_privacy["meta"].get("notice"):
        add_callout(
            doc,
            en_privacy["meta"]["notice"],
            label="ENGLISH CONVENIENCE NOTICE (ALERT COMPONENT)",
            border_color=HEX_NOTE_BORDER,
            bg_color=HEX_NOTE_BG
        )

    # =========================================================================
    # SECTION 2: PAGE HEADER & HERO BLOCK
    # =========================================================================
    add_heading_1(doc, "2. Page Hero Header (PageHeader Component)")

    p_header_desc = doc.add_paragraph()
    p_header_desc.paragraph_format.space_after = Pt(4)
    p_header_desc.add_run("Rendered at the top of the page via ").font.color.rgb = INK
    p_header_desc.add_run("PageHeader (tone='tint', accent=false)").bold = True
    p_header_desc.add_run(". Features a subdued tint background with the document title and publication version string.")

    header_rows = [
        ["H1 Document Title", "privacy:meta.title", en_privacy["meta"]["title"], fr_privacy["meta"]["title"]],
        ["Lead Version Line", "privacy:meta.version", en_privacy["meta"]["version"], fr_privacy["meta"]["version"]],
        ["Publisher Subtitle", "privacy:meta.publisher", en_privacy["meta"]["publisher"], fr_privacy["meta"]["publisher"]],
        ["Language Toggle Action", "privacy:page.languageLink", en_privacy["page"]["languageLink"], fr_privacy["page"]["languageLink"]]
    ]
    add_bilingual_table(doc, ["Element", "Source Token", "English Verbatim", "French Verbatim"], header_rows, [1.5, 1.4, 2.1, 2.0])

    # =========================================================================
    # SECTION 3: TABLE OF CONTENTS (LEGAL TOC)
    # =========================================================================
    add_heading_1(doc, "3. Table of Contents Navigation (LegalToc Component)")

    p_toc_desc = doc.add_paragraph()
    p_toc_desc.paragraph_format.space_after = Pt(4)
    p_toc_desc.add_run("Component: ").bold = True
    p_toc_desc.add_run("src/sections/legal/LegalToc.jsx\n").font.color.rgb = AZURE
    p_toc_desc.add_run("Behavior: Two responsive variants with IntersectionObserver scroll-spy:\n")
    p_toc_desc.add_run("• Desktop: Sticky left navigation column (lg:col-span-4, top-28) with active border indicator.\n")
    p_toc_desc.add_run("• Mobile: Collapsible <details> accordion menu (lg:hidden) with interactive summary.")

    toc_rows = []
    for idx, (en_art, fr_art) in enumerate(zip(en_privacy["articles"], fr_privacy["articles"])):
        target_id = f"#article-{idx + 1}"
        toc_rows.append([f"Item {idx + 1}", target_id, en_art["title"], fr_art["title"]])

    add_bilingual_table(doc, ["Index", "Anchor Target", "English Navigation Title", "French Navigation Title"], toc_rows, [0.8, 1.2, 2.5, 2.5])

    # =========================================================================
    # SECTION 4: COMPLETE ARTICLE-BY-ARTICLE VERBATIM CONTENT
    # =========================================================================
    add_heading_1(doc, "4. Complete Article-by-Article Verbatim Content")

    p_art_intro = doc.add_paragraph()
    p_art_intro.paragraph_format.space_after = Pt(4)
    p_art_intro.add_run("Below is the complete verbatim text of all 10 numbered articles rendered by ").font.color.rgb = INK
    p_art_intro.add_run("LegalArticle.jsx").bold = True
    p_art_intro.add_run(", including paragraph blocks, data tables, and auto-linked email/URL references.")

    for idx, (en_art, fr_art) in enumerate(zip(en_privacy["articles"], fr_privacy["articles"])):
        art_num = idx + 1
        art_title_en = en_art["title"]
        art_title_fr = fr_art["title"]

        add_heading_2(doc, f"Article {art_num}: {art_title_en}")
        
        # Title metadata
        p_tmeta = doc.add_paragraph()
        p_tmeta.paragraph_format.space_before = Pt(0)
        p_tmeta.paragraph_format.space_after = Pt(4)
        r_tm1 = p_tmeta.add_run("Anchor ID: ")
        r_tm1.bold = True
        r_tm1.font.color.rgb = SLATE
        p_tmeta.add_run(f"article-{art_num}  |  ")
        r_tm2 = p_tmeta.add_run("Title in French: ")
        r_tm2.bold = True
        r_tm2.font.color.rgb = SLATE
        p_tmeta.add_run(f"\"{art_title_fr}\"")

        # Process blocks
        for b_idx, (en_block, fr_block) in enumerate(zip(en_art["blocks"], fr_art["blocks"])):
            if "p" in en_block:
                p_blk = doc.add_paragraph()
                p_blk.paragraph_format.space_before = Pt(3)
                p_blk.paragraph_format.space_after = Pt(3)
                p_blk.paragraph_format.line_spacing = 1.15
                
                r_lbl = p_blk.add_run(f"[EN Paragraph {b_idx + 1}]: ")
                r_lbl.bold = True
                r_lbl.font.color.rgb = NAVY
                p_blk.add_run(en_block["p"]).font.color.rgb = INK

                p_fr = doc.add_paragraph()
                p_fr.paragraph_format.space_before = Pt(1)
                p_fr.paragraph_format.space_after = Pt(5)
                p_fr.paragraph_format.line_spacing = 1.15
                
                r_fr_lbl = p_fr.add_run(f"[FR Paragraphe {b_idx + 1}]: ")
                r_fr_lbl.bold = True
                r_fr_lbl.font.color.rgb = SLATE
                p_fr.add_run(fr_block["p"]).font.color.rgb = INK

            elif "table" in en_block:
                p_tbl_lbl = doc.add_paragraph()
                p_tbl_lbl.paragraph_format.space_before = Pt(4)
                p_tbl_lbl.paragraph_format.space_after = Pt(2)
                r_tl = p_tbl_lbl.add_run(f"Data Processing & Retention Matrix (Article {art_num})")
                r_tl.bold = True
                r_tl.font.color.rgb = AZURE

                en_tbl = en_block["table"]
                fr_tbl = fr_block["table"]
                
                # We show the English Table
                add_heading_3(doc, "English Matrix (Source Verbatim)")
                en_table_data = []
                for row in en_tbl["rows"]:
                    en_table_data.append(row)
                add_bilingual_table(doc, en_tbl["head"], en_table_data, [1.8, 1.6, 1.8, 1.8])

                # Then French Table
                add_heading_3(doc, "French Matrix / Grille des finalités et durées de conservation (Verbatim)")
                fr_table_data = []
                for row in fr_tbl["rows"]:
                    fr_table_data.append(row)
                add_bilingual_table(doc, fr_tbl["head"], fr_table_data, [1.8, 1.6, 1.8, 1.8])

            elif "ul" in en_block:
                for u_idx, (en_item, fr_item) in enumerate(zip(en_block["ul"], fr_block["ul"])):
                    p_ul = doc.add_paragraph()
                    p_ul.paragraph_format.space_before = Pt(2)
                    p_ul.paragraph_format.space_after = Pt(2)
                    r_u_lbl = p_ul.add_run(f"• Item {u_idx + 1} [EN]: ")
                    r_u_lbl.bold = True
                    p_ul.add_run(en_item)
                    r_u_fr = p_ul.add_run(f" | [FR]: {fr_item}")
                    r_u_fr.font.color.rgb = SLATE

    # =========================================================================
    # SECTION 5: INTERACTIVE LINKS & SENSITIVE DATA CATALOGUE
    # =========================================================================
    add_heading_1(doc, "5. Interactive Links, Contact Points & Infrastructure Registry")

    p_links_desc = doc.add_paragraph()
    p_links_desc.paragraph_format.space_after = Pt(4)
    p_links_desc.add_run("Rendered automatically via ").font.color.rgb = INK
    p_links_desc.add_run("Linkified.jsx").bold = True
    p_links_desc.add_run(". Identifies all interactive email mailto links, telephone dialers, external URLs, and named infrastructure entities referenced across the policy:")

    infra_rows = [
        ["Data Controller Entity", "Debass Technologies SARL", "Cocody, Abidjan, Côte d'Ivoire (RCCM CI-ABJ-3-2024-M-16771, NCC 2401322M, Capital 5,000,000 FCFA)", "Article 1"],
        ["Legal Representative", "Jules TIEMOKO", "Legal representative of Debass Technologies SARL", "Article 1"],
        ["General Company Email", "info@debasstechnologies.com", "mailto:info@debasstechnologies.com", "Articles 1 & 10"],
        ["Corporate Phone", "+225 05 64 05 90 60", "tel:+2250564059060", "Article 1"],
        ["Marketing Platform URL", "https://nelias.app", "https://nelias.app", "Articles 1, 5, 10"],
        ["Dedicated Privacy Inquiries", "contact@nelias.app", "mailto:contact@nelias.app (Rights & requests)", "Articles 7 & 10"],
        ["Supervisory Authority", "ARTCI", "Telecommunications/ICT Regulatory Authority of Côte d'Ivoire", "Article 7"],
        ["Applicable Data Protection Law", "Law no. 2013-450", "Ivorian law on the protection of personal data", "Article 7"],
        ["Primary Data Centre Host", "Hodi", "Grand-Bassam, Côte d'Ivoire (Production Hosting)", "Articles 4 & 5"],
        ["Disaster Recovery Host", "Hodi", "Johannesburg, South Africa (Disaster Recovery Site)", "Articles 4 & 5"],
        ["Support & Development Partner", "CRMPUNCH", "Support and core platform development subcontractor", "Article 4"]
    ]
    add_bilingual_table(doc, ["Registry Category", "Identified Entity / Value", "Technical Target / Context", "Source Citation"], infra_rows, [1.5, 1.8, 2.7, 1.0])

    # =========================================================================
    # SECTION 6: GLOBAL LAYOUT, NAVIGATION & FOOTER CONTEXT
    # =========================================================================
    add_heading_1(doc, "6. Surrounding Page Frame & Global Navigation Context")

    p_frame_desc = doc.add_paragraph()
    p_frame_desc.paragraph_format.space_after = Pt(4)
    p_frame_desc.add_run("The Privacy Policy page is accessible site-wide via the persistent footer legal navigation declared in ").font.color.rgb = INK
    p_frame_desc.add_run("src/config/navigation.js").bold = True
    p_frame_desc.add_run(" and ").font.color.rgb = INK
    p_frame_desc.add_run("src/app/RootLayout.jsx").bold = True
    p_frame_desc.add_run(":")

    nav_rows = [
        ["Footer Legal Nav: Privacy", "privacy", en_common["nav"]["privacy"], fr_common["nav"]["privacy"], "/privacy (Current Page)"],
        ["Footer Legal Nav: Terms of Use", "terms", en_common["nav"]["terms"], fr_common["nav"]["terms"], "/terms"],
        ["Footer Legal Nav: FAQ", "faq", en_common["nav"]["faq"], fr_common["nav"]["faq"], "/faq"],
        ["Footer Legal Nav: DPA", "dpa", en_common["nav"]["dpa"], fr_common["nav"]["dpa"], "/dpa"],
        ["Footer Legal Nav: SLA", "sla", en_common["nav"]["sla"], fr_common["nav"]["sla"], "/sla"],
        ["Header Primary CTA", "bookDemo", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"], "/demo"],
        ["Top Utility Language Toggle", "language", "Language (EN / FR)", "Langue (EN / FR)", "Language selector in utility header"]
    ]
    add_bilingual_table(doc, ["Chrome Element", "Key", "English Verbatim", "French Verbatim", "Route Target"], nav_rows, [1.5, 0.8, 2.1, 2.1, 1.5])

    # =========================================================================
    # SECTION 7: EDITORIAL IMPLEMENTATION & GOVERNANCE NOTES
    # =========================================================================
    add_heading_1(doc, "7. Source Code Governance & Legal Review Annotations")

    p_gov_desc = doc.add_paragraph()
    p_gov_desc.paragraph_format.space_after = Pt(4)
    p_gov_desc.add_run("The following verbatim comments exist directly in ").font.color.rgb = INK
    p_gov_desc.add_run("src/pages/PrivacyPage.jsx").bold = True
    p_gov_desc.add_run(", documenting open editorial checkpoints, legal consistency requirements, and pre-publication action items:")

    gov_rows = [
        ["Line 3", "SEO Text Approval", "TODO(Debass): the SEO title and description are derived from the document header; no approved SEO text exists for legal pages."],
        ["Line 4", "DPA Cross-Linking", "TODO(Debass): the Privacy Policy references the DPA (articles 1 and 9). It appears as plain text; add a link when the DPA page is linked from here. The other legal pages should link to this policy."],
        ["Line 5", "Hosting Architecture Consistency", "TODO(Debass): article 5 states hosting facts definitively (Hodi in Grand-Bassam, recovery site in Johannesburg, copies remain in Africa). Keep it consistent with the DPA (article 6, annex 2), the Terms of Use (article 10) and the marketing FAQ."],
        ["Line 6", "Consent Mechanism Verification", "TODO(Debass): article 8 says non-essential cookies and optional marketing are subject to separate choices and that consent can be withdrawn through mechanisms provided. Confirm the site actually provides these (cookie consent, analytics, newsletter or marketing forms) and that mandatory form fields are indicated, as article 3 states."],
        ["Line 7", "Retention & Subcontractor Audit", "TODO(Debass): confirm the retention periods in article 3 (3 years, 12 months, 30 days) match real practice and the DPA return period; article 2 mentions payments by a specialised provider and article 4 other providers 'where actually activated': confirm which providers are in use."],
        ["Line 8", "Dual Contact Address Alignment", "TODO(Debass): two contact addresses appear (info@debasstechnologies.com and contact@nelias.app, article 7 and 10). Confirm this is intentional."],
        ["Line 9", "Pre-Publication Regulatory Review", "TODO(Debass): legal review of articles 3 (legal bases and retention), 7 (rights, Ivorian law no. 2013-450, ARTCI) and 8 (cookies and marketing) before publication."]
    ]
    add_bilingual_table(doc, ["Source Line", "Governance Area", "Exact Verbatim Developer/Legal Comment"], gov_rows, [1.0, 1.8, 4.2])

    # Final document save
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "privacy_policy_page_Content.docx")
    doc.save(out_path)
    print(f"Document successfully created at: {out_path}")
    print(f"File size: {os.path.getsize(out_path)} bytes")

if __name__ == "__main__":
    main()
