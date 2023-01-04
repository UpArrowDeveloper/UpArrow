const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const Analysis = require('../../models/Analysis');

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const objectId = ObjectId(id);
    const analysis = await Analysis.findById(objectId);
    console.log('analysis : ', JSON.stringify(analysis));

    if (!analysis) {
      return res.status(404).send({});
    } else {
      return res.status(200).json(analysis);
    }
  } catch (error) {
    return res.status(400).send({});
  }
});

module.exports = router;
