import express from "express";
import { getUpcomingReleases, setReminder, addNotification, getNotifications } from "../controllers/upcomingReleasesController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/upcoming", getUpcomingReleases); // Get upcoming movies
router.post("/reminder", setReminder); // Set a reminder
// Route to add a notification (admin-only route)
router.post("/add", protect, adminOnly, addNotification);

// Route to get notifications for the logged-in user
router.get("/", protect, getNotifications);



export default router;


