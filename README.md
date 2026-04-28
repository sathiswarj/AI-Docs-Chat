#  DocGS AI — Local RAG Document Chat Assistant

DocGS AI is a full-stack AI-powered application that enables users to chat with documents and general AI using a hybrid system powered by **local LLMs (Ollama)**.

It combines **Retrieval-Augmented Generation (RAG)** with **normal conversational AI**, ensuring both accuracy (from documents) and flexibility (general knowledge), while keeping all data **fully local and private**.

---

##  Features

### Hybrid AI Chat

* **Normal Mode**: Ask general questions (like ChatGPT)
* **Document Mode (RAG)**: Upload documents and get context-aware answers
* Automatic fallback to general AI if answer is not found in document

### Document Intelligence

* Supports **PDF, DOCX, TXT**
* Text extraction and semantic chunking
* Fast retrieval using vector similarity

###  Semantic Search

* Uses **all-MiniLM-L6-v2 embeddings**
* Retrieves most relevant chunks for accurate answers

### 🏷 Source Attribution

* Responses include:

  * `Source: Document`
  * `Source: General AI`

### Multi-Conversation Support

* ChatGPT-style sidebar
* Manage multiple sessions

### Local-First Privacy

* No external APIs required
* Runs entirely on your machine using Ollama
* Documents never leave your system

---

## 🛠 Tech Stack

### Frontend

* **Next.js 15**
* React Hooks
* CSS (Glassmorphism UI)
* Lucide Icons

### Backend

* **Node.js + Express**
* MongoDB
* Axios (Ollama API)

### AI Layer
- LLM: Ollama (Mistral)
- Embeddings: Hugging Face Transformers (via @xenova/transformers)
- Model: all-MiniLM-L6-v2

### File Processing

* `pdf-parse`
* `mammoth` (DOCX)

---

## ⚙️ How It Works

### 🔄 Hybrid Flow

#### Without Document

User → Backend → Ollama → Response

#### With Document (RAG)

User → Embedding → Vector Search → Top Chunks
→ Build Context → Ollama → Response

---

## Installation

### 1. Prerequisites

* Node.js (v18+)
* MongoDB (local or Atlas)
* Ollama installed

Install Ollama:
https://ollama.com

 

### 2. Environment Setup

Create `.env` in `server`:

```env
PORT=5000
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=mistral
```

---

### 3. Run Project

#### Backend

```bash
cd server
npm install
npm run dev
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📖 Usage

1. Open `http://localhost:3000`
2. Start chatting (general AI)
3. Upload a document
4. Ask questions about the document
5. AI responds with:

   * Document-based answers
   * OR general AI fallback

---

## ey Concepts Implemented

* Retrieval-Augmented Generation (RAG)
* Semantic Search (Embeddings + Vector similarity)
* Prompt Engineering
* Hybrid AI Architecture (RAG + General LLM)
* Local LLM Integration (Ollama)

---

## 🛡 Security & Privacy

* Fully local AI processing
* No external API calls
* No data leakage
* Ideal for sensitive documents

---

## Future Improvements

* Streaming responses
* Authentication (JWT)
* File size optimization
* Advanced chunk ranking
* UI enhancements

---

## License

ISC License

---

## Final Note

This project demonstrates practical implementation of modern AI systems using **RAG + local LLMs**, making it highly relevant for real-world AI applications.
