const fs = require('fs');
const docService = require('../services/docService');
const chunkingService = require('../services/chunkingService');
const embeddingService = require('../services/embeddingService');
const Document = require('../models/Document');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await Document.findOneAndDelete({ user: req.user._id });

    const text = await docService.extractText(req.file.path);
    const chunkTexts = chunkingService.splitIntoChunks(text);
    
    // Generate embeddings for each chunk
    console.log(`Generating embeddings for ${chunkTexts.length} chunks...`);
    const chunks = [];
    for (const chunkText of chunkTexts) {
      const embedding = await embeddingService.generateEmbedding(chunkText);
      chunks.push({ text: chunkText, embedding });
    }

    const document = await Document.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      extractedText: text,
      chunks: chunks
    });

    res.json({
      message: 'File processed successfully',
      charCount: text.length,
      chunkCount: chunks.length,
      text: text,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('Upload & Processing Error:', error);
    res.status(500).json({ error: `Failed to process document: ${error.message}` });
  }
};

const getActiveDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ user: req.user._id });
    if (!document) {
      return res.json({ active: false });
    }
    res.json({
      active: true,
      filename: document.originalName,
      text: document.extractedText,
      chunkCount: document.chunks.length,
      charCount: document.extractedText.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active document' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const document = await Document.findOne({ user: req.user._id });
    if (document) {
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
      await Document.findByIdAndDelete(document._id);
      return res.json({ message: 'File deleted' });
    }
    res.status(404).json({ error: 'No file to delete' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  uploadFile,
  getActiveDocument,
  deleteFile
};
