import pypdf
from pathlib import Path


def is_scanned_pdf(file_path: str, min_chars_per_page: int = 30) -> bool:
    """
    Detects whether a PDF is scanned (lacks selectable text layer) or searchable.
    Returns True if the PDF is scanned / image-only, False if searchable text exists.
    """
    filename = Path(file_path).name
    print(f"\n📄 Document Uploaded: {filename}")
    print("🔍 Checking PDF Text Layer...")

    try:    
        reader = pypdf.PdfReader(file_path)
        total_pages = len(reader.pages)
        if total_pages == 0:
            print("📸 Scanned PDF Detected (0 pages found).")
            return True

        total_extracted_text = ""
        for page in reader.pages:
            text = page.extract_text() or ""
            total_extracted_text += text.strip()

        # Count alphanumeric characters extracted
        alphanumeric_count = sum(1 for char in total_extracted_text if char.isalnum())
        avg_chars_per_page = alphanumeric_count / total_pages

        if avg_chars_per_page >= min_chars_per_page:
            print(f"✅ Searchable PDF Detected ({alphanumeric_count} text characters across {total_pages} pages).")
            return False
        else:
            print(f"📸 Scanned PDF Detected ({alphanumeric_count} text characters across {total_pages} pages).")
            return True
    except Exception as e:
        print(f"⚠️ Error checking PDF text layer: {e}. Falling back to Scanned PDF OCR workflow.")
        return True
