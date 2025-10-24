const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Search stories
// @route   GET /api/search/stories
// @access  Public
const searchStories = async (req, res) => {
  try {
    const { q, genre, status, author, page = 1, limit = 10 } = req.query;

    let query = {};

    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    // Filter by genre
    if (genre) {
      query.genres = { $in: [genre] };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by author
    if (author) {
      const user = await User.findOne({ name: { $regex: author, $options: 'i' } });
      if (user) {
        query.author = user._id;
      }
    }

    const skip = (page - 1) * limit;

    const stories = await Story.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Story.countDocuments(query);

    res.json({
      stories,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stories by genre
// @route   GET /api/search/genres/:genre
// @access  Public
const getStoriesByGenre = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const stories = await Story.find({ genres: req.params.genre })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Story.countDocuments({ genres: req.params.genre });

    res.json({
      stories,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular stories
// @route   GET /api/search/popular
// @access  Public
const getPopularStories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const stories = await Story.find({})
      .populate('author', 'name avatar')
      .sort({ views: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchStories,
  getStoriesByGenre,
  getPopularStories,
};
