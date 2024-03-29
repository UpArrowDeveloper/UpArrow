const config = require('../config/env');
const storage = require('../config/s3');
const fs = require('fs');

const uploadFileToS3 = async (fileData) => {
  try {
    const fileContent = fs.readFileSync(fileData.path);

    const params = {
      Bucket: config.bucketName,
      Key: fileData.originalname,
      Body: fileContent,
    };

    const result = await storage.upload(params).promise();

    const data = {
      // _id: file._id,
      link: result.Location,
    };

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
};
