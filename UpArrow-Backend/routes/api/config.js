const express = require('express');
const router = express.Router();
const Config = require('../../models/Config');

router.get('/', async (req, res) => {
  const config = await Config.find();
  return res.status(200).send(config[0]);
});

router.put('/', async (req, res) => {
  const { prices, board, bannerImageUrl } = req.body;
  const originConfig = await Config.find();
  const config = await Config.updateOne(
    { _id: originConfig[0]._id },
    {
      prices: prices ? prices : originConfig[0].prices,
      bannerImageUrl: bannerImageUrl
        ? bannerImageUrl
        : originConfig[0].bannerImageUrl,
      board: board ? board : originConfig[0].board,
    }
  );
  return res.status(200).send('update success');
});

module.exports = router;
