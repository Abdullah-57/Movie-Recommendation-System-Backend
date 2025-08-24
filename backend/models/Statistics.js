// statisticsModel.js
import mongoose from 'mongoose';

const statisticsSchema = new mongoose.Schema({
  totalMovies: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
}, { timestamps: true });

const Statistics = mongoose.model('Statistics', statisticsSchema);
export default Statistics;
