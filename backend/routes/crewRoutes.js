import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { addCrewMember, updateCrewMember } from "../controllers/crewController.js";

const router = express.Router();

router.post("/", protect, adminOnly, addCrewMember);
router.put("/:id", protect, adminOnly, updateCrewMember);

export default router;
