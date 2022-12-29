const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    stockId: String,
    userId: String,
    postId: String,
    content: String,
    timeStamp: Date,
    likes: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
