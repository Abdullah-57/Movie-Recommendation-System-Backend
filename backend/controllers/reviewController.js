// controllers/reviewController.js

import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';

import mongoose from "mongoose";


// Add or Update Review
export const addOrUpdateReview = async (req, res) => {
  const { movieId } = req.params;
  const { rating, reviewText } = req.body;
  const userId = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the user already reviewed the movie
    const existingReview = await Review.findOne({ movieId, userId });

    if (existingReview) {
      // Update the review
      existingReview.rating = rating;
      existingReview.reviewText = reviewText;
      await existingReview.save();
      return res.status(200).json({ message: 'Review updated successfully' });
    } else {
      // Add a new review
      const newReview = new Review({
        movieId,
        userId,
        rating,
        reviewText,
      });

      await newReview.save();

      // Update the average rating of the movie
      const reviews = await Review.find({ movieId });
      const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

      movie.averageRating = averageRating;
      await movie.save();

      return res.status(201).json({ message: 'Review added successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch Reviews for a Movie
export const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const reviews = await Review.find({ movieId }).populate('userId', 'name email');
    const averageRating = movie.averageRating;

    res.status(200).json({
      reviews,
      averageRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch Top-Rated Reviews for a Movie
export const getTopRatedReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Fetch reviews with rating 5 and sort by rating descending
    const topRatedReviews = await Review.find({ movieId, rating: 5 })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); // sort by most recent review

    res.status(200).json({
      topRatedReviews,
      message: 'Top-rated reviews fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const getMostDiscussedReviews = async (req, res) => {
//   const { movieId } = req.params;

//   try {
//     const movie = await Movie.findById(movieId);
//     if (!movie) {
//       return res.status(404).json({ message: 'Movie not found' });
//     }

//     // Use aggregation to sort reviews by length of reviewText (most-discussed)
//     const mostDiscussedReviews = await Review.aggregate([
//       { $match: { movieId: movieId } }, // Match the reviews for the specific movie
//       {
//         $addFields: {
//           reviewTextLength: { $strLenCP: "$reviewText" } // Add a new field with the length of reviewText
//         }
//       },
//       { $sort: { reviewTextLength: -1 } }, // Sort by reviewTextLength in descending order (longest first)
//       {
//         $lookup: {
//           from: 'users', // Assuming you have a 'users' collection
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'userId'
//         }
//       },
//       { $unwind: "$userId" }, // Unwind the 'userId' array to get a single user object
//       { $project: { "userId.name": 1, "userId.email": 1, reviewText: 1, reviewTextLength: 1 } } // Project the necessary fields
//     ]);

//     res.status(200).json({
//       mostDiscussedReviews,
//       message: 'Most-discussed reviews fetched successfully',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const { ObjectId } = mongoose.Types;

export const getMostDiscussedReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Ensure movieId is a valid ObjectId
    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID format" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Use aggregation to sort reviews by length of reviewText (most-discussed)
    const mostDiscussedReviews = await Review.aggregate([
      { $match: { movieId: new ObjectId(movieId) } }, // Match reviews for the specific movie
      {
        $addFields: {
          reviewTextLength: { $strLenCP: "$reviewText" }, // Add a field for reviewText length
        },
      },
      { $sort: { reviewTextLength: -1 } }, // Sort by reviewText length in descending order
      {
        $lookup: {
          from: "users", // Assuming 'users' collection exists
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Flatten the user array
      {
        $project: {
          "user.name": 1,
          "user.email": 1,
          reviewText: 1,
          reviewTextLength: 1,
        },
      },
    ]);

    res.status(200).json({
      mostDiscussedReviews,
      message: "Most-discussed reviews fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
