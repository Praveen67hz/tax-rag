
from app.config.settings import VECTOR_INDEX_NAME


def search_similar_documents(
    collection,
    query_embedding: list[float],
    num_candidates: int = 20,
    limit: int = 3
) -> list[dict]:
    """
    Search MongoDB Atlas Vector Search for documents
    similar to the user's query.
    """

    pipeline = [
        {
            "$vectorSearch": {
                "index": VECTOR_INDEX_NAME,
                "path": "embedding",
                "queryVector": query_embedding,
                "numCandidates": num_candidates,
                "limit": limit
            }
        },
        {
            "$project": {
                "_id": 0,
                "filename": 1,
                "chunk_index": 1,
                "text": 1,
                "score": {
                    "$meta": "vectorSearchScore"
                }
            }
        }
    ]

    results = collection.aggregate(pipeline)

    return list(results)