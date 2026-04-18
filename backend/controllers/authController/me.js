const me = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json({
      user: {
        userId: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar, // we use this for color
        position: req.user.position,
        currentRoom: req.user.currentRoom
      }
    });
  } catch (err) {
    console.error("ME ROUTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default me;
