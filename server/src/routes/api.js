const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const fileController = require('../controllers/fileController');
const chatController = require('../controllers/chatController');
const authRoutes = require('./authRoutes');
const { protect } = require('../middleware/authMiddleware');

router.use('/auth', authRoutes);

router.post('/upload', protect, upload.single('file'), fileController.uploadFile);
router.get('/active-document', protect, fileController.getActiveDocument);
router.delete('/delete-file', protect, fileController.deleteFile);

router.get('/conversations', protect, chatController.getConversations);
router.post('/chat', protect, chatController.chat);
router.get('/chat/history/:conversationId', protect, chatController.getChatHistory);
router.delete('/conversation/:id', protect, chatController.deleteConversation);

module.exports = router;
