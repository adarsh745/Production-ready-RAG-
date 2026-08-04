from typing import List, Dict, Any
from PIL import Image
import pytesseract
from app.ocr.pdf_to_images import convert_pdf_to_images
from app.ocr.table_extractor import extract_and_format_tables


def run_ocr_on_image(image: Image.Image, page_num: int) -> str:
    """
    Run OCR on a single page image using PyTesseract with automatic fallback error handling.
    """
    try:
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"⚠️ OCR processing note on Page {page_num}: {e}")
        return ""


def process_scanned_pdf(file_path: str) -> List[Dict[str, Any]]:
    """
    Full OCR pipeline for scanned PDFs:
    1. Convert PDF pages to high-resolution images.
    2. Run OCR on page images.
    3. Detect & convert tables to Markdown tables.
    4. Return extracted page text objects compatible with downstream RAG parser.
    """
    print("\n" + "=" * 80)
    print("⚡ RUNNING AUTOMATIC OCR ENGINE FOR SCANNED PDF")
    print("=" * 80)

    # Step 1: Convert pages to images
    page_images = convert_pdf_to_images(file_path)
    if not page_images:
        print("❌ OCR Failed: Could not convert PDF pages to images.")
        return []

    print("🤖 Running OCR...")
    extracted_pages = []
    total_tables_found = 0

    # Step 2: Run OCR and Table Extraction per page image
    for page_num, image in page_images:
        print(f"  • Processing Page {page_num}...")
        raw_text = run_ocr_on_image(image, page_num)

        # Detect and extract structured Markdown tables
        formatted_text, table_count = extract_and_format_tables(image, raw_text, page_num)
        total_tables_found += table_count

        page_data = {
            "page_number": page_num,
            "text": formatted_text if formatted_text else f"[Scanned Page {page_num} Text]",
            "tables": [],
            "images": [],
            "table_count": table_count,
        }
        extracted_pages.append(page_data)

    print("🎉 OCR Completed")
    print(f"📊 Total OCR Pages: {len(extracted_pages)}")
    print(f"📊 Total Tables Detected: {total_tables_found}")
    print("=" * 80)

    return extracted_pages
