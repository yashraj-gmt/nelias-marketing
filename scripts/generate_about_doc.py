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
ORANGE = RGBColor(0xEA, 0x58, 0x0C)    # #EA580C - Primary Accent / Pull Statement / CTA
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
HEX_INVERSE_BG = "0F172A"
HEX_INVERSE_CARD = "1E293B"

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
            
    en_about = load_json("src/i18n/locales/en/about.json")
    fr_about = load_json("src/i18n/locales/fr/about.json")
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
    r_title = p_title.add_run("NELIAS Marketing Portal - About Us Page Content Specification")
    r_title.bold = True
    r_title.font.size = Pt(22)
    r_title.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run("Complete verbatim content extraction directly from website source code (Pages, Editorial Sections, Foundation Models & Locales)")
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = SLATE

    add_callout(
        doc,
        "This document contains all content for the NELIAS About Us page extracted directly from the repository source code (src/pages/AboutPage.jsx, src/sections/about/*, src/sections/home/WhySection.jsx, and associated bilingual locales). Every string, paragraph, section heading, narrative statement, editorial pull quote, philosophy triad, institutional pillar, and closing call-to-action is recorded verbatim in both English and French in exact visual rendering order without summarization, rewriting, or omissions.",
        label="DOCUMENT OVERVIEW & COMPLIANCE MANDATE",
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
    p_meta_intro.add_run("src/pages/AboutPage.jsx").bold = True
    p_meta_intro.add_run(", ")
    p_meta_intro.add_run("src/routes.jsx").bold = True
    p_meta_intro.add_run(", and ")
    p_meta_intro.add_run("src/i18n/locales/*/seo.json").bold = True
    p_meta_intro.add_run(":")

    meta_rows = [
        ["Target Primary Route", "/about", "/about", "Exact URL Path"],
        ["Route Alias / Redirect", "/about-us -> /about", "/about-us -> /about", "Route Alias"],
        ["Canonical URL", "https://nelias.app/about", "https://nelias.app/about", "Canonical Link"],
        ["HTML Title Tag (<title>)", en_seo["about"]["title"], fr_seo["about"]["title"], "Browser Tab Title"],
        ["Meta Description", en_seo["about"]["description"], fr_seo["about"]["description"], "Search Engine Snippet"],
        ["OpenGraph / Social Title", en_seo["social"]["title"], fr_seo["social"]["title"], "Social Sharing Header"],
        ["OpenGraph Description", en_seo["social"]["description"], fr_seo["social"]["description"], "Social Sharing Snippet"],
        ["Active Navigation Indicator", "About us", "À propos", "Global Header Nav Active State"]
    ]
    add_bilingual_table(doc, ["Metadata Property", "English Content (Default)", "French Content (Français)", "Technical Placement"], meta_rows, [1.4, 2.3, 2.3, 1.0])

    # =========================================================================
    # SECTION 2: PAGE HERO HEADER
    # =========================================================================
    add_heading_1(doc, "2. Page Hero Header (PageHeader Component)")

    p_header_desc = doc.add_paragraph()
    p_header_desc.paragraph_format.space_after = Pt(4)
    p_header_desc.add_run("Rendered at the top of the page via ").font.color.rgb = INK
    p_header_desc.add_run("PageHeader (tone='tint', spacing='sm', accent=true)").bold = True
    p_header_desc.add_run(". Features a warm tint background with the NELIAS brand ribbon accent line.")

    header_rows = [
        ["H1 Page Title", "about:header.title", en_about["header"]["title"], fr_about["header"]["title"]],
        ["Lead Subtitle", "about:header.lead", en_about["header"]["lead"], fr_about["header"]["lead"]],
        ["Visual Accent Element", "PageHeader prop: accent=true", "Brand ribbon accent line (Flame-to-Sun gradient)", "Bande accentuée dégradée du ruban de marque"]
    ]
    add_bilingual_table(doc, ["Element", "Source Token", "English Verbatim", "French Verbatim"], header_rows, [1.5, 1.4, 2.1, 2.0])

    # =========================================================================
    # SECTION 3: OUR STORY SECTION
    # =========================================================================
    add_heading_1(doc, "3. Section 1: Our Story (StorySection.jsx)")

    p_story_desc = doc.add_paragraph()
    p_story_desc.paragraph_format.space_after = Pt(4)
    p_story_desc.add_run("Component: ").bold = True
    p_story_desc.add_run("src/sections/about/StorySection.jsx\n").font.color.rgb = AZURE
    p_story_desc.add_run("Layout Structure: Two-column grid (lg:grid-cols-12, gap-14). Left column (col-span-4) displays the sticky Section Heading. Right column (col-span-8) displays the narrative progression with two opening paragraphs, an accent editorial pull quote, a framing sentence, an elevated tint panel housing the core question, and a concluding synthesis.")

    story_rows = [
        ["Section Heading (H2)", "about:story.title", en_about["story"]["title"], fr_about["story"]["title"], "Sticky Column Heading (H2)"],
        ["Narrative Paragraph 1", "about:story.p1", en_about["story"]["p1"], fr_about["story"]["p1"], "Lead Body Text"],
        ["Narrative Paragraph 2", "about:story.p2", en_about["story"]["p2"], fr_about["story"]["p2"], "Lead Body Text"],
        ["Editorial Pull Statement", "about:story.pull", en_about["story"]["pull"], fr_about["story"]["pull"], "PullStatement (variant='accent')"],
        ["Framing Paragraph 3", "about:story.p3", en_about["story"]["p3"], fr_about["story"]["p3"], "Lead Body Text"],
        ["Fundamental Question", "about:story.question", en_about["story"]["question"], fr_about["story"]["question"], "Panel tone='tint' + PullStatement size='md'"],
        ["Concluding Paragraph 4", "about:story.p4", en_about["story"]["p4"], fr_about["story"]["p4"], "Lead Body Text"]
    ]
    add_bilingual_table(doc, ["Element", "Token Key", "English Text", "French Text", "Component & Style"], story_rows, [1.3, 1.1, 2.2, 2.2, 1.2])

    add_heading_2(doc, "Verbatim Text Blocks - Our Story")
    add_meta_item(doc, "H2 Section Title", en_about["story"]["title"], fr_about["story"]["title"], element_type="H2 sticky heading")
    add_meta_item(doc, "Paragraph 1 (The Vision)", en_about["story"]["p1"], fr_about["story"]["p1"], element_type="p.text-lead")
    add_meta_item(doc, "Paragraph 2 (The Growing Challenge)", en_about["story"]["p2"], fr_about["story"]["p2"], element_type="p.text-lead")
    add_meta_item(doc, "Editorial Pull Quote", en_about["story"]["pull"], fr_about["story"]["pull"], element_type="PullStatement variant='accent'")
    add_meta_item(doc, "Paragraph 3 (Debass Questioning)", en_about["story"]["p3"], fr_about["story"]["p3"], element_type="p.text-lead")
    add_meta_item(doc, "Tint Question Callout", en_about["story"]["question"], fr_about["story"]["question"], element_type="Panel tone='tint' > PullStatement")
    add_meta_item(doc, "Paragraph 4 (NELIAS Origin)", en_about["story"]["p4"], fr_about["story"]["p4"], element_type="p.text-lead")

    # =========================================================================
    # SECTION 4: WHY NELIAS (INSTITUTIONAL PILLARS)
    # =========================================================================
    add_heading_1(doc, "4. Section 2: Why NELIAS (WhySection.jsx)")

    p_why_desc = doc.add_paragraph()
    p_why_desc.paragraph_format.space_after = Pt(4)
    p_why_desc.add_run("Component: ").bold = True
    p_why_desc.add_run("src/sections/home/WhySection.jsx (invoked with tone='muted' and headingId='about-why-heading')\n").font.color.rgb = AZURE
    p_why_desc.add_run("Layout Structure: Balanced responsive grid of raised cards with azure icon badges, bold headings, and explanatory copy. All 5 active cards are displayed.")

    why_rows = [
        ["Section Heading (H2)", "home:why.title", en_home["why"]["title"], fr_home["why"]["title"], "H2 Heading"],
        ["Pillar 1: Pricing (Coins icon)", "home:why.items.prices", f"{en_home['why']['items']['prices']['title']}: {en_home['why']['items']['prices']['text']}", f"{fr_home['why']['items']['prices']['title']} : {fr_home['why']['items']['prices']['text']}", "Card 1 (needsPrices: true)"],
        ["Pillar 2: Data in Africa (MapPin icon)", "home:why.items.africa", f"{en_home['why']['items']['africa']['title']}: {en_home['why']['items']['africa']['text']}", f"{fr_home['why']['items']['africa']['title']} : {fr_home['why']['items']['africa']['text']}", "Card 2 (Local Cloud)"],
        ["Pillar 3: Sector Configuration (Sliders icon)", "home:why.items.configured", f"{en_home['why']['items']['configured']['title']}: {en_home['why']['items']['configured']['text']}", f"{fr_home['why']['items']['configured']['title']} : {fr_home['why']['items']['configured']['text']}", "Card 3 (Sector Engine)"],
        ["Pillar 4: Clear Path (Route icon)", "home:why.items.path", f"{en_home['why']['items']['path']['title']}: {en_home['why']['items']['path']['text']}", f"{fr_home['why']['items']['path']['title']} : {fr_home['why']['items']['path']['text']}", "Card 4 (Clear Offers)"],
        ["Pillar 5: Local Proximity (Handshake icon)", "home:why.items.proximity", f"{en_home['why']['items']['proximity']['title']}: {en_home['why']['items']['proximity']['text']}", f"{fr_home['why']['items']['proximity']['title']} : {fr_home['why']['items']['proximity']['text']}", "Card 5 (Publisher Proximity)"],
        ["Pillar Standby: Local Payment (Coins icon)", "home:why.items.payment", f"{en_home['why']['items']['payment']['title']}: {en_home['why']['items']['payment']['text']}", f"{fr_home['why']['items']['payment']['title']} : {fr_home['why']['items']['payment']['text']}", "Locale standby item"]
    ]
    add_bilingual_table(doc, ["Pillar Element", "Token Key", "English Content", "French Content", "Display Role"], why_rows, [1.4, 1.2, 2.2, 2.2, 1.0])

    add_heading_2(doc, "Detailed Card Breakdown - Why NELIAS")
    for key in ["prices", "africa", "configured", "path", "proximity"]:
        add_meta_item(
            doc,
            f"Card [{key}] Title",
            en_home["why"]["items"][key]["title"],
            fr_home["why"]["items"][key]["title"],
            element_type="Card h3.font-display"
        )
        add_meta_item(
            doc,
            f"Card [{key}] Body",
            en_home["why"]["items"][key]["text"],
            fr_home["why"]["items"][key]["text"],
            element_type="Card p.text-fg-muted"
        )

    # =========================================================================
    # SECTION 5: OUR ANSWER (ADAPTIVE PLATFORM & FOUNDATION)
    # =========================================================================
    add_heading_1(doc, "5. Section 3: Our Answer: A Platform That Adapts to You (AnswerSection.jsx)")

    p_ans_desc = doc.add_paragraph()
    p_ans_desc.paragraph_format.space_after = Pt(4)
    p_ans_desc.add_run("Component: ").bold = True
    p_ans_desc.add_run("src/sections/about/AnswerSection.jsx (tone='default')\n").font.color.rgb = AZURE
    p_ans_desc.add_run("Layout Structure: Multi-part architectural presentation:\n")
    p_ans_desc.add_run("• Row 1: Left column (7 cols) has 3 in-depth paragraphs defining the BMP concept, the Sector Engine, and operational flexibility. Right column (5 cols) renders the interactive SVG FoundationIllustration showing the core foundation feeding tailored industry environments.\n")
    p_ans_desc.add_run("• Row 2: Editorial accent PullStatement presenting the core philosophy, followed by a bold 3-line headline display (Triad) celebrating the unifying architecture.")

    answer_rows = [
        ["Section Heading (H2)", "about:answer.title", en_about["answer"]["title"], fr_about["answer"]["title"], "H2 Heading"],
        ["Paragraph 1 (BMP Definition)", "about:answer.p1", en_about["answer"]["p1"], fr_about["answer"]["p1"], "Lead Body Text (7 cols)"],
        ["Paragraph 2 (Sector Engine)", "about:answer.p2", en_about["answer"]["p2"], fr_about["answer"]["p2"], "Lead Body Text (7 cols)"],
        ["Paragraph 3 (Flexibility)", "about:answer.p3", en_about["answer"]["p3"], fr_about["answer"]["p3"], "Lead Body Text (7 cols)"],
        ["Visual Illustration", "FoundationIllustration.jsx", "SVG architectural model: Central platform core connected to 4 tailored environment layouts (Retail, Healthcare, Professional Services, Multi-company Group)", "Schéma architectural SVG : Base centrale connectée à 4 environnements modulaires", "Visual Component (5 cols)"],
        ["Philosophy Pull Quote", "about:answer.philosophy", en_about["answer"]["philosophy"], fr_about["answer"]["philosophy"], "PullStatement (variant='accent')"],
        ["Triad Line 1", "about:answer.triad[0]", en_about["answer"]["triad"][0], fr_about["answer"]["triad"][0], "Display Heading (h1-size)"],
        ["Triad Line 2", "about:answer.triad[1]", en_about["answer"]["triad"][1], fr_about["answer"]["triad"][1], "Display Heading (h1-size)"],
        ["Triad Line 3", "about:answer.triad[2]", en_about["answer"]["triad"][2], fr_about["answer"]["triad"][2], "Display Heading (h1-size)"]
    ]
    add_bilingual_table(doc, ["Element", "Token Key", "English Text", "French Text", "Component & Placement"], answer_rows, [1.3, 1.2, 2.2, 2.2, 1.1])

    add_heading_2(doc, "Verbatim Text Blocks - Our Answer")
    add_meta_item(doc, "H2 Section Title", en_about["answer"]["title"], fr_about["answer"]["title"], element_type="H2 heading")
    add_meta_item(doc, "Paragraph 1 (BMP Definition)", en_about["answer"]["p1"], fr_about["answer"]["p1"], element_type="p.text-lead")
    add_meta_item(doc, "Paragraph 2 (Sector Engine)", en_about["answer"]["p2"], fr_about["answer"]["p2"], element_type="p.text-lead")
    add_meta_item(doc, "Paragraph 3 (Flexibility vs Monolith)", en_about["answer"]["p3"], fr_about["answer"]["p3"], element_type="p.text-lead")
    add_meta_item(doc, "Philosophy Statement", en_about["answer"]["philosophy"], fr_about["answer"]["philosophy"], element_type="PullStatement variant='accent'")
    add_meta_item(doc, "Triad Pillar 1", en_about["answer"]["triad"][0], fr_about["answer"]["triad"][0], element_type="Display text-h1")
    add_meta_item(doc, "Triad Pillar 2", en_about["answer"]["triad"][1], fr_about["answer"]["triad"][1], element_type="Display text-h1")
    add_meta_item(doc, "Triad Pillar 3", en_about["answer"]["triad"][2], fr_about["answer"]["triad"][2], element_type="Display text-h1")

    # =========================================================================
    # SECTION 6: OUR MISSION
    # =========================================================================
    add_heading_1(doc, "6. Section 4: Our Mission (MissionSection.jsx)")

    p_mis_desc = doc.add_paragraph()
    p_mis_desc.paragraph_format.space_after = Pt(4)
    p_mis_desc.add_run("Component: ").bold = True
    p_mis_desc.add_run("src/sections/about/MissionSection.jsx\n").font.color.rgb = AZURE
    p_mis_desc.add_run("Visual Theme: Deep inverse navy styling (tone='inverse', bg-surface-inverse #0F172A). Sets a dramatic, prestigious tone with high-contrast white text.\n")
    p_mis_desc.add_run("Layout Structure: Subdued H2/H3 eyebrow title, massive H1-sized Mission Statement, followed by a 3-column grid of top-bordered pillar statements.")

    mission_rows = [
        ["Section Heading (H2/H3)", "about:mission.title", en_about["mission"]["title"], fr_about["mission"]["title"], "Eyebrow Section Heading (tone='inverse')"],
        ["Mission Statement", "about:mission.statement", en_about["mission"]["statement"], fr_about["mission"]["statement"], "Hero Display Heading (text-h1, font-semibold)"],
        ["Mission Pillar 1", "about:mission.p1", en_about["mission"]["p1"], fr_about["mission"]["p1"], "Column 1 (border-t border-white/20)"],
        ["Mission Pillar 2", "about:mission.p2", en_about["mission"]["p2"], fr_about["mission"]["p2"], "Column 2 (border-t border-white/20)"],
        ["Mission Pillar 3", "about:mission.p3", en_about["mission"]["p3"], fr_about["mission"]["p3"], "Column 3 (border-t border-white/20)"]
    ]
    add_bilingual_table(doc, ["Element", "Token Key", "English Text", "French Text", "Component & Style"], mission_rows, [1.3, 1.2, 2.2, 2.2, 1.1])

    add_heading_2(doc, "Verbatim Text Blocks - Our Mission")
    add_meta_item(doc, "Section Eyebrow Heading", en_about["mission"]["title"], fr_about["mission"]["title"], element_type="H2 tone='inverse'")
    add_meta_item(doc, "Central Mission Statement", en_about["mission"]["statement"], fr_about["mission"]["statement"], element_type="p.text-h1.text-fg-inverse")
    add_meta_item(doc, "Pillar 1 (Accessible & Aligned)", en_about["mission"]["p1"], fr_about["mission"]["p1"], element_type="p.border-t.text-fg-inverse-muted")
    add_meta_item(doc, "Pillar 2 (Coherent Operations)", en_about["mission"]["p2"], fr_about["mission"]["p2"], element_type="p.border-t.text-fg-inverse-muted")
    add_meta_item(doc, "Pillar 3 (Driver of Freedom)", en_about["mission"]["p3"], fr_about["mission"]["p3"], element_type="p.border-t.text-fg-inverse-muted")

    # =========================================================================
    # SECTION 7: OUR VISION
    # =========================================================================
    add_heading_1(doc, "7. Section 5: Our Vision (VisionSection.jsx)")

    p_vis_desc = doc.add_paragraph()
    p_vis_desc.paragraph_format.space_after = Pt(4)
    p_vis_desc.add_run("Component: ").bold = True
    p_vis_desc.add_run("src/sections/about/VisionSection.jsx\n").font.color.rgb = AZURE
    p_vis_desc.add_run("Layout Structure: Two-column grid (lg:grid-cols-12, gap-14). Left column (col-span-7) contains the Vision title, a prominent vision statement, three narrative paragraphs highlighting the African roots and global ambition, and an editorial ribbon pull statement. Right column (col-span-5) features the VisionRipple illustration.")

    vision_rows = [
        ["Section Heading (H2)", "about:vision.title", en_about["vision"]["title"], fr_about["vision"]["title"], "H2 Heading"],
        ["Vision Statement", "about:vision.statement", en_about["vision"]["statement"], fr_about["vision"]["statement"], "PullStatement (variant='plain', size='md')"],
        ["Narrative Paragraph 1", "about:vision.p1", en_about["vision"]["p1"], fr_about["vision"]["p1"], "Lead Body Text (Côte d'Ivoire roots)"],
        ["Narrative Paragraph 2", "about:vision.p2", en_about["vision"]["p2"], fr_about["vision"]["p2"], "Lead Body Text (African entrepreneurial potential)"],
        ["Narrative Paragraph 3", "about:vision.p3", en_about["vision"]["p3"], fr_about["vision"]["p3"], "Lead Body Text (Cross-border momentum)"],
        ["Ribbon Pull Statement", "about:vision.pull", en_about["vision"]["pull"], fr_about["vision"]["pull"], "PullStatement (variant='ribbon', brand ribbon bar)"],
        ["Visual Illustration", "VisionRipple.jsx", "Concentric ripple circles expanding from Abidjan, Côte d'Ivoire with a sweeping tri-color flame/sun ribbon arc", "Ondes concentriques partant de Côte d'Ivoire avec arc de ruban tricolore", "SVG Illustration Component (5 cols)"]
    ]
    add_bilingual_table(doc, ["Element", "Token Key", "English Text", "French Text", "Component & Style"], vision_rows, [1.3, 1.2, 2.2, 2.2, 1.1])

    add_heading_2(doc, "Verbatim Text Blocks - Our Vision")
    add_meta_item(doc, "H2 Section Title", en_about["vision"]["title"], fr_about["vision"]["title"], element_type="H2 heading")
    add_meta_item(doc, "Central Vision Statement", en_about["vision"]["statement"], fr_about["vision"]["statement"], element_type="PullStatement variant='plain'")
    add_meta_item(doc, "Paragraph 1 (Roots & Standards)", en_about["vision"]["p1"], fr_about["vision"]["p1"], element_type="p.text-lead")
    add_meta_item(doc, "Paragraph 2 (Entrepreneurial Spirit)", en_about["vision"]["p2"], fr_about["vision"]["p2"], element_type="p.text-lead")
    add_meta_item(doc, "Paragraph 3 (Cross-Border Growth)", en_about["vision"]["p3"], fr_about["vision"]["p3"], element_type="p.text-lead")
    add_meta_item(doc, "Ribbon Pull Quote", en_about["vision"]["pull"], fr_about["vision"]["pull"], element_type="PullStatement variant='ribbon'")

    # =========================================================================
    # SECTION 8: ABOUT CLOSING & CALL TO ACTION
    # =========================================================================
    add_heading_1(doc, "8. Section 6: About Closing & Call to Action (AboutClosing.jsx)")

    p_close_desc = doc.add_paragraph()
    p_close_desc.paragraph_format.space_after = Pt(4)
    p_close_desc.add_run("Component: ").bold = True
    p_close_desc.add_run("src/sections/about/AboutClosing.jsx (tone='tint', spacing='lg')\n").font.color.rgb = AZURE
    p_close_desc.add_run("Layout Structure: Warm tint container with the final brand signature quote and a prominent primary CTA button routing to the contact page.")

    closing_rows = [
        ["Section ARIA Label", "about:closing.ariaLabel", en_about["closing"]["ariaLabel"], fr_about["closing"]["ariaLabel"], "Accessibility label"],
        ["Brand Signature Quote", "about:closing.signature", en_about["closing"]["signature"], fr_about["closing"]["signature"], "Headline Quote (text-h2, font-semibold)"],
        ["Primary CTA Button", "common:cta.contactNeliasTeam", en_common["cta"]["contactNeliasTeam"], fr_common["cta"]["contactNeliasTeam"], "Button (variant='primary', size='lg')"],
        ["Button Route Target", "Link to='/contact'", "/contact", "/contact", "Target Page Route"],
        ["Analytics Tracking Event", "track(EVENTS.CTA_CLICK)", "intent: 'contact', location: 'about-final'", "intent: 'contact', location: 'about-final'", "Event Payload"]
    ]
    add_bilingual_table(doc, ["Element", "Token Key", "English Text", "French Text", "Component & Role"], closing_rows, [1.4, 1.4, 2.1, 2.1, 1.0])

    add_heading_2(doc, "Verbatim Text Blocks - Closing & CTA")
    add_meta_item(doc, "Closing Signature", en_about["closing"]["signature"], fr_about["closing"]["signature"], element_type="p.text-h2.font-semibold")
    add_meta_item(doc, "Primary Action Button", en_common["cta"]["contactNeliasTeam"], fr_common["cta"]["contactNeliasTeam"], element_type="Button (Link to='/contact')", link_url="/contact")

    # =========================================================================
    # SECTION 9: GLOBAL LAYOUT, NAVIGATION & FOOTER CONTEXT
    # =========================================================================
    add_heading_1(doc, "9. Surrounding Page Frame & Global Layout Context")

    p_frame_desc = doc.add_paragraph()
    p_frame_desc.paragraph_format.space_after = Pt(4)
    p_frame_desc.add_run("The About page is rendered inside the application root layout (").font.color.rgb = INK
    p_frame_desc.add_run("src/app/RootLayout.jsx").bold = True
    p_frame_desc.add_run(") and surrounded by persistent navigational chrome:")

    nav_rows = [
        ["Global Announcement Bar", "Commercial launch announcement banner", "NELIAS BMP is under active commercial launch preparation. Published specifications, pricing models, and service terms are subject to final validation prior to formal order processing.", "La plateforme NELIAS BMP est en phase active de préparation de lancement commercial. Les spécifications, modèles tarifaires et conditions de service sont soumis à validation finale."],
        ["Header Phone Contact", "Top utility contact", "+225 27 22 24 36 00", "+225 27 22 24 36 00"],
        ["Header Email Contact", "Top utility contact", "contact@debass.net", "contact@debass.net"],
        ["Header WhatsApp Contact", "Top utility contact", "+225 07 00 00 00 00", "+225 07 00 00 00 00"],
        ["Header Nav: Features", "Header link", en_common["nav"]["features"], fr_common["nav"]["features"]],
        ["Header Nav: Industries", "Header link", en_common["nav"]["industries"], fr_common["nav"]["industries"]],
        ["Header Nav: Pricing", "Header link", en_common["nav"]["pricing"], fr_common["nav"]["pricing"]],
        ["Header Nav: About Us", "Header link (ACTIVE)", en_common["nav"]["about"], fr_common["nav"]["about"]],
        ["Header Nav: Contact", "Header link", en_common["nav"]["contact"], fr_common["nav"]["contact"]],
        ["Header Primary CTA", "Header button", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"]],
        ["Sticky Mobile CTA Bar", "Bottom mobile bar", en_common["cta"]["bookDemo"], fr_common["cta"]["bookDemo"]],
        ["Footer Brand Tagline", "Footer brand block", "Your business is unique. Your management platform should be too.", "Votre entreprise est unique. Votre plateforme de gestion devrait l’être aussi."],
        ["Footer Publisher Address", "Footer address block", "Debass Technologies - Abidjan Cocody, Côte d’Ivoire", "Debass Technologies - Abidjan Cocody, Côte d’Ivoire"],
        ["Footer Copyright Line", "Footer bottom line", f"© {en_common['footer'].get('copyright', '2026 Debass Technologies. All rights reserved.')}", f"© {fr_common['footer'].get('copyright', '2026 Debass Technologies. Tous droits réservés.')}"]
    ]
    add_bilingual_table(doc, ["Chrome Element", "Placement", "English Verbatim", "French Verbatim"], nav_rows, [1.5, 1.4, 2.1, 2.0])

    # =========================================================================
    # SECTION 10: EDITORIAL, IMPLEMENTATION & GOVERNANCE NOTES
    # =========================================================================
    add_heading_1(doc, "10. Editorial Implementation & Governance Notes (Source Code Comments)")

    p_gov_desc = doc.add_paragraph()
    p_gov_desc.paragraph_format.space_after = Pt(4)
    p_gov_desc.add_run("The following governance and editorial comments exist directly in the source code files for the About page, providing vital context on copy origins, pending client approvals, and legal consistency:")

    gov_rows = [
        ["src/pages/AboutPage.jsx", "Copy Source Governance", "TODO(Debass): the About copy comes from NELIAS_About_Us_For_Rahul_EN.docx and replaces the earlier PDF Section 9 text (headline 'Built from African business realities. Designed for broader ambition.', the Abidjan description and the one-sentence vision). Confirm."],
        ["src/sections/home/WhySection.jsx", "Hosting Legal Consistency", "TODO(Debass): 'Data in Africa / hosting available in Côte d’Ivoire' must stay consistent with the published legal documents (Terms of Use article 10, DPA article 6, Privacy Policy article 5: main hosting with Hodi in Grand-Bassam, recovery site in Johannesburg)."],
        ["src/sections/about/AnswerSection.jsx", "French Localization Review", "TODO(Debass): French is an AI-drafted translation pending native review ('scalable' is rendered 'évolutive')."],
        ["src/sections/about/VisionSection.jsx", "Claim Substantiation", "TODO(Debass): the vision statement says 'a leading business management platform'. It is a vision statement kept as approved; confirm it may be published (the publishing rules ask for evidence behind claims)."],
        ["src/sections/about/AboutClosing.jsx", "Closing Action Alignment", "TODO(Debass): the About document has no closing action; the approved button from the earlier PDF (Section 9) is used."],
        ["src/sections/about/AboutClosing.jsx", "Tagline Phrasing Alignment", "TODO(Debass): the closing signature reads '…Your environment, automatically.' while the brand promise reads '…automatically configured.' Kept exactly as in the document; confirm which one is intended."]
    ]
    add_bilingual_table(doc, ["Source File", "Governance Topic", "Exact Verbatim Developer/Editorial Note"], gov_rows, [1.8, 1.6, 3.6])

    # Final document save
    out_dir = os.path.join(base_dir, "content_doc")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "about_us_page_Content.docx")
    doc.save(out_path)
    print(f"Document successfully created at: {out_path}")
    print(f"File size: {os.path.getsize(out_path)} bytes")

if __name__ == "__main__":
    main()
