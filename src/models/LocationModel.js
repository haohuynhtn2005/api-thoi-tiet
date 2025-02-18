const mongoose = require('mongoose');
const { Schema } = mongoose;

const coordinates = new Schema(
  {
    lat: Number,
    lon: Number,
  },
  {
    _id: false,
  }
);

const locationSchema = new Schema(
  {
    code: String,
    name: String,
    region: String,
    coordinates: { type: coordinates },
    updatedAt: Date,
    weatherInfo: Schema.Types.Mixed,
  },
  {
    versionKey: false,
    collection: 'locations',
  }
);

const LocationModel = mongoose.model('Location', locationSchema);

module.exports = LocationModel;
