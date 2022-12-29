const { ObjectId } = require('mongodb');
const User = require('../../models/User');

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

module.exports = {
  addComment,
};
