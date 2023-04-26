const Comment = require('../../models/Comment');
const ideaService = require('../idea');
const stockService = require('../stock');

const getCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment;
};
const addStockComment = async ({
  stockId,
  userId,
  content,
  timeStamp,
  likes,
}) => {
  const newComment = new Comment({
    stockId,
    userId,
    content,
    timeStamp,
    likes,
  });

  await stockService.addComment(stockId, newComment._id);

  await newComment.save();
  return newComment;
};

const addIdeaComment = async ({
  ideaId,
  userId,
  content,
  timeStamp,
  likes,
}) => {
  const newComment = new Comment({
    ideaId,
    userId,
    content,
    timeStamp,
    likes,
  });

  await ideaService.addComment(ideaId, newComment._id);

  await newComment.save();
  return newComment;
};

const removeLike = async (commentId, userId) => {
  await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
};

const addLike = async (commentId, userId) => {
  await Comment.updateOne({ _id: commentId }, { $push: { likes: userId } });
};

module.exports = {
  getCommentById,
  addStockComment,
  addIdeaComment,
  removeLike,
  addLike,
};
