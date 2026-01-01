const express = require('express');
const router = express.Router();
const {
  getReadingProgress,
  updateReadingProgress,
  getBookmarks,
  addBookmark,
  removeBookmark,
  deleteReadingProgress,
} = require('../controllers/readingController');
const { protect } = require('../middleware/authMiddleware');

console.log('Reading routes being initialized...');

router.get('/progress', protect, getReadingProgress);
router.put('/progress/:storyId/:chapterId', protect, updateReadingProgress);
router.delete('/progress/:progressId', protect, deleteReadingProgress);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:storyId', protect, addBookmark);
router.delete('/bookmarks/:storyId', protect, removeBookmark);

console.log('Reading routes registered');

module.exports = router;
