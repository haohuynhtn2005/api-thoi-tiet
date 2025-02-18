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

const LangModel = mongoose.model('Lang', langSchema);

module.exports = LangModel;
