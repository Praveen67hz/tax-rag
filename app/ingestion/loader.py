
from pathlib import Path

from pypdf import PdfReader


RAW_DATA_PATH = Path("data/raw")


def load_documents(documents_path: Path = RAW_DATA_PATH) -> list[dict]:
    """
    Load TXT and PDF documents while preserving PDF page information.
    """

    documents = []

    # Load TXT files
    for file in documents_path.glob("*.txt"):
        text = file.read_text(encoding="utf-8")

        documents.append({
            "filename": file.name,
            "file_type": "txt",
            "text": text,
            "pages": [
                {
                    "page_number": None,
                    "text": text
                }
            ]
        })

    # Load PDF files
    for file in documents_path.glob("*.pdf"):
        reader = PdfReader(file)

        pages = []

        for page_number, page in enumerate(reader.pages, start=1):
            page_text = page.extract_text()

            if page_text and page_text.strip():
                pages.append({
                    "page_number": page_number,
                    "text": page_text
                })

        # Keep combined text for compatibility with existing code
        text = "\n\n".join(
            page["text"] for page in pages
        )

        documents.append({
            "filename": file.name,
            "file_type": "pdf",
            "text": text,
            "pages": pages
        })

    return documents