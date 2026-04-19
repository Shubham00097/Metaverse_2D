import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./sockets/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const server = http.createServer(app);


const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.replace(/\/$/, "") : "*";

const io = new Server(server, {
    cors: {
        origin: [corsOrigin, "http://localhost:3000"],
        credentials: true
    }
})

if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in .env file");
    process.exit(1);
}

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





