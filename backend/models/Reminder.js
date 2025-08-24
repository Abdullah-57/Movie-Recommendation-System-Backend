import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  type: { type: String, enum: ["Release", "Trailer"], required: true },
  reminderDate: { type: Date, required: true }, // Date to send the notification
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);
