const FileService = require('../services/fileService');

const uploadFileToS3 = async (req, res) => {
  if (!req.file) return res.status(400).send(null);

  const fileData = req.file;

  try {
    const data = await FileService.uploadFileToS3(fileData);

    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(null);
  }
};

module.exports = {
  uploadFileToS3,
};
