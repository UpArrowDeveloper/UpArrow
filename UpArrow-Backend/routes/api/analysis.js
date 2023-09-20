const express = require("express");
const router = express.Router();
const Analysis = require("../../models/Analysis");

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).send({ message: "analysis not found" });
    } else {
      return res.status(200).json(analysis);
    }
  } catch (error) {
    return res.status(400).send({ message: "error : ", error });
  }
});

module.exports = router;
