from unstructured.chunking.title import chunk_by_title


def create_chunks_by_title(elements):
    """Create intelligent chunks using title-based strategy"""

    print("🔨 Started Creating smart chunks....")

    chunks = chunk_by_title(
        elements,
        max_characters=1500,
        new_after_n_chars=1200,
        combine_text_under_n_chars=200,
        multipage_sections=True
    )

    print(f"✅ Successfully Created {len(chunks)} chunks")

    return chunks