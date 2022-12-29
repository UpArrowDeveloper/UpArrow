const express = require('express');
const router = express.Router();
const Vote = require('../../models/Vote');

// TODO : post 에서 postId 넘겨주면 agreeCount, disAgreeCount 넘겨주는 api만들기

router.get('/:postId/post', async (req, res) => {
  const { postId } = req.params;
  const votes = await Vote.find({ postId });
  res.json({ data: votes });
});

router.post('/', async (req, res) => {
  const { userId, postId, isAgree } = req.body;
  const hasVote = await Vote.findOne({ userId, postId });
  if (hasVote) {
    if (hasVote.isAgree === isAgree) {
      await Vote.deleteOne({ userId, postId });
      return res.json({ message: 'vote canceled' });
    }
    await Vote.updateOne({ userId, postId }, { userId, postId, isAgree });
    return res.json({ message: 'vote changed' });
  }
  const newVote = new Vote({
    userId,
    postId,
    isAgree,
  });
  await newVote.save();
  return res.json({
    message: `vote to ${isAgree ? 'agree' : 'disagree'}`,
  });
});

module.exports = router;
