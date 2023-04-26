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

router.get('/:ids/ids', async (req, res) => {
  const ids = req.params.ids;
  const idList = ids.split(',');
  const comments = await Promise.all(
    idList.map((id) => Comment.findById(ObjectId(id)))
  );
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

router.put('/toggle-like', async (req, res) => {
  const { commentId, userId } = req.body;
  const comment = await commentService.getCommentById(commentId);
  const hasComment = comment.likes.includes(userId);
  if (hasComment) {
    await commentService.removeLike(commentId, userId);
    return res.status(200).send({ message: 'remove like' });
  } else {
    await commentService.addLike(commentId, userId);
    return res.status(200).send({ message: 'add like' });
  }
});

module.exports = router;
