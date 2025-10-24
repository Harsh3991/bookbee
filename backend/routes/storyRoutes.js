const express = require('express');
const router = express.Router();
const {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  uploadCover,
  getUserStories,
  likeStory,
  unlikeStory,
} = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');
const { validateStory } = require('../middleware/validationMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/', protect, validateStory, createStory);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.post('/:id/cover', protect, upload.single('cover'), uploadCover);
router.get('/user/:userId', getUserStories);
router.post('/:id/like', protect, likeStory);
router.delete('/:id/like', protect, unlikeStory);

module.exports = router;
