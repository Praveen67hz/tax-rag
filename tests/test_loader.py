from app.ingestion.loader import load_documents


def main():
    documents = load_documents()

    print(f"Loaded {len(documents)} documents\n")

    for document in documents:
        print("=" * 70)
        print(f"Filename: {document['filename']}")
        print(f"Characters: {len(document['text'])}")
        print("Preview:")
        print(document["text"][:500])
        print()


if __name__ == "__main__":
    main()