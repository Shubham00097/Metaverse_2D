import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // 🔐 AUTH
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: String,
  verificationTokenExpiry: Date,

  // 🔁 TOKENS (for your flowchart)
  refreshToken: {
    type: String
  },

  // 🎭 PROFILE
  avatar: {
    type: String, // URL or sprite id
    default: "default-avatar.png"
  },

  bio: String,

  // 🧭 REAL-TIME POSITION (IMPORTANT FOR 2D METAVERSE)
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },

  currentRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    default: null
  },

  // 🟢 ONLINE PRESENCE
  isOnline: {
    type: Boolean,
    default: false
  },

  socketId: String,

  lastSeen: {
    type: Date,
    default: Date.now
  },

  // 💬 SOCIAL / INTERACTION
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  // 🎤 VOICE / VIDEO STATE
  isInCall: {
    type: Boolean,
    default: false
  },

  callRoomId: {
    type: String
  },

  // 📊 OPTIONAL ANALYTICS
  loginHistory: [{
    ip: String,
    date: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

export default mongoose.model("User", userSchema);