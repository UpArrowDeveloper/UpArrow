const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema(
  {
    name: String,
    ticker: String,
    profile_image_url: String,
    pros: Array,
    cons: Array,
    industryCategory: Array,
    commentIds: Array,
    video_url: String,
    advertisementId: String,
    invest: Array,
    notInvest: Array,
    stockString: String,
    posts: Array,
    detailInfo: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', StockSchema);
