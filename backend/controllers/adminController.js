// adminController.js
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import Statistics from '../models/Statistics.js';
import Crew from '../models/Crew.js';
import mongoose from 'mongoose';

// Add a new movie to the database
export const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    res.status(500).json({ error: 'Error adding movie' });
  }
};

// Update an existing movie
export const updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMovie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie });
  } catch (error) {
    res.status(500).json({ error: 'Error updating movie' });
  }
};

// Delete a movie from the database
export const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting movie' });
  }
};


// Moderate a review
export const moderateReview = async (req, res) => {
  try {
    // Check if the review ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid review ID format' });
    }

    // Find the review by ID
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Toggle review approval status
    review.approved = !review.approved;
    await review.save();

    res.status(200).json({ message: 'Review moderation updated', review });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error moderating review' });
  }
};


// Get site statistics for the admin
export const getStatistics = async (req, res) => {
  try {
    // Most Popular Movies (by average rating or number of reviews)
    const mostPopularMovies = await Movie.aggregate([
      {
        $lookup: {
          from: 'reviews',  // Assuming reviews are stored in a separate 'reviews' collection
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews'
        }
      },
      {
        $project: {
          title: 1,
          averageRating: 1,
          reviewCount: { $size: '$reviews' },
          popularity: 1
        }
      },
      { $sort: { popularity: -1, reviewCount: -1, averageRating: -1 } }, // Sort by popularity, reviews, and average rating
      { $limit: 5 }  // Get the top 5 popular movies
    ]);

    // Most Reviewed Movies
    const mostReviewedMovies = await Movie.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews'
        }
      },
      {
        $project: {
          title: 1,
          reviewCount: { $size: '$reviews' }
        }
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 5 }
    ]);

    // Trending Genres (most popular genres based on the number of movies)
    const trendingGenres = await Movie.aggregate([
      { $unwind: "$genre" },
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Most Active Users (based on the number of reviews they posted)
    const mostActiveUsers = await Review.aggregate([
      {
        $group: {
          _id: "$userId",  // Assuming reviews have a userId field
          reviewCount: { $sum: 1 }
        }
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 5 }
    ]);

    // Most Searched Actors (based on crew's appearances in movies)
    const mostSearchedActors = await Crew.aggregate([
      { $match: { role: "Actor" } }, // Only consider actors
      {
        $lookup: {
          from: "movies", 
          localField: "_id",
          foreignField: "cast",
          as: "movies"
        }
      },
      {
        $project: {
          name: 1,
          movieCount: { $size: "$movies" }
        }
      },
      { $sort: { movieCount: -1 } },
      { $limit: 5 }
    ]);

    // Send the statistics response
    res.status(200).json({
      mostPopularMovies,
      mostReviewedMovies,
      trendingGenres,
      mostActiveUsers,
      mostSearchedActors
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving statistics' });
  }
};


export const getInsights = async (req, res) => {
  try {
    // Trending genres (e.g., movies with the highest number of views or popularity)
    const trendingGenres = await Movie.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", movieCount: { $sum: 1 } } },
      { $sort: { movieCount: -1 } },
      { $limit: 5 }
    ]);

    // Trending actors (e.g., actors in movies with the highest number of reviews)
    const trendingActors = await Crew.aggregate([
      { $match: { role: "Actor" } },
      { $lookup: { from: "movies", localField: "_id", foreignField: "cast", as: "movies" } },
      { $unwind: "$movies" },
      { $lookup: { from: "reviews", localField: "movies._id", foreignField: "movie", as: "reviews" } },
      { $group: { _id: "$name", reviewCount: { $sum: { $size: "$reviews" } } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 5 }
    ]);

    // User engagement patterns (based on the number of reviews and interactions)
    const userEngagement = await Review.aggregate([
      {
        $group: {
          _id: "$userId",  // Grouping by user ID
          reviewCount: { $sum: 1 },
          averageRating: { $avg: "$rating" }  // Calculating average rating given by user
        }
      },
      { $sort: { reviewCount: -1 } },  // Sorting by most active users
      { $limit: 5 }  // Get the top 5 most active users
    ]);

    // Send the response containing trending genres, actors, and user engagement
    res.status(200).json({
      trendingGenres,
      trendingActors,
      userEngagement
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving insights' });
  }
};

