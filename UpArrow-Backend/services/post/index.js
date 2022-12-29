const { ObjectId } = require('mongodb');
const Post = require('../../models/Post');

const addComment = async (postId, commentId) => {
  const postObjectId = ObjectId(postId);
  const postDocument = await Post.findById(postObjectId);
  const postCommentList = [...postDocument.commentIds, commentId];
  const postQuery = { _id: postObjectId };

  const updatePostValue = {
    commentIds: postCommentList,
  };
  await Post.findOneAndUpdate(postQuery, updatePostValue);
};

module.exports = {
  addComment,
};
