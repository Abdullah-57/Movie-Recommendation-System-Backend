// import mongoose from "mongoose";

// // Define the Awards Schema
// const awardSchema = new mongoose.Schema({
//   movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
//   awardName: { type: String, required: true },
//   category: { type: String, required: true }, // e.g., "Best Picture", "Best Actor"
//   year: { type: Number, required: true },
//   result: { type: String, enum: ["Won", "Nominated"], required: true }, // Whether won or nominated
//   ceremony: { type: String }, // e.g., "Oscars", "Golden Globes"
// }, { timestamps: true });

// export default mongoose.model("Award", awardSchema);


import mongoose from "mongoose";

// Define the Awards Schema
const awardSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },  // Optional movieId
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "Crew" },  // Optional actorId
  awardName: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Best Picture", "Best Actor"
  year: { type: Number, required: true },
  result: { type: String, enum: ["Won", "Nominated"], required: true }, // Whether won or nominated
  ceremony: { type: String }, // e.g., "Oscars", "Golden Globes"
}, { timestamps: true });

export default mongoose.model("Award", awardSchema);
