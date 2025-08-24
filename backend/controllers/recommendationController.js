import Movie from '../models/Movie.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// Get personalized recommendations
export const getPersonalizedRecommendations = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

      const favoriteGenres = user.preferences?.genres || [];
      console.log(favoriteGenres);
    const ratedMovies = await Review.find({ userId }).distinct('movieId');
    
    const recommendations = await Movie.find({
      genre: { $in: favoriteGenres },
      _id: { $nin: ratedMovies },
    })
      .limit(10)
      .sort({ averageRating: -1 }); // Recommend by rating in the genre

    res.status(200).json({
      recommendations,
      message: 'Personalized recommendations fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get similar titles
export const getSimilarTitles = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const similarTitles = await Movie.find({
      _id: { $ne: movieId },
      $or: [
        { genre: { $in: movie.genre } },
        { director: movie.director },
      ],
    })
      .limit(5)
      .sort({ popularity: -1 }); // Sort by popularity

    res.status(200).json({
      similarTitles,
      message: 'Similar titles fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending movies
export const getTrendingMovies = async (req, res) => {
  try {
    const trendingMovies = await Movie.find()
      .sort({ popularity: -1 })
      .limit(10);

    res.status(200).json({
      trendingMovies,
      message: 'Trending movies fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get top-rated movies
export const getTopRatedMovies = async (req, res) => {
  try {
    const topRatedMovies = await Movie.find()
      .sort({ averageRating: -1 })
      .limit(10);

    res.status(200).json({
      topRatedMovies,
      message: 'Top-rated movies fetched successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
