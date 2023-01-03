const { ObjectId } = require('mongodb');
const Stock = require('../../models/Stock');

const getStockById = async (stockId) => {
  const stock = await Stock.findById(stockId);
  return stock;
};

const addComment = async (stockId, commentId) => {
  const stockObjectId = ObjectId(stockId);
  const stockDocument = await getStockById(stockId);
  const stockCommentIds = [...stockDocument.commentIds, commentId];
  const stockQuery = { _id: stockObjectId };
  const updatedStockValue = {
    commentIds: stockCommentIds,
  };
  await Stock.findOneAndUpdate(stockQuery, updatedStockValue);
};

module.exports = {
  getStockById,
  addComment,
};
