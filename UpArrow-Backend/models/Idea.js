const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema(
  {
    stockIds: Array,
    userId: String,
    youtubeCode: String,
    title: String,
    content: String,
    date: String,
    commentIds: Array,
    thumbnailImageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Idea', IdeaSchema);
