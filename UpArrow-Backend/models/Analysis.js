const mongoose = require('mongoose');
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
    insightOfGiantsUrls: [String], // for Insights of Giants
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

module.exports = mongoose.model('Analysis', AnalysisSchema);

// Put:
// I would update the exisiting analysis
// I would use req.body for the new updated information

// Delete:

// Get:
// Fetch the analysis of the company
