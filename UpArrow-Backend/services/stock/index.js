const { ObjectId } = require('mongodb');
const Stock = require('../../models/Stock');

const getStockById = async (stockId) => {
  const stock = await Stock.findById(stockId);
  return stock;
};

const getStockByIds = async (stockIds) => {
  return Promise.all(stockIds.map((id) => Stock.findById(id)));
};

const getStockTickerById = async (stockId) => {
  const stock = await Stock.findById(stockId);
  return stock.ticker;
};

const addComment = async (stockId, commentId) => {
  const stockObjectId = ObjectId(stockId);
  const stockDocument = await Stock.findById(stockObjectId);
  const stockComments = [...stockDocument.commentIds, commentId];
  const stockQuery = { _id: stockObjectId };

  const updateStockValue = {
    commentIds: stockComments,
  };
  await Stock.findOneAndUpdate(stockQuery, updateStockValue);
};

module.exports = {
  getStockById,
  getStockByIds,
  getStockTickerById,
  addComment,
};
