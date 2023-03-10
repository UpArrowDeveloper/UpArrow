const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema(
  {
    ideaId: String,
    userId: String,
    isAgree: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vote', VoteSchema);
