// routes/reviewRoutes.js

import express from 'express';
import { addOrUpdateReview, getMovieReviews, getTopRatedReviews, getMostDiscussedReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add or update a review for a movie
router.post('/:movieId/review', protect, addOrUpdateReview);

// Get all reviews for a movie
router.get('/:movieId/reviews', getMovieReviews);

// Get top-rated reviews (rating 5) for a movie
router.get('/:movieId/reviews/top-rated', getTopRatedReviews);

// Get most-discussed reviews (longest reviews) for a movie
router.get('/:movieId/reviews/most-discussed', getMostDiscussedReviews);

export default router;
