// routes/listRoutes.js
import express from "express";
import {
  createList,
  getUserLists,
  followList,
  unfollowList,
  getPublicLists,
} from "../controllers/listController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new list
router.post("/", protect, createList);

// Route to get all lists created by the logged-in user
router.get("/", protect, getUserLists);

// Route to follow a list
router.post("/:listId/follow", protect, followList);

// Route to unfollow a list
router.delete("/:listId/unfollow", protect, unfollowList);

// Route to get all public lists
router.get("/discover", protect, getPublicLists);

export default router;
