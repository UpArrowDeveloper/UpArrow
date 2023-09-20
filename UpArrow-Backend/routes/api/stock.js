const express = require("express");
const Analysis = require("../../models/Analysis");
const router = express.Router();
const Stock = require("../../models/Stock");
const Order = require("../../models/Order");
const Idea = require("../../models/Idea");
const { getStockByIds } = require("../../services/stock");
const ObjectId = require("mongodb").ObjectId;

router.get("/", async (req, res) => {
  const stocks = await Stock.find();

  return res.status(200).send(stocks);
});

router.get("/search", async (req, res) => {
  const query = req.query.name;
  const regex = (pattern) => new RegExp(`.*${pattern}.*`, "i");
  const stocks = await Stock.find({ name: { $regex: regex(query) } });

  return res.status(200).send(stocks);
});

router.get("/latestOrder", async (req, res) => {
  try {
    const stockList = await Stock.find();
    const orderList = await Order.find();

    const stockIds = stockList.map(({ _id }) => _id);

    for await (const stockId of stockIds) {
      const buyerCount = orderList.filter(
        (order) =>
          String(order.stockId) === String(stockId) && order.type === "buy"
      ).length;
      const sellerCount = orderList.filter(
        (order) =>
          String(order.stockId) === String(stockId) && order.type === "sell"
      ).length;
      await Stock.findOneAndUpdate(
        { _id: stockId },
        { buyerCount, sellerCount }
      );
    }

    return res.status(200).json({ message: "updated" });
  } catch (err) {
    return res.status(500).json({ error: JSON.stringify(err) });
  }
});

router.get("/:id", async (req, res) => {
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

router.get("/:ids/ids", async (req, res) => {
  try {
    const ids = req.params.ids;
    const stocks = await getStockByIds(ids.split(",") || []);

    return res.status(200).json(stocks);
  } catch (error) {
    return res.status(500).json({ message: "ids error" });
  }
});

router.get("/:ticker/ticker", async (req, res) => {
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

router.get("/:id/ideas", async (req, res) => {
  try {
    const id = req.params.id;
    const ideas = await Idea.find({ stockIds: { $in: [id] } });
    return res.json(ideas);
  } catch (error) {
    return res.status(500).json({ message: "id error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      youtubeUrl,
      youtubeTitle,
      youtubeDate,
      insightOfGiantsUrls,
      missionStatement,
      businessModel,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
      marketCap,
      financials,
      opinions,
    } = req.body;

    const newAnalysisId = await Analysis.create({
      youtubeUrl,
      youtubeTitle,
      youtubeDate,
      insightOfGiantsUrls,
      missionStatement,
      businessModel,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
      financials,
      opinions,
    });

    await Stock.create({
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      marketCap,
      buyerCount: 0,
      sellerCount: 0,
      commentCount: 0,
      analysisId: newAnalysisId,
    });

    res.json({ message: "success" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    ticker,
    logoUrl,
    backgroundImageUrl,
    currentPrice,
    targetPrices,
    youtubeUrl,
    youtubeTitle,
    youtubeDate,
    insightOfGiantsUrls,
    missionStatement,
    businessModel,
    competitiveAdvantage,
    growthOppertunities,
    potentialRisks,
    marketCap,
    financials,
    opinions,
  } = req.body;

  const stock = await Stock.findById(id);
  await Stock.findOneAndUpdate(
    { _id: id },
    {
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      marketCap,
    }
  );

  await Analysis.findOneAndUpdate(
    { _id: stock.analysisId },
    {
      youtubeUrl,
      youtubeTitle,
      youtubeDate,
      insightOfGiantsUrls,
      missionStatement,
      businessModel,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
      financials,
      opinions,
    }
  );
  return res.send("success");
});

router.put("/:id/price", async (req, res) => {
  const { id } = req.params;
  const { currentPrice } = req.body;

  await Stock.findOneAndUpdate({ _id: id }, { currentPrice });
  return res.send("success");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Stock.deleteOne({ _id: id });
  return res.send("delete success");
});

module.exports = router;
