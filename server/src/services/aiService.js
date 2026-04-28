const axios = require('axios');

/**
 * Generates an answer using Ollama local AI.
 * Handles both normal chat and RAG (Document-based chat).
 * 
 * @param {string} question - The user's query
 * @param {string} context - Retrieved chunks from the document (if any)
 * @returns {Promise<string>}
 */
const generateAnswer = async (question, context) => {
  try {
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
    const MODEL = process.env.OLLAMA_MODEL || 'mistral';

    let systemPrompt = "You are a helpful AI research assistant.";
    let mainPrompt = question;

    if (context) {
      systemPrompt = `
You are an AI assistant.
First check the provided document context.

If the answer is found in the context:
- Answer using the document
- Mention: "Source: Document"

If the answer is NOT found:
- Answer using your general knowledge
- Mention: "Source: General AI"

Do not falsely claim the answer is from the document.
`.trim();

      mainPrompt = `
Document Context:
${context}

User Question:
${question}
`.trim();
    }

    console.log(`[Ollama] Mode: ${context ? 'RAG' : 'Normal'} | Model: ${MODEL}`);
    if (context) console.log(`[Ollama] Context: ${context.length} chars`);

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      system: systemPrompt,
      prompt: mainPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 800,
      }
    });

    const aiAnswer = response.data.response;
    console.log(`[Ollama] Response: ${aiAnswer.substring(0, 50).replace(/\n/g, ' ')}...`);
    return aiAnswer;
  } catch (error) {
    console.error('Ollama Integration Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return "Error: Ollama is not running. Please start Ollama on your local machine.";
    }

    return `I'm sorry, I encountered an error while connecting to my local brain: ${error.message}`;
  }
};

module.exports = {
  generateAnswer
};

