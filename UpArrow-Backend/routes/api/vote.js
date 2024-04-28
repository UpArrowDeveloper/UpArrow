const express = require("express");
const router = express.Router();
const Vote = require("../../models/Vote");

// TODO : post 에서 postId 넘겨주면 agreeCount, disAgreeCount 넘겨주는 api만들기

router.get("/:ideaId/idea", async (req, res) => {
  const { ideaId } = req.params;
  const votes = await Vote.find({ ideaId });
  res.json({ data: votes });
});

router.post("/", async (req, res) => {
  const { userId, postId: ideaId, isAgree } = req.body;
  const hasVote = await Vote.findOne({ userId, ideaId });
  if (hasVote) {
    if (hasVote.isAgree === isAgree) {
      await Vote.deleteOne({ userId, ideaId });
      return res.json({ message: "vote canceled" });
    }
    await Vote.updateOne({ userId, ideaId }, { userId, ideaId, isAgree });
    return res.json({ message: "vote changed" });
  }
  const newVote = new Vote({
    userId,
    ideaId,
    isAgree,
  });
  await newVote.save();
  // TODO : vote like 가 10 이상이면 1000$ 지급, 한번 지급되면 이후 지급 안되게 변경
  // 증가는 order에서 특정 수익 올린 것 처럼 보이게 하기 : 주문 관리 위함.
  return res.json({
    message: `vote to ${isAgree ? "agree" : "disagree"}`,
  });
});

module.exports = router;
