const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    cash: Number,
    //check
    profile_image_url: String,
    username: String,
    email: String,
    investment_philosophy: String,
    website_url: String,
    commentIds: Array,
    isAdmin: Boolean,
    posts: Array,
    purchases: Array,
    totalInvestment: Number,
    totalProfits: Number,
    totalAssets: Number,
    followers: Array,
    followings: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
