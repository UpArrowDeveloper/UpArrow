const Comment = require('../../models/Comment');
const ideaService = require('../idea');
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

module.exports = { addStockComment, addIdeaComment };
