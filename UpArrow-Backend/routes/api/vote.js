const express = require("express");
const router = express.Router();
const Vote = require("../../models/Vote");
const Idea = require("../../models/Idea");
const Order = require("../../models/Order");
const User = require("../../models/User");

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

  if (isAgree) {
    const idea = await Idea.findById(ideaId);
    if (!idea.overTen) {
      const votes = await Vote.find({
        ideaId,
        isAgree,
      });
      if (votes.length >= 10) {
        await Idea.updateOne({ _id: ideaId }, { overTen: true });
        const currentUser = await User.findById(userId);
        await User.updateOne(
          { _id: userId },
          { cash: currentUser.cash + 1000, overTen: true }
        );

        const newOrder = new Order({
          userId,
          quantity: 1,
          type: "idea-credit",
          price: 1000,
        });
        await newOrder.save();
      }
    }
  }

  return res.json({
    message: `vote to ${isAgree ? "agree" : "disagree"}`,
  });
});

module.exports = router;
