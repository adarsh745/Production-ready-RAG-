from dotenv import load_dotenv
load_dotenv()

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", message=".*LangChainDeprecationWarning.*")

from langchain_community.embeddings import HuggingFaceEmbeddings

# Free local embedding model (runs on CPU/GPU without OpenAI API credits)
embedding_model = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2"
)


def get_embedding_model():
    """
    Return the local HuggingFace embedding model.
    """
    return embedding_model


