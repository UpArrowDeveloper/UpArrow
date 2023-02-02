const Comment = require('../../models/Comment');
const ideaService = require('../idea');
const userService = require('../user');

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

  await userService.addComment(userId, newComment._id);

  await newComment.save();
  return newComment;
};

const addPostComment = async ({
  postId,
  userId,
  content,
  timeStamp,
  likes,
}) => {
  const newComment = new Comment({
    postId,
    userId,
    content,
    timeStamp,
    likes,
  });

  await ideaService.addComment(postId, newComment._id);
  await userService.addComment(userId, newComment._id);

  await newComment.save();
  return newComment;
};

module.exports = { addStockComment, addPostComment };
