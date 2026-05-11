const express = require('express');//URL definition
const router = express.Router();

const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');

const {
  getReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');

// Restaurant CRUD
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', createRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

// restaurant door bairlah review
router.get('/:restaurantId/reviews', getReviews);
router.post('/:restaurantId/reviews', createReview);
router.delete('/:restaurantId/reviews/:reviewId', deleteReview);

module.exports = router;
