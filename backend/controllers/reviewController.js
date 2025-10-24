const Review = require('../models/Review');
const Story = require('../models/Story');

// @desc    Get reviews for a story
// @route   GET /api/stories/:storyId/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ story: req.params.storyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/stories/:storyId/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existingReview = await Review.findOne({
      user: req.user._id,
      story: req.params.storyId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this story' });
    }

    const review = new Review({
      user: req.user._id,
      story: req.params.storyId,
      rating,
      comment,
    });

    await review.save();

    // Update story rating
    const reviews = await Review.find({ story: req.params.storyId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Story.findByIdAndUpdate(req.params.storyId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    // Update story rating
    const reviews = await Review.find({ story: review.story });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Story.findByIdAndUpdate(review.story, {
      rating: avgRating,
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Update story rating
    const reviews = await Review.find({ story: review.story });
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await Story.findByIdAndUpdate(review.story, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
