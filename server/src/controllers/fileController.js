const fs = require('fs');
const pdfService = require('../services/pdfService');

// State managed at the controller level for this basic version
let documentContext = "";
let currentFilePath = "";

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    currentFilePath = req.file.path;
    const text = await pdfService.extractText(currentFilePath);
    documentContext = text;

    res.json({
      message: 'File processed successfully',
      charCount: documentContext.length
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
};

const deleteFile = (req, res) => {
  try {
    if (currentFilePath && fs.existsSync(currentFilePath)) {
      fs.unlinkSync(currentFilePath);
      currentFilePath = "";
      documentContext = "";
      return res.json({ message: 'File deleted' });
    }
    res.status(404).json({ error: 'No file to delete' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

// Exporting both for use in chatController if needed, 
// though a better way is a shared state manager or DB.
module.exports = { 
  uploadFile, 
  deleteFile, 
  getContext: () => documentContext 
};
