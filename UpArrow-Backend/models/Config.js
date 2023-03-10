const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigSchema = new Schema(
  {
    bannerImageUrl: String,
    board: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Config', ConfigSchema);
