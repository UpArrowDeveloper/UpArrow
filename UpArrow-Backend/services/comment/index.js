const Comment = require('../../models/Comment');
const postService = require('../post');
const userService = require('../user');
const stockService = require('../stock');

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

  await postService.addComment(postId, newComment._id);
  await userService.addComment(userId, newComment._id);

  await newComment.save();
  return newComment;
};

module.exports = { addStockComment, addPostComment };
