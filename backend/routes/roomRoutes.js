import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import { createRoom } from "../controllers/room/createRoom.js";
import { leaveRoom } from "../controllers/room/leaveRoom.js";
import { getRoom } from "../controllers/room/getRoom.js";
import { getPublicRooms } from "../controllers/room/getAllRooms.js";
import { joinRoom } from "../controllers/room/joinRoom.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);       // Create room (public or private)
router.get("/public", authMiddleware, getPublicRooms);   // List public rooms
router.post("/join", authMiddleware, joinRoom);           // Join by roomId (public) or passkey (private)
router.post("/leave/:roomId", authMiddleware, leaveRoom);
router.get("/:roomId", authMiddleware, getRoom);

export default router;