const { ObjectId } = require('mongodb');
const User = require('../../models/User');
const { getStockPrices } = require('../config');
const { getCalculatedOrdersByUser } = require('../order');
const { getStockById } = require('../stock');

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

const addComment = async (userId, commentId) => {
  const userObjectId = ObjectId(userId);
  const userDocument = await User.findById(userObjectId);
  const userCommentList = [...userDocument.commentIds, commentId];
  const userQuery = { _id: userObjectId };
  const updatedUserValue = {
    commentIds: userCommentList,
  };
  await User.findOneAndUpdate(userQuery, updatedUserValue);
};

const changeCash = async ({ userId, cash }) => {
  const user = await getUserById(userId);
  if (user.cash + cash < 0) throw new Error('more then 0');
  user.cash = user.cash + cash;
  user.save();
};

const getTop3StocksByUserId = async (userId) => {
  const calculatedOrders = await getCalculatedOrdersByUser(userId);
  const tickerAttachedCalculatedOrders = await Promise.all(
    Object.entries(calculatedOrders).map(async ([_, value]) => {
      const stock = await getStockById(value.stockId);
      return {
        ...value,
        ticker: stock.ticker,
        name: stock.name,
        stock,
      };
    })
  );
  const profitAttachedOrders = tickerAttachedCalculatedOrders.map((order) => {
    return {
      ...order,
      profit:
        ((order.quantity * order.stock.currentPrice -
          order.price * order.quantity) /
          (order.quantity * order.stock.currentPrice)) *
        100,
    };
  });
  return profitAttachedOrders.sort((a, b) => b.profit - a.profit).slice(0, 3);
};

const addOrderById = async (id, orderId) => {
  const user = await User.findById(id);
  return User.findOneAndUpdate(
    { _id: id },
    { orderIds: [...user.orderIds, orderId] }
  );
};

module.exports = {
  addComment,
  changeCash,
  getUserById,
  getTop3StocksByUserId,
  addOrderById,
};
