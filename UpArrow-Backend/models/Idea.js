const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdeaSchema = new Schema(
  {
    stockIds: Array,
    userId: String,
    youtubeCode: String,
    title: String,
    content: String,
    date: Date,
    commentIds: Array,
    thumbnailImageUrl: String,
    overTen: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", IdeaSchema);
