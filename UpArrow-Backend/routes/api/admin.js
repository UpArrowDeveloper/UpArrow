const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Stock = require('../../models/Stock');
const Advertisement = require('../../models/Advertisement');
const Average = require('../../models/Config');
const Comment = require('../../models/Comment');
const Analysis = require('../../models/Analysis');
const ObjectId = require('mongodb').ObjectId;

router.post('/register/stock', async (req, res) => {
  const existingStockName = await Stock.findOne({ name: req.body.name });
  const existingStockTicker = await Stock.findOne({ ticker: req.body.ticker });
  if (!existingStockName && !existingStockTicker) {
    const newStock = new Stock(req.body);
    newStock.save().catch((err) => console.log(err));
    return res.status(200).send(newStock);
  } else {
    return res.status(400).send({});
  }
});

// POST http://localhost:4000/api/v1/admin/register/stock
// the administrator registering a stock to an app

router.put('/update/stock/:stockObjectId', async (req, res) => {
  try {
    const stockId = req.params.stockObjectId;
    const objectId = ObjectId(stockId);
    const stock = await Stock.findById(objectId);

    if (!stock) {
      return res.status(404).send({});
    } else {
      const query = { _id: objectId };
      const updatedValue = {
        name: req.body.name,
        ticker: req.body.ticker,
        profile_image_url: req.body.profile_image_url,
        pros: req.body.pros,
        cons: req.body.cons,
        industryCategory: req.body.industryCategory,
        comments: req.body.comments,
        video_url: req.body.video_url,
        advertisementId: req.body.advertisementId,
      };
      await Stock.findOneAndUpdate(query, updatedValue);
      return res.status(200).send(updatedValue);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/admin/update/stock/:stockObjectId
// the administrator is updating the stock profile

router.delete('/delete/stock/:stockId', async (req, res) => {
  try {
    const stockId = req.params.stockId;
    const stockObjectId = ObjectId(stockId);
    const deletedStock = await Stock.findOneAndDelete({ _id: stockObjectId });

    if (!deletedStock) {
      return res.status(404).send({});
    } else {
      const deletedCommentsList = deletedStock.comments;
      for (var i = 0; i < deletedCommentsList.length; i++) {
        var commentId = deletedCommentsList[i];
        var commentObjectId = ObjectId(commentId);
        var deletedCommentDocument = await Comment.findOneAndDelete({
          _id: commentObjectId,
        });
        var deletedCommentId = deletedCommentDocument._id;

        var userId = deletedCommentDocument.userId;
        var userObjectId = ObjectId(userId);
        var userDocument = await User.findById(userObjectId);
        var userCommentsList = (userDocument.co = mments);

        let updatedStockCommentsList = userCommentsList.filter(
          (id) => !deletedCommentId.equals(id)
        );

        var userQuery = { _id: userObjectId };
        var updatedUserValue = {
          name: userDocument.name,
          profile_image_url: userDocument.profile_image_url,
          username: userDocument.username,
          password: userDocument.password,
          email: userDocument.email,
          description: userDocument.description,
          comments: updatedStockCommentsList,
          likes: userDocument.likes,
          isAdmin: userDocument.isAdmin,
          stockPreference: userDocument.stockPreference,
        };
        await User.findOneAndUpdate(userQuery, updatedUserValue);
      }
      return res.status(200).send(deletedStock);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// DELETE http://localhost:4000/api/v1/admin/delete/stock/:stockObjectId
// The administrator is deleting the stock profile

router.post('/register/analysis', async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ ticker: req.body.ticker });

    if (analysis) {
      return res.status(400).send({});
    } else {
      const newAnalysis = new Analysis(req.body);
      newAnalysis.save().catch((err) => console.log(err));
      return res.status(200).send(newAnalysis);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// POST http://localhost:4000/api/v1/admin/register/analysis
// The administrator is posting a new analysis of a company

router.put('/update/analysis/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const analysisDocument = await Analysis.findOne({ ticker: ticker });

  if (!analysisDocument) {
    return res.status(404).send({});
  } else {
    const analysisQuery = { _id: analysisDocument._id };
    const updatedAnalysisValue = {
      stockId: req.body.stockId,
      ticker: req.body.ticker,
      businessModel: req.body.businessModel,
      industryTrend: req.body.industryTrend,
      competitiveAdvantages: req.body.competitiveAdvantages,
      uniqueTechnologies: req.body.uniqueTechnologies,
      productReviews: req.body.productReviews,
      competitorsAnalysis: req.body.competitorsAnalysis,
      management: req.body.management,
      revenue: req.body.revenue,
      netIncome: req.body.netIncome,
      totalAssets: req.body.totalAssets,
      cashFlow: req.body.cashFlow,
      growthOpportunities: req.body.growthOpportunities,
      potentialRisks: req.body.potentialRisks,
      valuation: req.body.valuation,
      analystRatings: req.body.analystRatings,
      video: req.body.video,
    };
    await Analysis.findOneAndUpdate(analysisQuery, updatedAnalysisValue);
    return res.status(200).send(updatedAnalysisValue);
  }
});

// PUT http://localhost:4000/api/v1/admin/update/analysis/:ticker
// The admin is updating an analysis of a company

router.delete('/delete/analysis/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const deletedAnalysis = await Analysis.findOneAndDelete({ ticker: ticker });

  if (!deletedAnalysis) {
    return res.status(404).send({});
  } else {
    return res.status(200).send(deletedAnalysis);
  }
});

router.post('/create/averages', async (req, res) => {
  const newAverage = new Average(req.body);
  newAverage.save().catch((err) => console.log(err));
  return res.status(200).send(newAverage);
});

router.put('/update/average/:averageObjectId', async (req, res) => {
  try {
    const averageId = req.params.averageObjectId;
    const averageObjectId = ObjectId(averageId);
    const averageDocument = await Average.findById(averageObjectId);

    if (!averageDocument) {
      console.log('no such document ');
      return res.status(404).send({});
    } else {
      const query = { _id: averageObjectId };
      const updatedValue = {
        averages: req.body.averages,
      };
      await Average.findOneAndUpdate(query, updatedValue);
      return res.status(200).send(updatedValue);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({});
  }
});

// PUT http://localhost:4000/api/v1/admin/update/average/:averageObjectId
// the administrator is updating a stock price or add new stock

router.get('/fetch/averagestockprice', async (req, res) => {
  const averageStockPrice = await Average.find();
  return res.status(200).send(averageStockPrice);
});

// GET http://localhost:4000/api/v1/admin/fetch/averagestockprice

module.exports = router;
