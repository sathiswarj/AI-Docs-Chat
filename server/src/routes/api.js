const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const fileController = require('../controllers/fileController');
const authRoutes = require('./authRoutes');
const { protect } = require('../middleware/authMiddleware');

router.use('/auth', authRoutes);

router.post('/upload', protect, upload.single('file'), fileController.uploadFile);
router.delete('/delete-file', protect, fileController.deleteFile);

module.exports = router;
