import Room from "../models/room-model.js";

// In-memory store of connected users per room
// Structure: { roomId: { socketId: { userId, username, color, x, y, peerId } } }
const rooms = {};

const socketHandler = (io) => {

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // 🔥 JOIN ROOM
        socket.on("join-room", async ({ roomId, userId, username, color, x, y }) => {
            // Store user data in memory
            if (!rooms[roomId]) rooms[roomId] = {};
            rooms[roomId][socket.id] = { userId, username, color, x, y, peerId: null };

            // Save roomId on socket for disconnect cleanup
            socket.roomId = roomId;
            socket.metaUserId = userId;

            // ✅ Join the actual Socket.io room
            socket.join(roomId);

            console.log(`✅ ${username} (${userId}) joined room ${roomId}`);

            // Sync activeUsers to MongoDB
            try {
                await Room.findByIdAndUpdate(roomId, {
                    $addToSet: { activeUsers: userId }
                });
            } catch (err) {
                console.error("Failed to update activeUsers on join:", err.message);
            }

            // Send current room state to the new joiner
            const usersInRoom = Object.values(rooms[roomId]);
            socket.emit("room-state", { users: usersInRoom });

            // Notify others in the SAME room
            socket.to(roomId).emit("user-joined", { userId, username, color, x, y });
        });

        // 🔥 SHARE PEER ID — for WebRTC signaling
        socket.on("share-peer-id", ({ userId, peerId }) => {
            const roomId = socket.roomId;
            console.log(`📡 ${userId} shared peerId: ${peerId}`);

            if (roomId && rooms[roomId] && rooms[roomId][socket.id]) {
                rooms[roomId][socket.id].peerId = peerId;
            }

            socket.to(roomId).emit("user-peer-id", { userId, peerId });

            // Send existing peer IDs to this user
            if (roomId && rooms[roomId]) {
                Object.values(rooms[roomId]).forEach((user) => {
                    if (user.userId !== userId && user.peerId) {
                        socket.emit("user-peer-id", {
                            userId: user.userId,
                            peerId: user.peerId,
                        });
                    }
                });
            }
        });

        // 🔥 MOVE EVENT
        socket.on("move", ({ roomId, userId, x, y }) => {
            if (rooms[roomId] && rooms[roomId][socket.id]) {
                rooms[roomId][socket.id].x = x;
                rooms[roomId][socket.id].y = y;
            }
            socket.to(roomId).emit("user-moved", { userId, x, y });
        });

        // 🔥 CHAT MESSAGE
        socket.on("send_message", (msg) => {
            const roomId = socket.roomId;
            if (roomId) {
                io.to(roomId).emit("receive_message", msg);
            }
        });

        // 🔥 EMOJI REACTION
        socket.on("emoji-reaction", ({ roomId, userId, emoji }) => {
            socket.to(roomId).emit("user-emoji", { userId, emoji });
        });

        // 🔥 CAM & MIC STATUS
        socket.on("cam-status", ({ roomId, userId, enabled }) => {
            if (roomId) socket.to(roomId).emit("user-cam-status", { userId, enabled });
        });

        socket.on("mic-status", ({ roomId, userId, enabled }) => {
            if (roomId) socket.to(roomId).emit("user-mic-status", { userId, enabled });
        });

        // 🔥 DISCONNECT — Clean up user from room
        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);

            const roomId = socket.roomId;
            const userId = socket.metaUserId;

            if (roomId && rooms[roomId]) {
                delete rooms[roomId][socket.id];

                // Notify others in the SAME room
                socket.to(roomId).emit("user-left", { userId });

                const remaining = Object.keys(rooms[roomId]).length;

                if (remaining === 0) {
                    // Last user left — delete room from memory AND database
                    delete rooms[roomId];
                    console.log(`🗑️ Room ${roomId} is empty — deleting from DB...`);
                    try {
                        await Room.findByIdAndDelete(roomId);
                        console.log(`✅ Room ${roomId} deleted from DB`);
                    } catch (err) {
                        console.error("Failed to delete empty room:", err.message);
                    }
                } else {
                    // Room still has users — just remove this user from activeUsers
                    try {
                        await Room.findByIdAndUpdate(roomId, {
                            $pull: { activeUsers: userId }
                        });
                    } catch (err) {
                        console.error("Failed to update activeUsers on leave:", err.message);
                    }
                }
            }
        });

    });

};

export default socketHandler;