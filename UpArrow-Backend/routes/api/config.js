const express = require('express');
const router = express.Router();
const Config = require('../../models/Config');
const { getConfig } = require('../../services/config');

router.get('/', async (req, res) => {
  const config = await getConfig();
  return res.status(200).send(config);
});

router.put('/', async (req, res) => {
  const { prices, board, bannerImageUrl } = req.body;
  const originConfig = await getConfig();
  await Config.updateOne(
    { _id: originConfig._id },
    {
      prices: prices ? prices : originConfig.prices,
      bannerImageUrl: bannerImageUrl
        ? bannerImageUrl
        : originConfig.bannerImageUrl,
      board: board ? board : originConfig.board,
    }
  );
  return res.status(200).send('update success');
});

module.exports = router;
