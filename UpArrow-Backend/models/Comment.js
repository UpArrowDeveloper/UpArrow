const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: String,
    timeStamp: Date,
    likes: Array,
    userId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
