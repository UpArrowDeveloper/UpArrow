const AWS = require('aws-sdk');
const config = require('./env');

const storage = new AWS.S3({
  region: 'ap-northeast-2',
  accessKeyId: config.s3AccessKey,
  secretAccessKey: config.s3SecretKey,
});
module.exports = storage;
