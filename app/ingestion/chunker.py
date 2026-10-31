
from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_documents(
    documents: list[dict],
    chunk_size: int = 500,
    chunk_overlap: int = 50
) -> list[dict]:
    """
    Split documents into chunks while preserving metadata.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    chunks = []

    for document in documents:

        chunk_index = 0

        for page in document["pages"]:

            page_chunks = splitter.split_text(
                page["text"]
            )

            for chunk in page_chunks:

                chunks.append({
                    "filename": document["filename"],
                    "file_type": document["file_type"],
                    "page_number": page["page_number"],
                    "chunk_index": chunk_index,
                    "text": chunk
                })

                chunk_index += 1

    return chunks