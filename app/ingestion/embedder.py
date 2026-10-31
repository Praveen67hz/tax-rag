import os

from sentence_transformers import SentenceTransformer

from app.config.settings import EMBEDDING_MODEL_NAME


class Embedder:
    def __init__(self):
        hf_token = os.getenv("HF_TOKEN")

        self.model = SentenceTransformer(
            EMBEDDING_MODEL_NAME,
            token=hf_token
        )

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """
        Convert multiple text chunks into embeddings.
        """

        embeddings = self.model.encode(texts)

        return embeddings.tolist()

    def embed_query(self, text: str) -> list[float]:
        """
        Convert a single query into an embedding.
        """

        embedding = self.model.encode(text)

        return embedding.tolist()