import User from "../models/User.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { name, preferences } = req.body;

  const user = await User.findById(req.user.id);
  if (user) {
    user.name = name || user.name;
    user.preferences = preferences || user.preferences;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const manageWishlist = async (req, res) => {
  const { movieId, action } = req.body;

  const user = await User.findById(req.user.id);
  if (user) {
    if (action === "add") {
      user.wishlist.push(movieId);
    } else if (action === "remove") {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== movieId);
    }
    await user.save();
    res.json({ message: `Movie ${action}ed successfully`, wishlist: user.wishlist });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
