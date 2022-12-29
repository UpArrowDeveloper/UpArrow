const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    stockIds: Array,
    userId: String,
    username: String,
    youtubeCode: String,
    title: String,
    content: String,
    date: String,
    likes: Array,
    commentIds: Array,
    thumbnailImageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
