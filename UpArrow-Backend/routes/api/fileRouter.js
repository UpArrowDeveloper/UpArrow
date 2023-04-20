const { Router } = require('express');
const FileController = require('../../controllers/fileController');
const multer = require('multer');
const { multerConfig } = require('../../config/multer');

const router = Router();

const upload = multer(multerConfig);

// multer가 local에 저장, 저장한 걸 s3로 올리는 거
router.post('/upload', upload.single('image'), FileController.uploadFileToS3);

module.exports = router;
