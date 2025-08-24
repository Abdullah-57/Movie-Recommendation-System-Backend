import mongoose from "mongoose";

const crewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Actor", "Director", "Writer", "Composer"], required: true },
  biography: { type: String },
  filmography: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  awards: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Crew", crewSchema);
