const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BannerSchema = new Schema(
  {
    stockName: String,
    youtubeCode: String,
    description: String,
    thumbnailUrl: String,
    order: Number,
    ticker: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
