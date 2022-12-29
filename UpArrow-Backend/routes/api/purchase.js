const express = require('express');
const router = express.Router();
const Purchase = require('../../models/Purchase');

router.get('/:userId/user', async (req, res) => {
  const userId = req.params.userId;
  const purchases = await Purchase.find({ userId });
  return res.status(200).send(purchases);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const purchases = await Purchase.findOne({ _id: id });
  return res.status(200).send(purchases);
});

module.exports = router;
