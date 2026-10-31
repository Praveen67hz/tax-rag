def build_rag_prompt(
        context: str, 
        question: str, 
        conversation: str = ""
) -> str:
    
    """
    Build the prompt used by the RAG pipeline.
    """

    return f"""
You are a helpful tax information assistant.

Answer the user's question using only the context provided below.

If the answer cannot be found in the context, say:
"I don't have enough information in the provided documents."

Context:
{context}

Previous conversation:
{conversation}

Current question:
{question}

Answer:
"""