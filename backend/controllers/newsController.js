// controllers/newsController.js
import News from "../models/News.js";

// Add a news article (Admin)
export const addNewsArticle = async (req, res) => {
  try {
    const { title, content, category, author, tags } = req.body;
    const newArticle = new News({ title, content, category, author, tags });
    await newArticle.save();
    res.status(201).json({ message: "Article added successfully", article: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Error adding article", error });
  }
};

// Get all news articles
export const getNewsArticles = async (req, res) => {
  try {
    const articles = await News.find().sort({ publicationDate: -1 }); // Sort by latest first
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

// Get news articles by category
export const getNewsByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const articles = await News.find({ category }).sort({ publicationDate: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles by category", error });
  }
};

// Search news articles by title, content, or tags
export const searchNewsArticles = async (req, res) => {
  const { query } = req.query;
  try {
    const articles = await News.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).sort({ publicationDate: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Error searching articles", error });
  }
};
