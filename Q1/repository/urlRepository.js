const Url = require('../domain/url');
const { log } = require('../handler/logger');

const findByShortcode = async (code) => {
  try {
    return await Url.findOne({ shortcode: code });
  } catch (err) {
    await log('fatal', 'repository', `DB error finding ${code}: ${err.message}`);
    throw err;
  }
};

const createShortUrl = async (details) => {
  try {
    const newEntry = new Url(details);
    return await newEntry.save();
  } catch (err) {
    await log('fatal', 'repository', `DB error saving URL: ${err.message}`);
    throw err;
  }
};

module.exports = {
  findByShortcode,
  createShortUrl
};
