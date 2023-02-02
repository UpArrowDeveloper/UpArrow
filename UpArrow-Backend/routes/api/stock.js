const express = require('express');
const Analysis = require('../../models/Analysis');
const router = express.Router();
const Stock = require('../../models/Stock');
const { getStockByIds } = require('../../services/stock');
const ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
  const stocks = await Stock.find();

  if (stocks.length == 0) {
    return res.status(404).send({});
  } else {
    return res.status(200).send(stocks);
  }
});

router.get('/search', async (req, res) => {
  const query = req.query.name;
  const regex = (pattern) => new RegExp(`.*${pattern}.*`, 'i');
  const stocks = await Stock.find({ name: { $regex: regex(query) } });

  return res.status(200).send(stocks);
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const objectId = ObjectId(id);
    const stock = await Stock.findById(objectId);

    if (!stock) {
      return res.status(404).send({});
    } else {
      return res.status(200).send(stock);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

router.get('/:ids/ids', async (req, res) => {
  try {
    const ids = req.params.ids;
    const stocks = await getStockByIds(ids.split(',') || []);

    return res.status(200).json(stocks);
  } catch (error) {
    return res.status(500).json({ message: 'ids error' });
  }
});

router.get('/:ticker/ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker;
    const stock = await Stock.findOne({ ticker });

    if (!stock) {
      return res.status(404).send({});
    } else {
      return res.status(200).send(stock);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      // analysisId: ObjectId,
      // commentIds: [ObjectId],
      stockId,
      thumbnailImageUrl,
      thumbnailTitle,
      thumbnailDate,
      ideaIds,
      missionStatement,
      businessModel,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
    } = req.body;

    const newAnalysisId = await Analysis.create({
      thumbnailImageUrl,
      thumbnailTitle,
      thumbnailDate,
      ideaIds: [],
      missionStatement,
      businessModel,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
      financials: [],
      opinions: [],
    });

    await Stock.create({
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      analysisId: newAnalysisId,
    });

    res.json({ message: 'success' });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put('/:id/price', async (req, res) => {
  const { id } = req.params;
  console.log('req.body : ', req.body);
  const { currentPrice } = req.body;
  console.log('id : ', id);
  console.log('currentProce : ', currentPrice);

  const result = await Stock.findOneAndUpdate({ _id: id }, { currentPrice });
  return res.send('success');
});

module.exports = router;
