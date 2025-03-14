const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'staff', 'admin'],
      default: 'user',
    },
  },
  {
    collection: 'users',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware to convert E11000 to a validation error
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const validationError = new mongoose.Error.ValidationError();
    validationError.addError(
      'email',
      new mongoose.Error.ValidatorError({
        message: 'Email already exists',
      })
    );
    next(validationError);
  } else {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
