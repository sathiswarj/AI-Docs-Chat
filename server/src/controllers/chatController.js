const Message = require('../models/Message');

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

    // Dummy AI response logic for now (since actual LLM integration wasn't requested yet)
    const aiResponse = `I received your message: "${prompt}". In a real scenario, I would analyze your document chunks here.`;

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
