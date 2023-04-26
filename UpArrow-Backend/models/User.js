const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    cash: Number,
    profileImageUrl: String,
    username: String,
    email: String,
    investmentPhilosophy: String,
    websiteUrl: String,
    isAdmin: Boolean,
    orderIds: Array,
    totalInvestment: Number,
    totalProfits: Number,
    totalAssets: Number,
    followers: Array,
    followings: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
