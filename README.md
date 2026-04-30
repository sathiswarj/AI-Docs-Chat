# 🚀 DocGS AI — Local RAG Document Chat Assistant

DocGS AI is a full-stack AI-powered application that enables users to chat with documents and general AI using a hybrid system powered by local LLMs (Ollama).

It combines **Retrieval-Augmented Generation (RAG)** with conversational AI to provide accurate document-based answers while supporting general queries — all while keeping data fully local and private.

---

## ✨ Features

### 🧠 Hybrid AI Chat
- **Normal Mode**: Ask general questions (like ChatGPT)
- **Document Mode (RAG)**: Upload documents and get context-aware answers
- Automatic fallback to general AI when the answer is not found in the document

### 📄 Document Intelligence
- Supports **PDF, DOCX, TXT**
- Text extraction and semantic chunking
- Fast retrieval using vector similarity

### 🔍 Semantic Search
- Uses **Hugging Face embeddings (`all-MiniLM-L6-v2`)**
- Retrieves the most relevant chunks for accurate responses

### 🏷 Source Attribution
- Responses include:
  - `Source: Document`
  - `Source: General AI`

### 🧵 Multi-Conversation Support
- ChatGPT-style sidebar
- Manage multiple chat sessions

### 🔒 Local-First Privacy
- No external APIs required
- Runs entirely on your machine using Ollama
- Documents never leave your system

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15**
- React Hooks
- CSS (Glassmorphism UI)
- Lucide Icons

### Backend
- **Node.js + Express**
- MongoDB
- Axios (Ollama API)

### 🤖 AI Layer
- **LLM**: Ollama (Mistral)
- **Embeddings**: Hugging Face Transformers (`all-MiniLM-L6-v2`)

### 📂 File Processing
- `pdf-parse`
- `mammoth` (DOCX)

---

## ⚙️ How It Works

### 🔄 Hybrid Flow

#### Without Document
User → Backend → Ollama → Response

#### With Document (RAG)
User → Embedding → Vector Search → Top Chunks  
→ Build Context → Ollama → Response

---

## 🚀 Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Ollama installed → https://ollama.com

Pull model:
```bash
ollama pull mistral
