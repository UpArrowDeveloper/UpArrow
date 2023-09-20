const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChartSchema = new Schema({
  year: Number,
  value: Number,
});

const FinancialsSchema = new Schema({
  name: String,
  chartValues: [ChartSchema],
});

const OpinionSchema = new Schema({
  authorImageUrl: String,
  author: String,
  message: String,
});

const AnalysisSchema = new Schema(
  {
    youtubeUrl: String,
    youtubeTitle: String,
    youtubeDate: String,
    insightOfGiantsUrls: [String],
    missionStatement: String,
    businessModel: String,
    competitiveAdvantage: String,
    growthOppertunities: [String],
    potentialRisks: [String],
    financials: [FinancialsSchema],
    opinions: [OpinionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
