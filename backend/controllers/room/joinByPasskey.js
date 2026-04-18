import Room from "../../models/room-model.js";

export const joinByPasskey = async (req, res) => {
  try {
    const { passkey } = req.body;

    if (!passkey) {
      return res.status(400).json({ message: "Passkey is required" });
    }

    const room = await Room.findOne({ passkey: passkey.trim().toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: "Invalid passkey or room not found" });
    }

    // Check if user is already a member
    const alreadyMember = room.members.some(m =>
      m.user.toString() === req.user._id.toString()
    );

    if (!alreadyMember) {
      room.members.push({ user: req.user._id });
      await room.save();
    }

    res.json({ message: "Joined room successfully", room });

  } catch (err) {
    console.error("JOIN BY PASSKEY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
