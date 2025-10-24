const express = require('express');
const router = express.Router();
const {
  getReadingProgress,
  updateReadingProgress,
  getBookmarks,
  addBookmark,
  removeBookmark,
} = require('../controllers/readingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/progress', protect, getReadingProgress);
router.put('/progress/:storyId/:chapterId', protect, updateReadingProgress);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:storyId', protect, addBookmark);
router.delete('/bookmarks/:storyId', protect, removeBookmark);

module.exports = router;
