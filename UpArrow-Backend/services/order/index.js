const Order = require('../../models/Order');

const getOrdersByUserAndStock = async (userId, stockId) => {
  const orders = await Order.find({ userId, stockId });
  return orders;
};

module.exports = {
  getOrdersByUserAndStock,
};
