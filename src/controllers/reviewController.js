const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

/**
 * GET /api/restaurants/:restaurantId/reviews
 * Query: page, limit
 */
exports.getReviews = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const filter = { restaurantId: req.params.restaurantId };

    const [data, total] = await Promise.all([
      Review.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    res.json({ page, limit, total, totalPages: Math.ceil(total / limit), data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/restaurants/:restaurantId/reviews
 * Body: { author, rating, comment }
 */
exports.createReview = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const review = new Review({ ...req.body, restaurantId });
    const saved = await review.save();

    // Recalculate average rating
    const allReviews = await Review.find({ restaurantId });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: allReviews.length,
    });

    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/restaurants/:restaurantId/reviews/:reviewId
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      restaurantId: req.params.restaurantId,
    });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate average rating after deletion
    const allReviews = await Review.find({ restaurantId: req.params.restaurantId });
    const updateData =
      allReviews.length > 0
        ? {
            rating: Math.round(
              (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length) * 10
            ) / 10,
            reviewCount: allReviews.length,
          }
        : { rating: 0, reviewCount: 0 };

    await Restaurant.findByIdAndUpdate(req.params.restaurantId, updateData);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
