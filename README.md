# DocGS AI - Local Document Chat

DocGS AI is a premium, privacy-focused document analysis tool that allows users to upload PDFs and engage in conversations with local AI models via Ollama. No data leaves your machine.

## Features

- **100% Local AI**: Powered by Ollama—no API keys or cloud services required.
- **Intelligent PDF Parsing**: Extracts text from PDFs efficiently using pdf-parse.
- **Premium UI/UX**: Modern dark-mode interface with glassmorphism effects and smooth animations.
- **Modular Architecture**: Clean MVC-style backend and component-based Next.js frontend.
- **Smart Cleanup**: Automatic physical file deletion from the server upon analysis removal.
- **Developer Friendly**: Configured with nodemon and ready for any Ollama-compatible model.

## Tech Stack

### Frontend
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS 4
- Icons: Lucide React

### Backend
- Environment: Node.js & Express
- AI Engine: Ollama (Local LLM)
- Extraction: PDF-Parse

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Ollama installed and running
- A local model downloaded (e.g., llama3)

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
npm run dev
```

**Setup Frontend:**
```bash
cd ../client
npm install
npm run dev
```

### 3. Usage
1. Open http://localhost:3000 in your browser.
2. Select a PDF document via the upload section.
3. Click Send to process the file and start chatting with your local AI!

## License
This project is for educational purposes as part of the DocGS AI development journey.
