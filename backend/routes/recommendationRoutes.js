import express from 'express';
import {
  getPersonalizedRecommendations,
  getSimilarTitles,
  getTrendingMovies,
  getTopRatedMovies,
} from '../controllers/recommendationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Fetch personalized recommendations for logged-in user
router.get('/personalized', protect, getPersonalizedRecommendations);

// Fetch similar titles for a movie
router.get('/similar/:movieId', getSimilarTitles);

// Fetch trending movies
router.get('/trending', getTrendingMovies);

// Fetch top-rated movies
router.get('/top-rated', getTopRatedMovies);

export default router;
