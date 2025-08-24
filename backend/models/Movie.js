import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: String, required: true }],
  director: { type: mongoose.Schema.Types.ObjectId, ref: "Crew", required: true },
  cast: [{ type: mongoose.Schema.Types.ObjectId, ref: "Crew" }],
  releaseDate: { type: Date, required: true },
  runtime: { type: Number, required: true }, // in minutes
  synopsis: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
  trivia: [{ type: String }],
  goofs: [{ type: String }],
  soundtrack: [{ type: String }],
  ageRating: { type: String, enum: ["G", "PG", "PG-13", "R", "NC-17"], required: true },
  parentalGuidance: { type: String },
  popularity: { type: Number, default: 0 },
  releaseYear: { type: Number, required: true },
  country: { type: String },
  language: { type: String },
  keywords: { type: [String] },
  boxOffice: {
    openingWeekend: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    internationalRevenue: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);


