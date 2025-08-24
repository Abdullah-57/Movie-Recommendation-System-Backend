import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import crewRoutes from "./routes/crewRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import recommendationRoutes from './routes/recommendationRoutes.js';
import listRoutes from "./routes/listRoutes.js";
import upcomingReleasesRoutes from "./routes/upcomingReleasesRoutes.js";
import newsRoutes from "./routes/newsRoutes.js"; 
import awardRoutes from "./routes/awardRoutes.js";
import boxOfficeRoutes from "./routes/boxOfficeRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { scheduleNotifications } from "./controllers/upcomingReleasesController.js";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/crew", crewRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/upcoming-releases", upcomingReleasesRoutes);
app.use("/api/news", newsRoutes); 
app.use("/api/awards", awardRoutes);
app.use("/api/boxoffice", boxOfficeRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/admin", adminRoutes);
scheduleNotifications(); // Start the scheduler

// Database Connection
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("DB connection error:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));