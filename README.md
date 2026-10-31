# 🇮🇳 Tax RAG — AI-Powered Indian Tax Assistant

An AI-powered question-answering application built using **Retrieval-Augmented Generation (RAG)** to answer questions about Indian Income Tax and GST using a collection of reference documents.

The application retrieves relevant information from indexed documents using semantic search and generates context-aware answers with Google Gemini.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-Vector_Search-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</p>

---

## ✨ Features

- 🧠 **RAG-based Question Answering:** Retrieves relevant document chunks and uses them as context for generating answers.
- 🔍 **Semantic Search:** Uses Sentence Transformers and MongoDB Atlas Vector Search to find relevant information.
- 🎯 **Context-Grounded Responses:** Instructs the LLM to answer using retrieved documents rather than unsupported information.
- 💬 **Conversation Context:** Supports follow-up questions by passing previous chat messages to the LLM.
- 📄 **PDF and TXT Support:** Loads and processes PDF and text documents.
- 📤 **Document Upload:** Uploads PDF and TXT files through the API for processing and indexing.
- 🧩 **Neighbouring Chunk Retrieval:** Retrieves surrounding chunks to provide additional context.
- 🎨 **Interactive Chat Interface:** React-based frontend with Markdown message rendering and a recent-conversations sidebar.

## 🛠️ Tech Stack

### Backend

- 🐍 Python
- ⚡ FastAPI
- 🍃 MongoDB Atlas
- 🔎 MongoDB Atlas Vector Search
- 🤗 Sentence Transformers
- ✨ Google Gemini API
- 🔗 LangChain Text Splitters
- 📑 PyPDF
- 📦 uv

### Frontend

- ⚛️ React
- ⚡ Vite
- 🎨 Tailwind CSS
- 🖼️ Lucide React
- 📝 React Markdown

## 📂 Project Structure

    tax-rag/
    │
    ├── app/
    │   ├── api/
    │   │   └── routes.py
    │   ├── config/
    │   │   └── settings.py
    │   ├── database/
    │   │   └── mongodb.py
    │   ├── generation/
    │   │   └── gemini.py
    │   ├── ingestion/
    │   │   ├── chunker.py
    │   │   ├── embedder.py
    │   │   └── loader.py
    │   ├── rag/
    │   │   ├── pipeline.py
    │   │   └── prompts.py
    │   └── retrieval/
    │       └── vector_search.py
    │
    ├── data/
    │   └── raw/
    │
    ├── frontend/
    │   ├── public/
    │   └── src/
    │       ├── components/
    │       ├── services/
    │       ├── App.jsx
    │       └── index.css
    │
    ├── scripts/
    │   └── ingest.py
    │
    ├── tests/
    │
    ├── api.py
    ├── main.py
    ├── pyproject.toml
    ├── uv.lock
    └── .gitignore

## ⚙️ How It Works

The application follows a Retrieval-Augmented Generation pipeline:

1. **Document Loading:** Reads PDF and TXT files from the `data/raw/` directory.
2. **Text Chunking:** Splits document content into smaller chunks using Recursive Character Text Splitter.
3. **Embedding Generation:** Converts text chunks into vector embeddings using Sentence Transformers.
4. **Vector Storage:** Stores document text, metadata, and embeddings in MongoDB Atlas.
5. **Similarity Search:** Converts the user's question into an embedding and retrieves relevant chunks using MongoDB Atlas Vector Search.
6. **Context Expansion:** Retrieves neighbouring chunks from the same document to provide additional context.
7. **Answer Generation:** Sends retrieved context, conversation history, and the current question to Google Gemini.
8. **Response:** Returns the generated answer through FastAPI to the React frontend.

## 🔐 Configuration

Create a `.env` file in the project root:

    MONGODB_URI=your_mongodb_connection_string
    GEMINI_API_KEY=your_gemini_api_key
    HF_TOKEN=your_hugging_face_token

The Hugging Face token is optional if the embedding model can be downloaded without authentication.

### 🍃 MongoDB Configuration

The application currently uses:

| Configuration | Value |
|---|---|
| Database | `tax_rag` |
| Collection | `documents` |
| Vector Index | `vector_index` |
| Embedding Model | `sentence-transformers/all-MiniLM-L6-v2` |

Configure a MongoDB Atlas Vector Search index named `vector_index` on the `documents` collection, using the `embedding` field.

## 🚀 Installation and Setup

### Prerequisites

- Python 3.13
- uv
- Node.js and npm
- MongoDB Atlas account with Vector Search
- Google Gemini API key

### 1. 📥 Clone the Repository

    git clone https://github.com/Praveen67hz/tax-rag.git
    cd tax-rag

### 2. 🐍 Set Up the Backend

Install Python dependencies:

    uv sync

Configure the `.env` file with your credentials.

Start the FastAPI server:

    uv run uvicorn api:app --reload

**Backend URL:** http://127.0.0.1:8000

**API Documentation:** http://127.0.0.1:8000/docs

### 3. ⚛️ Set Up the Frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

**Frontend URL:** http://localhost:5173

Keep both the backend and frontend servers running while using the application.

## 🔌 API Endpoints

### 💬 POST `/ask`

Accepts a question and optional conversation history.

**Example request:**

    {
      "question": "What is input tax credit?",
      "messages": []
    }

**Example response:**

    {
      "question": "What is input tax credit?",
      "answer": "Generated answer based on retrieved document context."
    }

### 📤 POST `/upload`

Accepts PDF and TXT files through multipart form data.

The endpoint:

- Validates file type and size.
- Extracts document content.
- Splits content into chunks.
- Generates embeddings.
- Stores document chunks and metadata in MongoDB.

The original uploaded file is temporarily stored during processing and removed afterward. Its indexed chunks remain in MongoDB.

## 📚 Document Ingestion

Place PDF and TXT documents inside the `data/raw/` directory.

Run the ingestion script:

    uv run python scripts/ingest.py

**⚠️ Important:** The current ingestion script deletes all existing records in the configured MongoDB collection before inserting the source documents again. This also removes previously uploaded document chunks. Run it only when you intend to rebuild the collection.

## ⚠️ Current Limitations

- Answers depend on the information retrieved from the indexed documents.
- Conversation history is included in the generation prompt, but retrieval is based on the current question.
- Recent conversations are stored in frontend React state and are not persisted after a page refresh.
- Uploaded documents are indexed in MongoDB, but original uploaded files are not permanently retained.
- Source citations in generated answers and persistent document management are not currently implemented.

## 🔒 Security

- Never commit your `.env` file.
- Keep API keys and database credentials private.
- Review documents before publishing them in a public repository.
- Secure your MongoDB Atlas credentials and database access.

## 📜 License

No license has been specified yet.

---

<p align="center">
  <strong>Built with ❤️ using Python, React, MongoDB Atlas and Google Gemini.</strong>
  <br />
  <a href="https://github.com/Praveen67hz">GitHub Profile</a> ·
  <a href="https://github.com/Praveen67hz/tax-rag">Project Repository</a>
</p>
