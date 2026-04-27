const { pipeline } = require('@xenova/transformers');

let extractor;

/**
 * Loads the embedding model if not already loaded.
 * Using Xenova/all-MiniLM-L6-v2 which is optimized for speed and size.
 */
const getExtractor = async () => {
  if (!extractor) {
    console.log('Loading embedding model (this may take a moment on first run)...');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding model loaded.');
  }
  return extractor;
};

/**
 * Generates a vector embedding for a given text string.
 * @param {string} text The text to embed.
 * @returns {Promise<number[]>} The vector embedding.
 */
const generateEmbedding = async (text) => {
  try {
    const model = await getExtractor();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

/**
 * Calculates cosine similarity between two vectors.
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} Similarity score (0 to 1)
 */
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return dotProduct / (mA * mB);
};

module.exports = {
  generateEmbedding,
  cosineSimilarity
};
