const { ObjectId } = require('mongodb');
const User = require('../../models/User');

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

const addComment = async (userId, commentId) => {
  const userObjectId = ObjectId(userId);
  const userDocument = await User.findById(userObjectId);
  const userCommentList = [...userDocument.commentIds, commentId];
  const userQuery = { _id: userObjectId };
  const updatedUserValue = {
    commentIds: userCommentList,
  };
  await User.findOneAndUpdate(userQuery, updatedUserValue);
};

const changeCash = async ({ userId, cash }) => {
  const user = await getUserById(userId);
  if (user.cash + cash < 0) throw new Error('more then 0');
  user.cash = user.cash + cash;
  user.save();
};

module.exports = {
  addComment,
  changeCash,
  getUserById,
};
