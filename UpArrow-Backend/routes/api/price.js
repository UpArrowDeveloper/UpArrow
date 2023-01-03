const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const { getConfig } = require('../../services/config');
const { getStockById } = require('../../services/stock');

router.get('/', async (req, res) => {
  const { userId, stockId } = req.query;
  const stock = await getStockById(stockId);
  const orders = await Order.find({ userId, stockId });
  const config = await getConfig();
  const stockQuantity = orders.reduce((acc, order) => {
    if (order.type === 'buy') {
      return acc + order.quantity;
    }
    return acc - order.quantity;
  }, 0);
  const stockTicker = stock.ticker;
  const currentStockPrice = config.prices[stockTicker];

  return res.json({
    quantity: stockQuantity,
    price: currentStockPrice * stockQuantity,
  });
});

module.exports = router;
