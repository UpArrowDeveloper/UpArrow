const Vote = require('../models/Vote');

const findVotesByPostId = async (postId) => {
  const votes = await Vote.find({ postId });
  const agreeCount = votes.filter((vote) => vote.isAgree).length;
  const disagreeCount = votes.length - agreeCount;
  return { votes, agreeCount, disagreeCount };
};

module.exports = { findVotesByPostId };
