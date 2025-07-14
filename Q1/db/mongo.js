const mongoose = require('mongoose');

const connectDB = async function () {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/urlshortener');
  } catch (e) {
    throw e;
  }
};

module.exports = connectDB;
