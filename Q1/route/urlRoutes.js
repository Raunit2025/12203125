const express = require('express');
const router = express.Router();

const {
  createShortUrl,
  resolveShortUrl,
  getShortUrlStats
} = require('../controller/urlController');

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', resolveShortUrl);

module.exports = router;
