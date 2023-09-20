const express = require("express");
const router = express.Router();
const { getConfig } = require("../../services/config");

router.get("/", async (req, res) => {
  const config = await getConfig();
  return res.status(200).send(config);
});

module.exports = router;
