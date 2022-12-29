export const uploadFileToS3Service = async (fileData) => {
  try {
    const fileContent = fs.readFileSync(fileData.path);

    const params = {
      Bucket: config.bucketName,
      Key: fileData.originalname,
      Body: fileContent,
    };

    const result = await storage.upload(params).promise();

    const file = new File({
      link: result.Location,
      fileName: fileData.originalname,
    });

    await file.save();

    const data = {
      _id: file._id,
      link: result.Location,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadFileToS3 = async (req, res) => {
  if (!req.file)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));

  const fileData = req.file;

  try {
    const data = await FileService.uploadFileToS3(fileData);

    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_FILE_SUCCESS, data)
      );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};
