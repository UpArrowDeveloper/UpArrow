const { ObjectId } = require('mongodb');
const User = require('../../models/User');
const { getStockPrices } = require('../config');
const { getCalculatedOrdersByUser } = require('../order');
const { getStockTickerById } = require('../stock');

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
  const stockPrices = await getStockPrices();
  const tickerAttachedCalculatedOrders = await Promise.all(
    Object.entries(calculatedOrders).map(([key, value]) => {
      return {
        [key]: {
          ...value,
          ticker: getStockTickerById(key),
        },
      };
    })
  );
  const profitAttachedOrders = tickerAttachedCalculatedOrders.map((order) => {
    return {
      ...order,
      profit:
        ((order.price * order.quantity -
          order.quantity * stockPrices[order.ticker]) /
          (order.quantity * stockPrices[order.ticker])) *
        100,
    };
  });
  return profitAttachedOrders.sort((a, b) => b.profit - a.profit).slice(0, 3);
};

module.exports = {
  addComment,
  changeCash,
  getUserById,
  getTop3StocksByUserId,
};
