from app.rag.pipeline import RAGPipeline


def main():
    print("Starting Tax RAG chatbot...")

    rag = RAGPipeline()

    print("\nTax RAG chatbot is ready.")
    print("Type 'exit' to quit.")

    while True:
        question = input("\nEnter your question: ")

        if question.lower() == "exit":
            print("Goodbye!")
            break

        answer = rag.ask(question)

        print("\nAnswer:")
        print(answer)


if __name__ == "__main__":
    main()