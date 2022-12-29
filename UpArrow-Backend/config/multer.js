const multer = require('multer');

const multerConfig = {
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
};

module.exports = { multerConfig };
