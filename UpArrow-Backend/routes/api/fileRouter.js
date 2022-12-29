const { Router } = require('express');
const FileController = require('../../controllers/fileController');
const multer = require('multer');
const { multerConfig } = require('../../config/multer');

const router = Router();

const upload = multer(multerConfig);

router.post('/upload', upload.single('image'), FileController.uploadFileToS3);

module.exports = router;
