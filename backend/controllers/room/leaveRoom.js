import Room from "../../models/room-model.js";

export const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    room.members = room.members.filter(
      m => m.user.toString() !== req.user._id.toString()
    );

    await room.save();

    res.json({ message: "Left room" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};