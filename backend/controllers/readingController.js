const ReadingProgress = require('../models/ReadingProgress');
const Bookmark = require('../models/Bookmark');

// @desc    Get reading progress for a user
// @route   GET /api/reading/progress
// @access  Private
const getReadingProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ user: req.user._id })
      .populate('story', 'title coverImage')
      .populate('chapter', 'title chapterNumber');

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reading progress
// @route   PUT /api/reading/progress/:storyId/:chapterId
// @access  Private
const updateReadingProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    let readingProgress = await ReadingProgress.findOne({
      user: req.user._id,
      story: req.params.storyId,
      chapter: req.params.chapterId,
    });

    if (readingProgress) {
      readingProgress.progress = progress;
      if (progress >= 100) {
        readingProgress.completed = true;
      }
      await readingProgress.save();
    } else {
      readingProgress = new ReadingProgress({
        user: req.user._id,
        story: req.params.storyId,
        chapter: req.params.chapterId,
        progress,
        completed: progress >= 100,
      });
      await readingProgress.save();
    }

    res.json(readingProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookmarks
// @route   GET /api/reading/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('story', 'title coverImage author');

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a bookmark
// @route   POST /api/reading/bookmarks/:storyId
// @access  Private
const addBookmark = async (req, res) => {
  try {
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      story: req.params.storyId,
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Story already bookmarked' });
    }

    const bookmark = new Bookmark({
      user: req.user._id,
      story: req.params.storyId,
    });

    await bookmark.save();

    res.status(201).json({ message: 'Bookmark added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a bookmark
// @route   DELETE /api/reading/bookmarks/:storyId
// @access  Private
const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      story: req.params.storyId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.remove();

    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReadingProgress,
  updateReadingProgress,
  getBookmarks,
  addBookmark,
  removeBookmark,
};
