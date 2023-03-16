const mongoose = require('mongoose');
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
const ConfigSchema = new Schema(
  {
    bannerImageUrl: String,
    board: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Config', ConfigSchema);
