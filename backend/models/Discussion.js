import mongoose from 'mongoose';

// Define the schema for a discussion post
const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Linking to the User schema
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  genre: {
    type: String,  // Genre for discussion categorization
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Optional: to link a discussion to a specific movie
  },
});

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;
