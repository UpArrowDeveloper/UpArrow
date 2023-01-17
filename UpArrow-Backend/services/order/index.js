const Order = require('../../models/Order');

const getOrdersByUserAndStock = async (userId, stockId) => {
  const orders = await Order.find({ userId, stockId });
  return orders;
};

const getCalculatedOrdersByUser = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error('no user id');
  const orders = await Promise.all(
    user.orderIds.map((id) => Order.findById(id))
  );
  const res = orders.reduce((acc, order) => {
    const orderStockId = order.stockId;
    const currentStockAcc = acc[orderStockId];
    if (currentStockAcc) {
      if (order.type === 'buy') {
        return {
          ...acc,
          [orderStockId]: {
            ...currentStockAcc,
            price:
              (currentStockAcc.price * currentStockAcc.quantity +
                order.price * order.quantity) /
              (currentStockAcc.quantity + order.quantity),
            quantity: currentStockAcc.quantity + order.quantity,
          },
        };
      } else {
        return {
          ...acc,
          [orderStockId]: {
            ...currentStockAcc,
            price:
              Math.abs(
                currentStockAcc.price * currentStockAcc.quantity -
                  order.price * order.quantity
              ) / Math.abs(currentStockAcc.quantity - order.quantity),
            quantity: currentStockAcc.quantity + order.quantity,
          },
        };
      }
    }
    return {
      [order._id]: {
        ...order,
      },
    };
  }, {});

  return res;
};

module.exports = {
  getOrdersByUserAndStock,
  getCalculatedOrdersByUser,
};
