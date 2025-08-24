// controllers/listController.js
import List from "../models/List.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// Create a new list
export const createList = async (req, res) => {
  const { name, description, movies } = req.body;

  try {
    const list = new List({
      name,
      description,
      movies,
      createdBy: req.user.id,
    });

    await list.save();

    res.status(201).json({ message: "List created successfully", list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a user's custom lists
export const getUserLists = async (req, res) => {
  try {
    const lists = await List.find({ createdBy: req.user.id }).populate("movies", "title genre");
    res.status(200).json({ message: "User lists fetched successfully", lists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Follow or save a list
export const followList = async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.followers.includes(req.user.id)) {
      return res.status(400).json({ message: "You are already following this list" });
    }

    list.followers.push(req.user.id);
    await list.save();

    res.status(200).json({ message: "List followed successfully", list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a list
export const unfollowList = async (req, res) => {
  const { listId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    list.followers = list.followers.filter((id) => id.toString() !== req.user.id);
    await list.save();

    res.status(200).json({ message: "List unfollowed successfully", list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all public lists (discover lists)
export const getPublicLists = async (req, res) => {
  try {
    const lists = await List.find()
      .populate("movies", "title genre")
      .populate("createdBy", "name");
    res.status(200).json({ message: "Public lists fetched successfully", lists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
