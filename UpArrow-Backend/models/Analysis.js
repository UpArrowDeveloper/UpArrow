const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnalysisSchema = new Schema(
  {
    stockId: String,
    ticker: String,
    businessModel: String,
    industryTrend: String,
    competitiveAdvantages: String,
    uniqueTechnologies: String,
    productReviews: Array,
    competitorsAnalysis: String,
    management: String,
    revenue: String,
    netIncome: String,
    totalAssets: String,
    cashFlow: String,
    profitMargins: String,
    returnOnAssets: String,
    marketShare: String,
    growthOpportunities: String,
    potentialRisks: String,
    valuation: String,
    analystRatings: String,
    notableInvestors: Array,
    video: String,
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
