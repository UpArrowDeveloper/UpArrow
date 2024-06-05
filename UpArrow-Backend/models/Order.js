const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: ObjectId,
    stockId: ObjectId,
    quantity: Number,
    price: Number,
    type: {
      type: String,
      enum: ["buy", "sell", "idea-credit"],
      default: "buy",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
