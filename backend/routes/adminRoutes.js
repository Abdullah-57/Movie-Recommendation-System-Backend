// adminRoutes.js
import express from 'express';
import { addMovie, updateMovie, deleteMovie, moderateReview, getStatistics, getInsights } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Movie Management Routes
router.post('/movie', protect , adminOnly, addMovie); // Add Movie
router.put('/movie/:id', protect, adminOnly, updateMovie); // Update Movie
router.delete('/movie/:id', protect, adminOnly, deleteMovie); // Delete Movie

// Review Moderation Routes
router.put('/review/:id/moderate', protect, adminOnly, moderateReview); // Moderate Review

// Admin Insights and Statistics
router.get('/statistics', protect, adminOnly, getStatistics); // Get Site Statistics
router.get('/insights', protect, adminOnly, getInsights); // Get Admin Insights

export default router;
