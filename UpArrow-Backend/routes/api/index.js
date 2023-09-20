const express = require("express");
const router = express.Router();

const analysis = require("./analysis");
const idea = require("./idea");
const user = require("./user");
const comment = require("./comment");
const config = require("./config");
const order = require("./order");
const stock = require("./stock");
const banner = require("./banner");
const vote = require("./vote");
const price = require("./price");
const file = require("./fileRouter");
const google = require("./oauth/google");
const localAuth = require("./oauth/local");

router.use("/analysis", analysis);
router.use("/idea", idea);
router.use("/user", user);
router.use("/comment", comment);
router.use("/config", config);
router.use("/order", order);
router.use("/stock", stock);
router.use("/banner", banner);
router.use("/vote", vote);
router.use("/price", price);
router.use("/file", file);
router.use("/oauth", google);
router.use("/oauth/local", localAuth);

module.exports = router;
