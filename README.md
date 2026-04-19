# DocGS AI - Intelligent Document Chat 🚀

DocGS AI is a premium, AI-powered document analysis tool that allows users to upload PDFs and engage in context-aware conversations using Google's Gemini 1.5 Flash model.

## ✨ Features

- **📄 Intelligent PDF Parsing**: Extracts text from PDFs efficiently using `pdf-parse`.
- **💬 AI Chat Integration**: Real-time analysis and Q&A powered by Google Gemini 1.5 Flash.
- **🎨 Premium UI/UX**: Modern dark-mode interface with glassmorphism effects, smooth animations, and interactive components.
- **📂 Modular Architecture**: Clean separation of concerns with a dedicated MVC-style backend and component-based frontend.
- **🗑️ Smart Cleanup**: Automatic physical file deletion from the server upon analysis removal.
- **⚙️ Developer Friendly**: Configured with `nodemon` for the backend and structured for high scalability.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

### Backend
- **Environment**: Node.js & Express
- **AI Model**: Google Generative AI (Gemini 1.5 Flash)
- **Extraction**: PDF-Parse

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation

**Clone the repository:**
```bash
git clone https://github.com/sathiswarj/AI-Docs-Chat.git
cd AI-Docs-Chat
```

**Setup Backend:**
```bash
cd server
npm install
# Create a .env file and add your GEMINI_API_KEY
npm run dev
```

**Setup Frontend:**
```bash
cd ../client
npm install
npm run dev
```

### 3. Usage
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Select a PDF document via the upload section.
3. Click "Send" to process the file and start chatting!

## 🔮 Roadmap: Ollama Integration
I am planning to extend DocGS AI to support local LLMs via **Ollama**. This will enable:
- **Private Analysis**: High-security document processing that never leaves your local machine.
- **Model Flexibility**: Seamless switching between Gemini (Cloud) and models like Llama 3 (Local).
- **Reduced Latency**: Faster response times by leveraging local hardware.

## 📄 License
This project is for educational purposes as part of the DocGS AI development journey.
