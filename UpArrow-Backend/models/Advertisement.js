const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertisementSchema = new Schema(
  {
    advertisementName: String,
    advertisement_url: String,
    image_url: String,
    video_url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
