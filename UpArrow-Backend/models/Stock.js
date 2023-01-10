const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TargetPriceSchema = new Schema({ name: String, price: Number });
const StockSchema = new Schema(
  {
    name: String,
    ticker: String,
    logoUrl: String,
    backgroundImageUrl: String,
    currentPrice: Number,
    targetPrices: [TargetPriceSchema],
    ideaIds: [ObjectId],
    analysisId: ObjectId,
    marketCap: Number,
    buyerCount: Number, // 하루 한번 업데이트
    sellerCount: Number,
    commentCount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', StockSchema);
