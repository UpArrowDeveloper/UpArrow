const express = require("express");
const router = express.Router();
const Banner = require("../../models/Banner");
const ObjectId = require("mongodb").ObjectId;

router.get("/", async (req, res) => {
  const stocks = await Banner.find();
  return res.status(200).json(stocks);
});

router.get("/:id", async (req, res) => {
  const id = ObjectId(req.params.id);
  const banner = await Banner.findById(id);

  return res.status(200).json(banner);
});

router.post("/", async (req, res) => {
  try {
    const { stockName, youtubeCode, description, thumbnailUrl } = req.body;

    await Banner.create({
      stockName,
      youtubeCode,
      description,
      thumbnailUrl,
    });

    res.json({ message: "success" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { stockName, youtubeCode, description, order, thumbnailUrl } = req.body;

  await Banner.findOneAndUpdate(
    { _id: id },
    {
      stockName,
      youtubeCode,
      description,
      order,
      thumbnailUrl,
    }
  );

  return res.json("banner update success");
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Banner.deleteOne({ _id: id });
  return res.json("banner delete success");
});

module.exports = router;
