
from app.database.mongodb import get_mongodb_collection
from app.ingestion.embedder import Embedder
from app.generation.gemini import GeminiGenerator
from app.rag.prompts import build_rag_prompt
from app.retrieval.vector_search import search_similar_documents


class RAGPipeline:
    def __init__(self):
        self.collection = get_mongodb_collection()
        self.embedder = Embedder()
        self.generator = GeminiGenerator()

    def get_neighboring_chunks(
        self,
        retrieved_chunks: list[dict],
        window: int = 1
    ) -> list[dict]:
        """
        Retrieve neighboring chunks around the vector search results.
        """

        expanded_chunks = {}

        for chunk in retrieved_chunks:
            filename = chunk["filename"]
            chunk_index = chunk["chunk_index"]

            start_index = max(0, chunk_index - window)
            end_index = chunk_index + window

            neighboring_chunks = self.collection.find(
                {
                    "filename": filename,
                    "chunk_index": {
                        "$gte": start_index,
                        "$lte": end_index
                    }
                },
                {
                    "_id": 0,
                    "filename": 1,
                    "chunk_index": 1,
                    "text": 1
                }
            )

            for neighbor in neighboring_chunks:
                key = (neighbor["filename"], neighbor["chunk_index"])
                expanded_chunks[key] = neighbor

        return sorted(
            expanded_chunks.values(),
            key=lambda chunk: (chunk["filename"], chunk["chunk_index"])
        )


    def format_conversation(self, messages: list[dict] | None) -> str:
        if not messages:
            return ""

        return "\n".join(
            f"{message['role'].capitalize()}: {message['text']}"
            for message in messages
        )

    def ask(self, question: str, messages: list[dict] | None = None) -> str:
        """
        Process a user question through the complete RAG pipeline.
        """

        # 1. Convert the question into an embedding
        question_embedding = self.embedder.embed_query(question)

        # 2. Retrieve relevant document chunks
        retrieved_chunks = search_similar_documents(
            collection=self.collection,
            query_embedding=question_embedding,
            num_candidates=20,
            limit=3
        )

        # 3. Expand retrieval using neighboring chunks
        expanded_chunks = self.get_neighboring_chunks(
            retrieved_chunks=retrieved_chunks,
            window=1
        )

        # 4. Build context from retrieved chunks
        context = "\n\n".join(
            chunk["text"]
            for chunk in expanded_chunks
        )

        # 5. Format previous conversation
        conversation = self.format_conversation(messages)

        # 6. Build the Gemini prompt
        prompt = build_rag_prompt(
            context=context,
            question=question,
            conversation=conversation
        )

        # 7. Generate the final answer
        answer = self.generator.generate(prompt)

        return answer