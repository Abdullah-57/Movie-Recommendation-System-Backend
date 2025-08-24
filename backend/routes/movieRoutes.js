import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { addMovie, updateMovie, deleteMovie, searchMovies,
  filterMovies,
  advancedFilterMovies,
  getTopMovies,
  getMovieReviews, } from "../controllers/movieController.js";

const router = express.Router();

router.post("/", protect, adminOnly, addMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);


// Search
router.get("/search", searchMovies);

// Filter
router.get("/filter", filterMovies);

// Advanced Filter
router.get("/advanced-filter", advancedFilterMovies);

// Top Movies
router.get("/top", getTopMovies);

// Get reviews for a specific movie
router.get("/:movieId/reviews", getMovieReviews);

export default router;
