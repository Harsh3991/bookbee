const Story = require('../models/Story');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find({})
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Story.countDocuments();

    res.json({
      stories,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('likes', 'name');

    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a story
// @route   POST /api/stories
// @access  Private
const createStory = async (req, res) => {
  try {
    const { title, description, genres, tags } = req.body;

    const story = new Story({
      title,
      description,
      genres,
      tags,
      author: req.user._id,
    });

    const createdStory = await story.save();
    await createdStory.populate('author', 'name avatar');

    res.status(201).json(createdStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a story
// @route   PUT /api/stories/:id
// @access  Private
const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    story.title = req.body.title || story.title;
    story.description = req.body.description || story.description;
    story.genres = req.body.genres || story.genres;
    story.tags = req.body.tags || story.tags;
    story.status = req.body.status || story.status;

    const updatedStory = await story.save();
    await updatedStory.populate('author', 'name avatar');

    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await story.remove();
    res.json({ message: 'Story removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload cover image
// @route   POST /api/stories/:id/cover
// @access  Private
const uploadCover = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.path, 'covers');

    if (story.coverImage) {
      const publicId = story.coverImage.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    }

    story.coverImage = result.url;
    await story.save();

    res.json({ coverImage: result.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  uploadCover,
};
