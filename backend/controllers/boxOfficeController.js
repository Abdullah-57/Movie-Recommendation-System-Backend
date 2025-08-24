import Movie from "../models/Movie.js";

// Function to update box office earnings
export const updateBoxOffice = async (req, res) => {
  try {
    const { movieId, openingWeekend, totalEarnings, internationalRevenue } = req.body;

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movie.boxOffice.openingWeekend = openingWeekend;
    movie.boxOffice.totalEarnings = totalEarnings;
    movie.boxOffice.internationalRevenue = internationalRevenue;

    await movie.save();
    res.status(200).json({ message: "Box office information updated", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating box office information", error: error.message });
  }
};
