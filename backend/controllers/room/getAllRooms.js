import Room from "../../models/room-model.js";

export const getPublicRooms = async (req, res) => {
  try {
    // Fetch only active, public rooms sorted by most recent
    const rooms = await Room.find({ isActive: true, isPrivate: false })
      .select("name description activeUsers members createdAt")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (err) {
    console.error("Error fetching public rooms:", err);
    res.status(500).json({ message: "Server error" });
  }
};
