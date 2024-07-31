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

const SWOTSchema = new Schema({
  summary: String,
  detail: String,
});

const InsightOfGiantsUrlSchema = new Schema({
  summary: String,
  link: String,
  thumbnailLink: String,
  updatedAt: Date,
});

const AnalysisSchema = new Schema(
  {
    youtubeUrl: String,
    youtubeTitle: String,
    youtubeDate: String,
    insightOfGiantsUrls: [InsightOfGiantsUrlSchema],
    missionStatement: String,
    businessModel: String,
    competitiveAdvantage: String,
    strengths: [SWOTSchema],
    weaknesses: [SWOTSchema],
    growthOppertunities: [SWOTSchema],
    potentialRisks: [SWOTSchema],
    financials: [FinancialsSchema],
    opinions: [OpinionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
