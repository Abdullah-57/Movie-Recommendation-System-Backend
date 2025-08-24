// models/news.js
import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Movies', 'Actors', 'Upcoming Projects', 'Industry'], required: true },
  author: { type: String, required: true },
  publicationDate: { type: Date, default: Date.now },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("News", newsSchema);
