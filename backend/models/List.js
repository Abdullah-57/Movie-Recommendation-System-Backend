// models/List.js
import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Reference to movies
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to user
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users following this list
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);
export default List;
