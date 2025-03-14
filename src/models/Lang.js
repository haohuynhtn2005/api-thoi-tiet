const mongoose = require('mongoose');
const { Schema } = mongoose;

const langSchema = new Schema(
  {
    code: String,
    desc: String,
  },
  {
    versionKey: false,
    collection: 'langs',
  }
);

const Lang = mongoose.model('Lang', langSchema);

module.exports = Lang;
