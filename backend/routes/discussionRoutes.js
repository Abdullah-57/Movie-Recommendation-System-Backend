import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';  // Authentication middleware
import { createDiscussion, getAllDiscussions, addComment, getCommentsForDiscussion } from '../controllers/discussionController.js';

const router = express.Router();

// 1. Create a new discussion
router.post('/create', protect, createDiscussion);

// 2. Fetch all discussions (optional filter by genre or movieId)
router.get('/', getAllDiscussions);

// 3. Add comment to a discussion
router.post('/comment/:id', protect, addComment);

// 4. Fetch all comments for a specific discussion
router.get('/comments/:id', getCommentsForDiscussion);

export default router;
