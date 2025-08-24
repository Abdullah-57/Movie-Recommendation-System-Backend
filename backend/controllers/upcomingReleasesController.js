import Movie from "../models/Movie.js";
import Reminder from "../models/Reminder.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import nodeSchedule from "node-schedule";
import nodemailer from "nodemailer";

// Fetch upcoming releases
export const getUpcomingReleases = async (req, res) => {
  try {
    const today = new Date();
    const upcomingMovies = await Movie.find({ releaseDate: { $gt: today } }).sort("releaseDate");
    res.status(200).json({ success: true, data: upcomingMovies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set reminders for users
export const setReminder = async (req, res) => {
  const { userId, movieId, type } = req.body;

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    const reminderDate = type === "Trailer" ? new Date() : movie.releaseDate;

    const newReminder = new Reminder({ userId, movieId, type, reminderDate });
    await newReminder.save();

    res.status(201).json({ success: true, message: "Reminder set successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Scheduler for notifications
export const scheduleNotifications = () => {
  nodeSchedule.scheduleJob("* * * * *", async () => { // Runs every minute (for testing purposes)
    const now = new Date();

    const dueReminders = await Reminder.find({ reminderDate: { $lte: now } }).populate("userId movieId");

    for (const reminder of dueReminders) {
      // Create notification for dashboard
      const notificationContent = `Reminder: "${reminder.movieId.title}" ${reminder.type} is available!`;
      const newNotification = new Notification({
        userId: reminder.userId._id,
        content: notificationContent,
      });
      await newNotification.save();

      // Send email notification
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "your-email@gmail.com",
          pass: "your-email-password",
        },
      });

      await transporter.sendMail({
        from: "Movie App <no-reply@movieapp.com>",
        to: reminder.userId.email,
        subject: "Movie Reminder",
        text: notificationContent,
      });
        
    console.log(`Email sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // For Ethereal testin

      // Remove processed reminder
      await Reminder.findByIdAndDelete(reminder._id);
    }
  });
};





// Add a notification for a user
export const addNotification = async (req, res) => {
  try {
    const { name, message } = req.body;

    // Find user by username
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create and save the notification
    const notification = new Notification({
      userId: user._id,
      message,
    });
    await notification.save();

    res.status(201).json({ message: "Notification added successfully" });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).json({ message: "Error adding notification" });
  }
};

// Get notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    // Mark all notifications as read
    await Promise.all(
      notifications.map(async (notification) => {
        notification.read = true;
        await notification.save();
      })
    );

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
