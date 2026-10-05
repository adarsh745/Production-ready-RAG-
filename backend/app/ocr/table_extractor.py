import re
from typing import Tuple
from PIL import Image
from pydantic import BaseModel, Field
import json
from app.utils.llm_utils import get_llm


class TableExtractionResult(BaseModel):
    has_tables: bool = Field(
        ...,
        description="True if tabular data/tables were detected in the raw text, False otherwise."
    )
    table_count: int = Field(
        default=0,
        description="Number of distinct tables detected."
    )
    formatted_text: str = Field(
        ...,
        description="Full page text with all detected tables converted into clean Markdown tables and merged with normal text paragraphs."
    )


def extract_and_format_tables(image: Image.Image, raw_ocr_text: str, page_num: int) -> Tuple[str, int]:
    """
    Detects tabular structures in raw OCR output.
    Converts detected tables into structured Markdown tables (| Col1 | Col2 |),
    preserving exact row-column relationships and merging them with normal text paragraphs.
    
    Fallback: Returns raw_ocr_text if no tables exist or if table extraction encounters an issue.
    """
    if not raw_ocr_text or len(raw_ocr_text.strip()) < 10:
        return raw_ocr_text, 0

    # Quick heuristic check for potential table markers (multiple columns, numbers, grades, delimiters)
    lines = [line.strip() for line in raw_ocr_text.split("\n") if line.strip()]
    multi_column_lines = [line for line in lines if len(re.split(r'\s{2,}|\t|\|', line)) >= 2]

    # If fewer than 2 multi-column lines, unlikely to be a table
    if len(multi_column_lines) < 2:
        return raw_ocr_text, 0

    prompt = f"""
You are an expert OCR table extractor and document layout analyzer.

Analyze the following raw OCR text extracted from Page {page_num} of a scanned document.

Raw OCR Text:
{raw_ocr_text}

Task Instructions:
1. Detect if any tables, mark sheets, grade sheets, invoices, or multi-column tabular data exist in this OCR text.
2. If tables are detected:
   - Reconstruct the exact row-column relationships.
   - Convert every table into a clean, valid Markdown table with proper column headers and rows (`| Header1 | Header2 |` format).
   - Ensure values (e.g. Grades, Marks, Credits, Results) are strictly aligned under their corresponding column headers.
   - Preserve non-table text paragraphs before or after the table.
3. If no tables exist, return the original text formatted cleanly.

Return structured output:
- has_tables: boolean
- table_count: integer
- formatted_text: complete page text with Markdown tables embedded.
"""

    try:
        llm = get_llm()
        try:
            structured_llm = llm.with_structured_output(TableExtractionResult)
            result = structured_llm.invoke(prompt)
            has_tables = result.has_tables
            table_count = result.table_count
            formatted_text = result.formatted_text
        except Exception:
            raw_resp = llm.invoke(prompt)
            raw_text = raw_resp.content if hasattr(raw_resp, 'content') else str(raw_resp)
            if "```" in raw_text:
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
            data = json.loads(raw_text.strip())
            has_tables = data.get("has_tables", False)
            table_count = data.get("table_count", 0)
            formatted_text = data.get("formatted_text", raw_ocr_text)

        if has_tables and table_count > 0:
            print(f"  • Tables detected: {table_count}")
            print(f"  • Converted table to Markdown")
            print(f"  • Merged OCR paragraphs")
            return formatted_text.strip(), table_count
        else:
            return raw_ocr_text, 0

    except Exception as e:
        print(f"⚠️ Table extraction notice on Page {page_num}: {e}. Falling back to raw OCR text.")
        return raw_ocr_text, 0
