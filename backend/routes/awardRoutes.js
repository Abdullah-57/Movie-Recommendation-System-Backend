import express from "express";
import { addAward, getAwardsByMovie } from "../controllers/awardController.js";

const router = express.Router();

// Route to add a new award
router.post("/add", addAward);

// Route to get awards by movie ID
router.get("/:movieId", getAwardsByMovie);

export default router;
