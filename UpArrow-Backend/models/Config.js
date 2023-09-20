const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigSchema = new Schema(
  {
    adminEmails: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", ConfigSchema);
