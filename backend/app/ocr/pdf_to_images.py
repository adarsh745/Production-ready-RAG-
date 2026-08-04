from typing import List, Tuple
from PIL import Image
import pypdfium2 as pdfium


def convert_pdf_to_images(file_path: str, scale: float = 2.0) -> List[Tuple[int, Image.Image]]:
    """
    Converts PDF pages into PIL Images using high-performance pypdfium2.
    Returns list of tuples: (page_number, PIL.Image).
    """
    print("🖼️ Converting Pages to Images...")
    page_images = []

    try:
        pdf = pdfium.PdfDocument(file_path)
        total_pages = len(pdf)

        for index in range(total_pages):
            page_num = index + 1
            page = pdf[index]
            # render page at scale 2.0 (high DPI for accurate OCR)
            image = page.render(scale=scale).to_pil()
            page_images.append((page_num, image))

        print(f"✅ Total Converted Pages: {len(page_images)}")
        return page_images
    except Exception as e:
        print(f"❌ Error converting PDF pages to images: {e}")
        return []
