
from app.database.mongodb import get_mongodb_collection
from app.ingestion.chunker import chunk_documents
from app.ingestion.embedder import Embedder
from app.ingestion.loader import load_documents


def main():
    # 1. Load documents
    documents = load_documents()

    print(f"Loaded {len(documents)} documents.")

    # 2. Split documents into chunks
    chunks = chunk_documents(documents)

    print(f"Created {len(chunks)} chunks.")

    # 3. Create embeddings
    embedder = Embedder()

    texts = [chunk["text"] for chunk in chunks]

    embeddings = embedder.embed_documents(texts)

    print(f"Created {len(embeddings)} embeddings.")

    # 4. Connect to MongoDB
    collection = get_mongodb_collection()

    # 5. Remove previous chunks
    collection.delete_many({})

    print("Removed existing documents from MongoDB.")

    # 6. Prepare MongoDB documents
    mongo_documents = []

    for chunk, embedding in zip(chunks, embeddings):
        mongo_documents.append({
            "filename": chunk["filename"],
            "file_type": chunk["file_type"],
            "page_number": chunk["page_number"],
            "chunk_index": chunk["chunk_index"],
            "text": chunk["text"],
            "embedding": embedding
        })

    # 7. Insert fresh documents
    result = collection.insert_many(mongo_documents)

    print(f"Inserted {len(result.inserted_ids)} documents into MongoDB.")


if __name__ == "__main__":
    main()