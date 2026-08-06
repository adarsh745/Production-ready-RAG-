from dotenv import load_dotenv
load_dotenv()

from langchain_openai import OpenAIEmbeddings

# Create a single embedding model instance and reuse it
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-small"
)


def get_embedding_model():
    """
    Return the OpenAI embedding model.
    """
    return embedding_model


