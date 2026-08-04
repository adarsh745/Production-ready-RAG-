import re
from typing import List, Optional, Set
from langchain_core.documents import Document
from rank_bm25 import BM25Okapi


def tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase words for BM25 indexing and query matching."""
    if not text:
        return []
    return re.findall(r"\w+", text.lower())


class BM25IndexManager:
    """
    In-memory BM25 index manager.
    Builds the BM25 index ONCE and retains it in memory.
    Refreshes only when documents are uploaded, deleted, or updated.
    """

    def __init__(self):
        self.bm25: Optional[BM25Okapi] = None
        self.documents: List[Document] = []
        self.is_initialized: bool = False

    def build_index(self, documents: List[Document]):
        """
        Build (or rebuild) BM25 index from a list of LangChain Document objects.
        """
        if not documents:
            self.bm25 = None
            self.documents = []
            self.is_initialized = True
            print("⚠️ BM25 Index built with 0 documents.")
            return

        corpus = [tokenize(doc.page_content) for doc in documents]
        self.bm25 = BM25Okapi(corpus)
        self.documents = documents
        self.is_initialized = True
        print(f"✅ BM25 Index successfully built with {len(documents)} document chunks.")

    def search(
        self,
        query: str,
        top_k: int = 20,
        document_ids: Optional[List[str]] = None,
    ) -> List[Document]:
        """
        Search BM25 index for query.
        Filters candidates by document_ids if supplied.
        Returns top_k matching LangChain Document objects.
        """
        if not self.is_initialized or self.bm25 is None or not self.documents:
            return []

        query_tokens = tokenize(query)
        if not query_tokens:
            return []

        # Get raw BM25 scores for all documents in the corpus
        scores = self.bm25.get_scores(query_tokens)

        # Build filter set if document_ids supplied
        valid_doc_ids_set: Optional[Set[str]] = None
        if document_ids:
            valid_ids = [str(d).strip() for d in document_ids if d and str(d).strip()]
            if valid_ids:
                valid_doc_ids_set = set(valid_ids)

        indexed_scores = []
        for idx, (doc, score) in enumerate(zip(self.documents, scores)):
            if score <= 0:
                continue

            # Metadata filtering for BM25 search
            if valid_doc_ids_set is not None:
                doc_id = str(doc.metadata.get("document_id") or "").strip()
                if doc_id not in valid_doc_ids_set:
                    continue

            indexed_scores.append((score, doc))

        # Sort by score descending
        indexed_scores.sort(key=lambda x: x[0], reverse=True)

        return [doc for score, doc in indexed_scores[:top_k]]


bm25_manager = BM25IndexManager()
