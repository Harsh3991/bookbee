const express = require('express');
const router = express.Router();
const {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
} = require('../controllers/chapterController');
const { protect } = require('../middleware/authMiddleware');
const { validateChapter } = require('../middleware/validationMiddleware');

router.get('/:storyId/chapters', getChapters);
router.get('/:id', getChapterById);
router.post('/:storyId/chapters', protect, validateChapter, createChapter);
router.put('/:id', protect, updateChapter);
router.delete('/:id', protect, deleteChapter);
router.put('/:id/publish', protect, publishChapter);

module.exports = router;
