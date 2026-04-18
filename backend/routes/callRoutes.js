import { io } from "socket.io-client";

const callRoutes = (app) => {
    const socket = io(process.env.SOCKET_URL);

    socket.emit("join-room", {
        roomId: "your_room_id",
        userId: "user1"
    });

    socket.emit("move", {
        roomId: "your_room_id",
        userId: "user1",
        x: 100,
        y: 200
    });

    socket.on("user-moved", (data) => {
        console.log("User moved:", data);
    });
}


export default callRoutes;