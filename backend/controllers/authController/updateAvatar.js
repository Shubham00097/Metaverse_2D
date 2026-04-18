import User from "../../models/user-model.js";

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ message: "Avatar color is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Avatar updated successfully", user });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default updateAvatar;
