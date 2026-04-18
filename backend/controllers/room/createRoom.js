import Room from "../../models/room-model.js";
import crypto from "crypto";

export const createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name required" });
    }

    // Auto-generate passkey ONLY for private rooms
    let passkey = undefined;
    if (isPrivate) {
      passkey = crypto.randomBytes(3).toString("hex").toUpperCase();
    }

    const room = await Room.create({
      name,
      isPrivate: !!isPrivate,
      passkey,       // undefined for public rooms, sparse index handles it
      admin: req.user._id,
      members: [{
        user: req.user._id,
        role: "admin"
      }]
    });

    res.status(201).json({ message: "Room created", room });

  } catch (err) {
    console.error("CREATE ROOM ERROR:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Passkey collision, please try again" });
    }
    res.status(500).json({ message: "Server error" });
  }
};