import re
from unstructured.partition.pdf import partition_pdf


def is_noise_element(element) -> bool:
    """Identify and filter out Header, Footer, Table of Contents, and TOC dot-leader entries."""
    element_type = getattr(element, "category", type(element).__name__)

    # Filter out explicit Unstructured noise categories
    if element_type in ["Header", "Footer", "TableOfContents"]:
        return True

    text = getattr(element, "text", "").strip()
    if not text:
        return True

    text_lower = text.lower()

    # Filter out explicit "Table of Contents" title or headers
    if text_lower in ["table of contents", "contents", "index"]:
        return True

    # Filter out TOC entries with dot leaders (e.g., "1. Introduction ........ 4" or "Payment Methods ...... 12")
    if re.search(r"\.{2,}\s*\d+$", text):
        return True

    # Filter out entries ending with trailing dot lines or page numbers formatted as TOC lines
    if re.search(r"^\s*(\d+(\.\d+)*|[A-Z])\s+.*\.{2,}\s*\d+$", text):
        return True

    return False


def partition_pdf_document(file_path: str):

    print("=" * 50)
    print("📄 PARTITION STARTED")
    print(f"File Path: {file_path}")

    raw_elements = partition_pdf(
        filename=file_path,
        strategy="hi_res",
        infer_table_structure=True,
        extract_image_block_types=["Image"],
        extract_image_block_to_payload=True
    )

    print(f"✅ Raw Elements Extracted: {len(raw_elements)}")

    filtered_elements = [el for el in raw_elements if not is_noise_element(el)]

    print(f"🧹 Elements After Noise & TOC Filtering: {len(filtered_elements)}")
    print("=" * 50)

    return filtered_elements