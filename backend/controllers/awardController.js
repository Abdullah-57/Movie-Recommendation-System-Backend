import Award from "../models/Award.js";
import Movie from "../models/Movie.js";
import Crew from "../models/Crew.js";

// Function to add an award to a movie
// export const addAward = async (req, res) => {
//   try {
//     const { movieId, awardName, category, year, result, ceremony } = req.body;

//     const newAward = new Award({
//       movieId,
//       awardName,
//       category,
//       year,
//       result,
//       ceremony,
//     });

//     await newAward.save();
//     res.status(201).json({ message: "Award added successfully!", award: newAward });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error adding award", error: error.message });
//   }
// };


export const addAward = async (req, res) => {
  try {
    const { movieId, actorId, awardName, category, year, result, ceremony } = req.body;

    // Validate that either movieId or actorId is provided (but not both)
    if (!movieId && !actorId) {
      return res.status(400).json({ message: "Either movieId or actorId must be provided." });
    }

    if (movieId && actorId) {
      return res.status(400).json({ message: "Please provide either movieId or actorId, not both." });
    }

    // Create an award object
    const newAward = new Award({
      movieId: movieId || undefined,  // Use movieId if provided, else undefined
      actorId: actorId || undefined,  // Use actorId if provided, else undefined
      awardName,
      category,
      year,
      result,
      ceremony,
    });

    // Save the new award to the database
    await newAward.save();

    // If the award is for an actor, update the actor's "awards" field in the Crew schema
    if (actorId) {
      // Find the actor in the Crew collection and add the award name to the actor's awards list
      const actor = await Crew.findById(actorId);
      if (actor) {
        actor.awards.push(awardName);
        await actor.save();
      } else {
        return res.status(404).json({ message: "Actor not found." });
      }
    }

    // Send success response
    res.status(201).json({ message: "Award added successfully!", award: newAward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding award", error: error.message });
  }
};


// Function to get awards by movie
export const getAwardsByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const awards = await Award.find({ movieId }).populate("movieId");

    if (awards.length === 0) {
      return res.status(404).json({ message: "No awards found for this movie" });
    }

    res.status(200).json(awards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching awards", error: error.message });
  }
};
