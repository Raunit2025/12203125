const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String
});

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [clickSchema]
});

const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);
module.exports = Url;
