const config = require('../config/env');
const storage = require('../config/s3');
// const File = require('../models/File');
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

    // const file = new File({
    //   link: result.Location,
    //   fileName: fileData.originalname,
    // });

    // await file.save();

    const data = {
      // _id: file._id,
      link: result.Location,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
};
