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

router.post('/chat', protect, chatController.chat);
router.get('/chat/history', protect, chatController.getChatHistory);

module.exports = router;
