const { ObjectId } = require('mongodb');
const Stock = require('../../models/Stock');

const addComment = async (stockId, commentId) => {
  const stockObjectId = ObjectId(stockId);
  const stockDocument = await Stock.findById(stockObjectId);
  const stockCommentIds = [...stockDocument.commentIds, commentId];
  const stockQuery = { _id: stockObjectId };
  const updatedStockValue = {
    commentIds: stockCommentIds,
  };
  await Stock.findOneAndUpdate(stockQuery, updatedStockValue);
};

module.exports = {
  addComment,
};
