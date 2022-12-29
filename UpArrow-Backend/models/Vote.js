const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema(
  {
    postId: String,
    userId: String,
    isAgree: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vote', VoteSchema);
