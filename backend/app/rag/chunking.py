from langchain_text_splitters import RecursiveCharacterTextSplitter
from unstructured.chunking.title import chunk_by_title


def create_chunks_by_title(elements, chunk_size=1000, chunk_overlap=200):
    """
    Create intelligent section-aware chunks.
    - Chunk Size: 800 - 1200 characters (default 1000)
    - Chunk Overlap: 150 - 250 characters (default 200)
    - Preserves logical sections (Education, Experience, Projects, Skills, Certificates)
    """

    print(f"🔨 Creating section-aware chunks (chunk_size={chunk_size}, chunk_overlap={chunk_overlap})...")

    try:
        chunks = chunk_by_title(
            elements,
            max_characters=chunk_size,
            new_after_n_chars=int(chunk_size * 0.8),
            combine_text_under_n_chars=250,
            multipage_sections=True,
            overlap=chunk_overlap,
            overlap_all=True
        )
        if chunks and len(chunks) > 0:
            print(f"✅ Successfully Created {len(chunks)} title-aware chunks")
            return chunks
    except Exception as e:
        print(f"⚠️ Title-based chunking fallback to RecursiveCharacterTextSplitter: {e}")

    # Fallback to section-preserving RecursiveCharacterTextSplitter
    text_content = "\n\n".join([str(getattr(el, "text", el)) for el in elements if getattr(el, "text", str(el)).strip()])

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=[
            "\n\nEducation", "\n\nEXPERIENCE", "\n\nProjects", "\n\nSkills", "\n\nCertificates",
            "\n\n# ", "\n\n## ", "\n\n### ", "\n\n", "\n", " ", ""
        ]
    )

    chunks = splitter.split_text(text_content)
    print(f"✅ Successfully Created {len(chunks)} recursive section chunks")
    return chunks