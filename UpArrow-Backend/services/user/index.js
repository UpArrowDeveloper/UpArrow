const User = require('../../models/User');
const { getStockPrices } = require('../config');
const { getCalculatedOrdersByUser } = require('../order');
const { getStockById } = require('../stock');
const { UserAlreadyExist } = require('../../error/user');

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
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

const addUser = async (email, name, profileImageUrl) => {
  const user = await User.findOne({ email });
  if (user) throw UserAlreadyExist;

  const newUser = new User({
    email,
    name,
    profileImageUrl,
    username: '',
    investmentPhilosophy: '',
    websiteUrl: '',
    isAdmin: false,
    commentIds: [],
    followers: [],
    followings: [],
    cash: 100000,
  });
  await newUser.save().catch((err) => console.error(err));
};

const updateUserById = async (
  id,
  { email, name, profileImageUrl, username, investmentPhilosophy, websiteUrl }
) => {
  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      email,
      name,
      profileImageUrl,
      username,
      investmentPhilosophy,
      websiteUrl,
      isAdmin: false,
      followers: [],
      followings: [],
    }
  );
  return user;
};

module.exports = {
  addUser,
  updateUserById,
  changeCash,
  getUserById,
  getUserByEmail,
  getTop3StocksByUserId,
  addOrderById,
};
