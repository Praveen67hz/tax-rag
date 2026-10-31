
import uuid
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from app.rag.pipeline import RAGPipeline
from app.ingestion.loader import load_documents
from app.ingestion.chunker import chunk_documents


router = APIRouter()

# Initialize the RAG pipeline
rag_pipeline = RAGPipeline()

class ChatMessage(BaseModel):
    role: str
    text: str


class QuestionRequest(BaseModel):
    question: str
    messages: list[ChatMessage] = []


class AnswerResponse(BaseModel):
    question: str
    answer: str


@router.post("/ask", response_model=AnswerResponse)
def ask_question(request: QuestionRequest):

    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:
        answer = rag_pipeline.ask(
            question=request.question,
            messages=[message.model_dump() for message in request.messages]
        )

        return AnswerResponse(
            question=request.question,
            answer=answer
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while generating the answer."
        ) from error


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    allowed_extensions = {".pdf", ".txt"}
    max_file_size = 10 * 1024 * 1024  # 10 MB

    filename = Path(file.filename or "").name
    file_extension = Path(filename).suffix.lower()

    if not filename or file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported."
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    if len(file_content) > max_file_size:
        raise HTTPException(
            status_code=413,
            detail="File size must not exceed 10 MB."
        )

    temp_path = None

    try:
        upload_id = str(uuid.uuid4())

        upload_directory = Path("data/uploads")
        upload_directory.mkdir(parents=True, exist_ok=True)

        temp_path = upload_directory / f"{upload_id}{file_extension}"
        temp_path.write_bytes(file_content)

        # Load only the uploaded document
        documents = load_documents(
            documents_path=upload_directory
        )

        documents = [
            document
            for document in documents
            if document["filename"] == temp_path.name
        ]

        if not documents or not documents[0]["text"].strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the uploaded document."
            )

        document = documents[0]

        # Restore the original filename in metadata
        document["filename"] = filename

        # Generate document chunks
        chunks = chunk_documents(documents)

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No text chunks could be generated."
            )

        # Generate embeddings using the existing model
        texts = [chunk["text"] for chunk in chunks]

        embeddings = rag_pipeline.embedder.embed_documents(texts)

        # Prepare MongoDB records
        mongo_documents = []

        for chunk, embedding in zip(chunks, embeddings):
            mongo_documents.append({
                "document_id": upload_id,
                "filename": chunk["filename"],
                "file_type": chunk["file_type"],
                "page_number": chunk["page_number"],
                "chunk_index": chunk["chunk_index"],
                "text": chunk["text"],
                "embedding": embedding
            })

        # Insert without deleting existing documents
        result = rag_pipeline.collection.insert_many(
            mongo_documents
        )

        return {
            "message": "Document uploaded and processed successfully.",
            "document_id": upload_id,
            "filename": filename,
            "chunks_created": len(chunks),
            "chunks_inserted": len(result.inserted_ids)
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing the document."
        ) from error

    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink()

        await file.close()