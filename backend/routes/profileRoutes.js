import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile, manageWishlist } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.post("/wishlist", protect, manageWishlist);

export default router;
