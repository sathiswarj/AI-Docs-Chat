const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const fileController = require('../controllers/fileController');

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.delete('/delete-file', fileController.deleteFile);


module.exports = router;
