import os

from dotenv import load_dotenv


load_dotenv()


MONGODB_URI = os.getenv("MONGODB_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DATABASE_NAME = "tax_rag"
COLLECTION_NAME = "documents"

VECTOR_INDEX_NAME = "vector_index"

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
GEMINI_MODEL_NAME = "gemini-3.5-flash-lite"