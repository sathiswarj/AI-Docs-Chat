/**
 * Splits text into chunks of a specified size (in words).
 * @param {string} text The text to split.
 * @param {number} minWords Minimum words per chunk (default 500).
 * @param {number} maxWords Maximum words per chunk (default 800).
 * @returns {string[]} Array of text chunks.
 */
const splitIntoChunks = (text, minWords = 500, maxWords = 800) => {
  if (!text) return [];

  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];

  for (const word of words) {
    currentChunk.push(word);
    
    // If we reached maxWords, create a chunk
    if (currentChunk.length >= maxWords) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
    }
  }

  // Handle the last chunk
  if (currentChunk.length > 0) {
    // If the last chunk is too small and we have other chunks, 
    // maybe append it to the last one, or just keep it.
    // For now, let's just push it.
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
};

module.exports = { splitIntoChunks };
