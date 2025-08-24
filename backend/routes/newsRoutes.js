// routes/newsRoutes.js
import express from "express";
import { addNewsArticle, getNewsArticles, getNewsByCategory, searchNewsArticles } from "../controllers/newsController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js"; // assuming you have authentication middleware

const router = express.Router();

// Public routes
router.get("/", getNewsArticles);  // Get all articles
router.get("/category", getNewsByCategory); // Get articles by category
router.get("/search", searchNewsArticles); // Search articles by title, content, or tags

// Admin routes (authentication required)
router.post("/", protect, adminOnly, addNewsArticle); // Add a new article

export default router;
