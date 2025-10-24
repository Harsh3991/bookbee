const express = require('express');
const router = express.Router();
const {
  searchStories,
  getStoriesByGenre,
  getPopularStories,
} = require('../controllers/searchController');

router.get('/stories', searchStories);
router.get('/genres/:genre', getStoriesByGenre);
router.get('/popular', getPopularStories);

module.exports = router;
