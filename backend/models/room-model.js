import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({

  // 🏷️ BASIC INFO
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  // 🔐 ACCESS CONTROL
  isPrivate: {
    type: Boolean,
    default: false
  },

  passkey: {
    type: String,
    unique: true,
    sparse: true
  },

  // 👑 ADMIN
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 👥 MEMBERS
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    role: {
      type: String,
      enum: ["admin", "moderator", "member"],
      default: "member"
    },

    joinedAt: {
      type: Date,
      default: Date.now
    },

    // 🎯 POSITION INSIDE ROOM (IMPORTANT)
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },

    isMuted: {
      type: Boolean,
      default: false
    }

  }],

  // 🗺️ MAP / WORLD SETTINGS
  map: {
    type: String, // map id / asset name
    default: "default-map"
  },

  width: {
    type: Number,
    default: 1000
  },

  height: {
    type: Number,
    default: 1000
  },

  // 🎤 INTERACTION SETTINGS
  interactionRadius: {
    type: Number,
    default: 50 // distance for video/chat trigger
  },

  // 🔌 REAL-TIME TRACKING
  activeUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  // 💬 CHAT SETTINGS
  allowChat: {
    type: Boolean,
    default: true
  },

  allowVoice: {
    type: Boolean,
    default: true
  },

  allowVideo: {
    type: Boolean,
    default: true
  },

  // 📊 ROOM STATUS
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Room", roomSchema);