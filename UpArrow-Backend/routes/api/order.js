const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const { changeCash, addOrderById } = require('../../services/user');
const { getOrdersByUserAndStock } = require('../../services/order');

router.get('/:userId/user', async (req, res) => {
  const userId = req.params.userId;
  const orders = await Order.find({ userId });
  return res.status(200).send(orders);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const order = await Order.findOne({ _id: id });
  return res.status(200).send(order);
});

router.post('/', async (req, res) => {
  const { userId, stockId, quantity, price, type } = req.body;
  const fixCash = quantity * price * (type === 'buy' ? -1 : 1);

  try {
    const orders = await getOrdersByUserAndStock(userId, stockId);
    const totalQuantity =
      orders.reduce(
        (acc, order) => (acc + order.quantity * order.type === 'buy' ? 1 : -1),
        0
      ) +
      quantity * (type === 'buy' ? 1 : -1);
    if (totalQuantity < 0) {
      throw new Error('exceed quantity');
    }
  } catch (error) {
    console.error('error : ', error);
    return res.status(400).json({ message: 'exceed quantity', error });
  }
  try {
    await changeCash({ userId, cash: fixCash });
  } catch (error) {
    return res.status(400).json({ message: 'exceed cash' });
  }

  const orderId = await Order.create({
    userId,
    stockId,
    quantity,
    price,
    type,
  });
  await addOrderById(userId, orderId._id);

  return res.status(200).json({ message: 'created' });
});

module.exports = router;
