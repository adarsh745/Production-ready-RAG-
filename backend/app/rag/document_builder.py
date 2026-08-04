from langchain_core.documents import Document


def build_document(
    document_id,
    page_content,
    raw_text,
    tables,
    images,
    filename,
    page_number,
    chunk_id,
):
    """
    Build a LangChain Document with metadata including document_id.
    """

    return Document(
        page_content=page_content,
        metadata={
            "document_id": str(document_id),
            "filename": str(filename),
            "page": int(page_number) if str(page_number).isdigit() else page_number,
            "chunk_id": int(chunk_id),
            "has_tables": len(tables) > 0,
            "has_images": len(images) > 0,
        },
    )
