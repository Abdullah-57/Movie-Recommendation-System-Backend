import Movie from "../models/Movie.js";
import Crew from "../models/Crew.js";
import Review from "../models/Review.js";

export const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({ message: "Movie added successfully", movie });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie updated successfully", updatedMovie });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};





export const searchMovies = async (req, res) => {
  const { title, genre, director, cast, writer, composer } = req.query;

  try {
    // Build the search criteria for Movie schema (title, genre)
    const searchCriteria = [];

    if (title) {
      searchCriteria.push({ title: { $regex: title, $options: 'i' } });
    }
    if (genre) {
      searchCriteria.push({ genre: { $regex: genre, $options: 'i' } });
    }

    // Find movies that match the title or genre
    const movies = await Movie.find({ $or: searchCriteria })
      .populate('director', 'name')
      .populate('cast', 'name');

    // Find crew members that match the director, cast, writer, or composer
    const crewSearch = [];

    if (director) {
      crewSearch.push({ name: { $regex: director, $options: 'i' }, role: 'Director' });
    }
    if (cast) {
      crewSearch.push({ name: { $regex: cast, $options: 'i' }, role: 'Actor' });
    }
    if (writer) {
      crewSearch.push({ name: { $regex: writer, $options: 'i' }, role: 'Writer' });
    }
    if (composer) {
      crewSearch.push({ name: { $regex: composer, $options: 'i' }, role: 'Composer' });
    }

    // Find crew members that match the search query
    const crewMembers = await Crew.find({ $or: crewSearch });

    // If any crew members are found, filter the movies where director or cast matches these crew members
    let filteredMovies = movies;
    if (crewMembers.length > 0) {
      filteredMovies = movies.filter(movie => {
        return movie.director && crewMembers.some(crew => crew._id.equals(movie.director._id)) ||
               movie.cast.some(actor => crewMembers.some(crew => crew._id.equals(actor._id)));
      });
    }

    res.status(200).json({
      results: filteredMovies,
      message: 'Search results fetched successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching search results' });
  }
};


export const filterMovies = async (req, res) => {
  const { averageRating, popularity, releaseYear } = req.query;

  const filter = {};

  // Handle filtering for averageRating, if provided
  if (averageRating) {
    const [value, comparison] = averageRating.split('_');
    if (comparison === 'gte') {
      filter.averageRating = { $gte: Number(value) };
    } else if (comparison === 'lte') {
      filter.averageRating = { $lte: Number(value) };
    } else if (comparison === 'exact') {
      filter.averageRating = Number(value);
    } else {
      return res.status(400).json({ message: "Invalid comparison type for averageRating" });
    }
  }

  // Handle filtering for popularity, if provided
  if (popularity) {
    const [value, comparison] = popularity.split('_');
    if (comparison === 'gte') {
      filter.popularity = { $gte: Number(value) };
    } else if (comparison === 'lte') {
      filter.popularity = { $lte: Number(value) };
    } else if (comparison === 'exact') {
      filter.popularity = Number(value);
    } else {
      return res.status(400).json({ message: "Invalid comparison type for popularity" });
    }
  }

  // Handle filtering for releaseYear, if provided
  if (releaseYear) {
    const [value, comparison] = releaseYear.split('_');
    if (comparison === 'gte') {
      filter.releaseYear = { $gte: Number(value) };
    } else if (comparison === 'lte') {
      filter.releaseYear = { $lte: Number(value) };
    } else if (comparison === 'exact') {
      filter.releaseYear = Number(value);
    } else {
      return res.status(400).json({ message: "Invalid comparison type for releaseYear" });
    }
  }

  try {
    // Query with the accumulated filter object
    const results = await Movie.find(filter)
      .populate("director", "name")
      .populate("cast", "name");

    // Check if no results are found
    if (results.length === 0) {
      return res.status(404).json({ message: "No movies found with the given criteria" });
    }

    // Send the filtered results
    res.status(200).json({ results, message: "Filtered results fetched successfully" });
  } catch (error) {
    console.error("Error filtering movies:", error);
    res.status(500).json({ message: "Error fetching filtered results", error: error.message });
  }
};


export const advancedFilterMovies = async (req, res) => {
  const { decade, country, language, keyword } = req.query;

  const filter = {};

  // Filter by decade (range of years from decade start to decade end)
  if (decade) filter.releaseYear = { $gte: Number(decade), $lt: Number(decade) + 10 };

  // Filter by country
  if (country) filter.country = country;

  // Filter by language
  if (language) filter.language = language;

  // Filter by keyword (handle multiple keywords in an array)
  if (keyword) {
    // Split keywords if multiple are provided in a comma-separated string
    const keywordsArray = keyword.split(',').map((kw) => kw.trim());
    filter.keywords = { $in: keywordsArray }; // Match any keyword in the array
  }

  try {
    // Query movies with the filter and populate director and cast fields
    const results = await Movie.find(filter)
      .populate("director", "name")
      .populate("cast", "name");

    res.status(200).json({ results, message: "Advanced filter results fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching advanced filter results" });
  }
};



export const getTopMovies = async (req, res) => {
  try {
    const { month, genre } = req.query;

    let query = {};
    if (month) {
      // Ensure month is parsed as a number (1-12)
      const numericMonth = parseInt(month, 10);
      if (numericMonth < 1 || numericMonth > 12) {
        return res.status(400).json({ message: "Invalid month. Provide a number between 1 and 12." });
      }

      query = {
        ...query,
        $expr: { $eq: [{ $month: "$releaseDate" }, numericMonth] },
      };
    }

    if (genre) {
      query = {
        ...query,
        genre: { $regex: genre, $options: "i" }, // Case-insensitive match
      };
    }

    // Fetch top movies
    const movies = await Movie.find(query)
      .sort({ popularity: -1 }) // Sort by popularity in descending order
      .limit(10); // Limit to top 10 movies

    if (!movies.length) {
      return res.status(404).json({ message: "No movies found for the given criteria." });
    }

    res.status(200).json(movies);
  } catch (error) {
    console.error("Error fetching top movies:", error);
    res.status(500).json({ message: "An error occurred while fetching top movies." });
  }
};

// Get reviews for a specific movie
export const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const reviews = await Review.find({ movieId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });  // Sort by most recent

    res.status(200).json({ reviews, message: "Reviews fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};