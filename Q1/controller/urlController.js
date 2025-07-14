const {
  createShortUrlService,
  resolveShortUrlService,
  trackClickService,
  getShortUrlStatsService
} = require('../service/urlService');

const { log } = require('../handler/logger');

const createShortUrl = async (req, res) => {
  try {
    const body = req.body;
    const shortUrlData = await createShortUrlService(body);

    await log('info', 'controller', 'New short URL generated.');
    res.status(201).json(shortUrlData);
  } catch (e) {
    await log('error', 'controller', 'Something broke while creating short URL.');
    res.status(e.status || 500).json({ error: e.message });
  }
};

const resolveShortUrl = async (req, res) => {
  const code = req.params.shortcode;

  try {
    const originalUrl = await resolveShortUrlService(code);

    const ref = req.get('Referrer') || 'none';
    const ip = req.headers['x-forwarded-for'] || req.ip;

    await trackClickService(code, { referrer: ref, location: ip });

    res.redirect(originalUrl);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Oops, redirect failed' });
  }
};

const getShortUrlStats = async (req, res) => {
  const code = req.params.shortcode;

  try {
    const statsData = await getShortUrlStatsService(code);
    res.status(200).json(statsData);
  } catch (ex) {
    res.status(ex.status || 500).json({ error: ex.message || 'Error fetching stats' });
  }
};

module.exports = {
  createShortUrl,
  resolveShortUrl,
  getShortUrlStats
};
