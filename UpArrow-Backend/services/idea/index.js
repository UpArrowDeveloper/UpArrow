const { ObjectId } = require('mongodb');
const Idea = require('../../models/Idea');

const addComment = async (postId, commentId) => {
  const ideaObjectId = ObjectId(postId);
  const IdeaDocument = await Idea.findById(ideaObjectId);
  const ideaCommentList = [...IdeaDocument.commentIds, commentId];
  const ideaQuery = { _id: ideaObjectId };

  const updatePostValue = {
    commentIds: ideaCommentList,
  };
  await Idea.findOneAndUpdate(ideaQuery, updatePostValue);
};

const getIdeasByUserId = async (userId) => {
  const ideas = await Idea.find({ userId });
  return ideas;
};

module.exports = {
  addComment,
  getIdeasByUserId,
};
