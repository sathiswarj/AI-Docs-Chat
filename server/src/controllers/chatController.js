const Message = require('../models/Message');
const Document = require('../models/Document');
const Conversation = require('../models/Conversation');
const embeddingService = require('../services/embeddingService');
const aiService = require('../services/aiService');
const fs = require('fs');

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

const chat = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        user: req.user._id,
        title: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '')
      });
    }

    // Save user message
    await Message.create({
      user: req.user._id,
      conversation: conversation._id,
      role: 'user',
      content: prompt
    });

    // Find documents for this specific conversation
    const activeDoc = await Document.findOne({ conversation: conversation._id }).sort({ createdAt: -1 });
    let context = "";

    if (activeDoc && activeDoc.chunks.length > 0) {
      const queryEmbedding = await embeddingService.generateEmbedding(prompt);
      
      // Calculate similarity for each chunk
      const similarities = activeDoc.chunks.map(chunk => ({
        text: chunk.text,
        score: embeddingService.cosineSimilarity(queryEmbedding, chunk.embedding)
      }));

      // Sort by score and take top 5
      const similaritiesSorted = similarities.sort((a, b) => b.score - a.score);
      const topChunks = similaritiesSorted
        .slice(0, 5)
        .filter(c => c.score > 0.15); // Lowered threshold for better recall

      context = topChunks.map(c => c.text).join("\n\n");
    }

    // Setup abort controller for handling client-side cancellation
    const controller = new AbortController();
    req.on('close', () => {
      console.log('Client closed connection, aborting AI generation...');
      controller.abort();
    });

    // Use the Local AI Service to generate a response
    const aiResponse = await aiService.generateAnswer(prompt, context, controller.signal);

    // Save AI response
    await Message.create({
      user: req.user._id,
      conversation: conversation._id,
      role: 'ai',
      content: aiResponse
    });

    res.json({ 
      response: aiResponse,
      conversationId: conversation._id,
      title: conversation.title
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Find all documents related to this conversation
    const docs = await Document.find({ conversation: id });
    for (const doc of docs) {
      if (fs.existsSync(doc.filePath)) {
        fs.unlinkSync(doc.filePath);
      }
    }

    // 2. Delete all documents from DB
    await Document.deleteMany({ conversation: id });

    // 3. Delete all messages from DB
    await Message.deleteMany({ conversation: id });

    // 4. Delete conversation itself
    await Conversation.findByIdAndDelete(id);

    res.json({ message: 'Conversation and all related data deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

module.exports = {
  getConversations,
  getChatHistory,
  chat,
  deleteConversation
};
