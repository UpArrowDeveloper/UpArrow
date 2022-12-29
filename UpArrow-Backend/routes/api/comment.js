const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const Comment = require('../../models/Comment');
const commentService = require('../../services/comment');

router.get('/:stockId/stock', async (req, res) => {
  const stockStringId = req.params.stockId;
  const allComments = await Comment.find({ stockId: stockStringId });

  return res.status(200).send(allComments);
});

router.get('/ids', async (req, res) => {
  const ids = req.query.ids;
  const idList = ids.split(',');
  console.log('idList : ', idList);
  const comments = await Promise.all(
    idList.map((id) => Comment.findById(ObjectId(id)))
  );
  console.log('comments : ', comments);

  return res.status(200).json(comments);
});

router.post('/', async (req, res) => {
  try {
    const isStockComment = !!req.body.stockId;
    let newComment;
    if (isStockComment) {
      const { stockId, userId, content, timeStamp, likes } = req.body;
      newComment = await commentService.addStockComment({
        stockId,
        userId,
        content,
        timeStamp,
        likes,
      });
    } else {
      const { postId, userId, content, timeStamp, likes } = req.body;
      newComment = await commentService.addPostComment({
        postId,
        userId,
        content,
        timeStamp,
        likes,
      });
    }
    return res.status(200).send(newComment);
  } catch (error) {
    console.error('error : ', error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
