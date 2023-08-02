const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * board : {
 *  imageUrl: string,
 *  name: string,
 *  importantDateString: DateString,
 *  importantDatePrice: number,
 *  ticker: string,
 *  chartImageUrl: string,
 *  dotLocation: number,
 *  color: string,
 * }
 */

/**
 * boards : {
 * youtubeCode: string,
 * thumbnailUrl?: string,
 * stockName: objectId,
 * description: string,
 * }
 */
const ConfigSchema = new Schema(
  {
    bannerImageUrl: String,
    board: Object,
    boards: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", ConfigSchema);
