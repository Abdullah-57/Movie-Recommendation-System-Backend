import express from "express";
import { updateBoxOffice } from "../controllers/boxOfficeController.js";

const router = express.Router();

// Route to update box office information
router.post("/update", updateBoxOffice);

export default router;
