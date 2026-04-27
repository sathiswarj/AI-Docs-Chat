const { pipeline } = require('@xenova/transformers');

let generator;

/**
 * Loads a small, free, local LLM.
 * Model: LaMini-Flan-T5-78M (optimized for local JS execution)
 */
const getGenerator = async () => {
  if (!generator) {
    console.log('Loading local AI brain (this may take a minute on first run)...');
    // Using a Text2Text generation pipeline
    generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');
    console.log('Local AI brain loaded. Ready to chat!');
  }
  return generator;
};

/**
 * Generates an answer based on document context and user question.
 * @param {string} question 
 * @param {string} context 
 * @returns {Promise<string>}
 */
const generateAnswer = async (question, context) => {
  try {
    const model = await getGenerator();
    console.log('Using prompt:', context ? 'With context' : 'No context');
    
    // Constructing a prompt for the T5 model
    const prompt = context 
      ? `Context: ${context}\nQuestion: ${question}\nAnswer:`
      : `Question: ${question}\nAnswer:`;

    const output = await model(prompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      repetition_penalty: 1.2
    });

    return output[0].generated_text;
  } catch (error) {
    console.error('Local AI Error Details:', error);
    return `I'm sorry, my local brain encountered an error: ${error.message}`;
  }
};

module.exports = {
  generateAnswer
};
