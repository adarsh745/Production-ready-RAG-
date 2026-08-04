# This is for embeddings the summary as a vecctor embbeddings for 
#the future use (similarity search)

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