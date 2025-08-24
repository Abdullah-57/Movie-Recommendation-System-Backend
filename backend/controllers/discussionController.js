import Discussion from '../models/Discussion.js';
import Comment from '../models/Comment.js';

// 1. Create a new discussion
const createDiscussion = async (req, res) => {
  const { title, content, genre, movieId } = req.body;

  try {
    const discussion = new Discussion({
      title,
      content,
      author: req.user._id,
      genre,
      movieId,
    });

    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: 'Error creating discussion', error });
  }
};

// 2. Fetch all discussions (optional filter by genre or movieId)
const getAllDiscussions = async (req, res) => {
  const { genre, movieId } = req.query;

  const filter = {};
  if (genre) filter.genre = genre;
  if (movieId) filter.movieId = movieId;

  try {
    const discussions = await Discussion.find(filter)
      .populate('author', 'name')
      .populate('movieId');
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discussions', error });
  }
};

// 3. Add comment to a discussion
const addComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  try {
    const comment = new Comment({
      content,
      author: req.user._id,
      discussionId: id,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};

// 4. Fetch all comments for a specific discussion
const getCommentsForDiscussion = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ discussionId: id })
      .populate('author', 'name');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

export { createDiscussion, getAllDiscussions, addComment, getCommentsForDiscussion };
