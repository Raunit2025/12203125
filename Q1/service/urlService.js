const dayjs = require('dayjs');
const shortid = require('shortid');
const { findByShortcode, createShortUrl } = require('../repository/urlRepository');
const { log } = require('../handler/logger');
const Url = require('../domain/url');

const isValidURL = (url) => /^https?:\/\/.+/.test(url);
const generateShortcode = () => shortid.generate();

const trackClickService = async (shortcode, { referrer, location }) => {
  await Url.updateOne(
    { shortcode },
    { $push: { clicks: { referrer, location } } }
  );
};

const createShortUrlService = async ({ url, validity, shortcode }) => {
  if (!isValidURL(url)) {
    await log('error', 'handler', 'Invalid URL format received.');
    throw { status: 400, message: 'Invalid URL format.' };
  }

  const code = shortcode || generateShortcode();

  if (!/^[a-zA-Z0-9_-]{4,20}$/.test(code)) {
    await log('error', 'handler', 'Invalid shortcode format.');
    throw { status: 400, message: 'Invalid shortcode format.' };
  }

  const exists = await findByShortcode(code);
  if (exists) {
    await log('warn', 'repository', `Shortcode "${code}" already exists.`);
    throw { status: 409, message: 'Shortcode already exists.' };
  }

  const expiry = dayjs().add(validity || 30, 'minute').toISOString();
  const saved = await createShortUrl({ url, shortcode: code, expiry });

  await log('info', 'service', `Short URL created: ${code} valid until ${expiry}`);

  return {
    shortLink: `http://localhost:3000/${code}`,
    expiry: saved.expiry.toISOString()
  };
};

const resolveShortUrlService = async (shortcode) => {
  const found = await findByShortcode(shortcode);

  if (!found) {
    await log('error', 'repository', `Shortcode "${shortcode}" not found.`);
    throw { status: 404, message: 'Shortcode not found.' };
  }

  if (dayjs().isAfter(dayjs(found.expiry))) {
    await log('warn', 'service', `Shortcode "${shortcode}" expired.`);
    throw { status: 410, message: 'Shortlink expired.' };
  }

  await log('info', 'service', `Redirecting shortcode "${shortcode}".`);
  return found.url;
};

const getShortUrlStatsService = async (shortcode) => {
  const data = await Url.findOne({ shortcode });

  if (!data) {
    throw { status: 404, message: 'Shortcode not found.' };
  }

  return {
    originalUrl: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks.length,
    clickDetails: data.clicks
  };
};

module.exports = {
  createShortUrlService,
  resolveShortUrlService,
  trackClickService,
  getShortUrlStatsService
};
