const express = require("express");
const router = express.Router();
const Banner = require("../../models/Banner");
const ObjectId = require("mongodb").ObjectId;

router.get("/", async (req, res) => {
  const stocks = await Banner.find();

  return res.status(200).send(stocks);
});

router.get("/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  console.log("id : ", id);
  const stock = await Banner.findById(id);

  return res.status(200).send(stock);
});
router.post("/", async (req, res) => {
  try {
    const { stockName, youtubeCode, description } = req.body;

    await Banner.create({
      stockName,
      youtubeCode,
      description,
    });

    res.json({ message: "success" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { stockName, youtubeCode, description } = req.body;

  await Banner.findOneAndUpdate(
    { _id: id },
    {
      stockName,
      youtubeCode,
      description,
    }
  );

  return res.send("success");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Banner.deleteOne({ _id: id });
  return res.send("delete success");
});

module.exports = router;
