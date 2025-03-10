const mongoose = require('mongoose');
const { Schema } = mongoose;

const coordinates = new Schema(
  {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  {
    _id: false,
  }
);

const locationSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true },
    region: {
      type: String, required: true,
      enum: {
        values: ['Bắc Bộ', 'Trung Bộ', 'Nam Bộ'],
      },
    },
    coordinates: { type: coordinates, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    weatherInfo: Schema.Types.Mixed,
  },
  {
    versionKey: false,
    collection: 'locations',
  }
);

// Add custom validation for duplicate code
locationSchema.pre('save', async function (next) {
  const location = this;

  // Only check for duplicates if code is modified
  if (!location.isModified('code')) return next();

  try {
    const existingLocation = await LocationModel.findOne({ code: location.code });
    if (existingLocation) {
      const validationError = new mongoose.Error.ValidationError(null);
      validationError.addError('code', new mongoose.Error.ValidatorError({
        message: 'Location code already exists',
        type: 'unique',
        path: 'code',
        value: location.code
      }));
      throw validationError;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const LocationModel = mongoose.model('Location', locationSchema);

module.exports = LocationModel;
