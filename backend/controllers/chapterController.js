const Chapter = require('../models/Chapter');
const Story = require('../models/Story');

// @desc    Get all chapters for a story
// @route   GET /api/stories/:storyId/chapters
// @access  Public
const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find({ story: req.params.storyId, published: true })
      .sort({ chapterNumber: 1 });

    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single chapter
// @route   GET /api/chapters/:id
// @access  Public
const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('story', 'title author');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (!chapter.published && (!req.user || chapter.story.author.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a chapter
// @route   POST /api/stories/:storyId/chapters
// @access  Private
const createChapter = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, content } = req.body;

    // Auto-assign chapterNumber
    const lastChapter = await Chapter.findOne({ story: req.params.storyId }).sort({ chapterNumber: -1 });
    const chapterNumber = lastChapter ? lastChapter.chapterNumber + 1 : 1;

    const chapter = new Chapter({
      story: req.params.storyId,
      title,
      content,
      chapterNumber,
    });

    const createdChapter = await chapter.save();

    res.status(201).json(createdChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a chapter
// @route   PUT /api/chapters/:id
// @access  Private
const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('story');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    chapter.title = req.body.title || chapter.title;
    chapter.content = req.body.content || chapter.content;
    chapter.chapterNumber = req.body.chapterNumber || chapter.chapterNumber;

    const updatedChapter = await chapter.save();

    res.json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a chapter
// @route   DELETE /api/chapters/:id
// @access  Private
const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('story');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await chapter.remove();

    res.json({ message: 'Chapter removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish a chapter
// @route   PUT /api/chapters/:id/publish
// @access  Private
const publishChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('story');

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    chapter.published = true;
    await chapter.save();

    res.json({ message: 'Chapter published' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
  publishChapter,
};
