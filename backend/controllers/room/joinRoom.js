import Room from "../../models/room-model.js";

export const joinRoom = async (req, res) => {
  try {
    const { roomId, passkey } = req.body;

    let room;

    if (passkey) {
      // Private room join — find by passkey
      room = await Room.findOne({ passkey: passkey.trim().toUpperCase() });
      if (!room) {
        return res.status(404).json({ message: "Room not found or invalid passkey" });
      }
    } else if (roomId) {
      // Public room join — find by ID
      room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      if (room.isPrivate) {
        return res.status(403).json({ message: "This room is private. A passkey is required." });
      }
    } else {
      return res.status(400).json({ message: "Provide a roomId or passkey" });
    }

    // Add member if not already in the room
    const alreadyMember = room.members.some(m =>
      m.user.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      room.members.push({ user: req.user._id });
      await room.save();
    }

    res.json({ message: "Joined room successfully", room });

  } catch (err) {
    console.error("JOIN ROOM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};