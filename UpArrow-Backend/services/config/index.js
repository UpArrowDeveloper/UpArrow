const { ObjectId } = require("mongodb");
const Config = require("../../models/Config");

const getConfig = async () => {
  const config = await Config.find();
  return config[0];
};

module.exports = {
  getConfig,
};
