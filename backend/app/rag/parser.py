from pathlib import Path

from app.rag.partition import partition_pdf_document
# Later we'll add:
# from app.rag.partition import partition_docx_document


def parse_document(file_path: str, strategy: str = "fast"):
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        print(f"[PARSER] Parsing PDF with strategy='{strategy}'")
        return partition_pdf_document(file_path, strategy=strategy)

    elif extension == ".docx":
        raise NotImplementedError("DOCX parsing not implemented yet")

    else:
        raise ValueError(f"Unsupported file type: {extension}")