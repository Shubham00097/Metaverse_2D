import Room from "../../models/room-model.js";

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate("members.user", "username email");

    res.json(room);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};