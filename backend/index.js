import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import app from "./app.js"
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./sockets/index.js";


dotenv.config()

const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

connectDB().then(() => {
    console.log("MongoDB Connected ✅")
    // app.listen(process.env.PORT, () => {
    //     console.log(`Example app listening on port ${process.env.PORT}`)
    // })
    socketHandler(io)
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Sockets running on port ${PORT}`)
    })

}).catch((err) => {
    console.log("MongoDB Error ❌", err)
    process.exit(1)
});





