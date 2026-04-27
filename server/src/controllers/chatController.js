const Message = require('../models/Message');
const Document = require('../models/Document');
const embeddingService = require('../services/embeddingService');
const aiService = require('../services/aiService');

const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

const chat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Save user message
    await Message.create({
      user: req.user._id,
      role: 'user',
      content: prompt
    });

    // Semantic Search Logic
    const activeDoc = await Document.findOne({ user: req.user._id });
    let context = "";

    if (activeDoc && activeDoc.chunks.length > 0) {
      console.log('Performing semantic search...');
      const queryEmbedding = await embeddingService.generateEmbedding(prompt);
      
      // Calculate similarity for each chunk
      const similarities = activeDoc.chunks.map(chunk => ({
        text: chunk.text,
        score: embeddingService.cosineSimilarity(queryEmbedding, chunk.embedding)
      }));

      // Sort by score and take top 3
      const topChunks = similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .filter(c => c.score > 0.3); // Threshold to avoid irrelevant noise

      context = topChunks.map(c => c.text).join("\n\n");
      console.log(`Found ${topChunks.length} relevant chunks for context.`);
    }

    // Use the Local AI Service to generate a response
    console.log('Generating AI response...');
    const aiResponse = await aiService.generateAnswer(prompt, context);

    // Save AI response
    const aiMsg = await Message.create({
      user: req.user._id,
      role: 'ai',
      content: aiResponse
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};

module.exports = {
  getChatHistory,
  chat
};
