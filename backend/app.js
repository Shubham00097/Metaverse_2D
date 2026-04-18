import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import callRoutes from './routes/callRoutes.js'

dotenv.config()
const app = express();

// Handle CORS carefully for production
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.replace(/\/$/, "") : "*";

app.use(cors({
    origin: [corsOrigin, "http://localhost:3000"], // Allow both production and local dev
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Metaverse 2D - Server Live</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --bg-color: #0f172a;
                    --text-color: #f8fafc;
                    --accent-color: #38bdf8;
                    --secondary-color: #818cf8;
                }
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Outfit', sans-serif;
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    overflow: hidden;
                    background: radial-gradient(circle at top right, #1e293b, #0f172a);
                }
                .container {
                    text-align: center;
                    padding: 3rem;
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(12px);
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    animation: fadeIn 0.8s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(34, 197, 94, 0.1);
                    color: #4ade80;
                    padding: 0.5rem 1.25rem;
                    border-radius: 9999px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(74, 222, 128, 0.2);
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #4ade80;
                    border-radius: 50%;
                    margin-right: 8px;
                    box-shadow: 0 0 12px #4ade80;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
                }
                h1 {
                    font-size: 3rem;
                    font-weight: 600;
                    margin: 0;
                    background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                p {
                    color: #94a3b8;
                    font-size: 1.125rem;
                    margin-top: 1rem;
                }
                .footer {
                    margin-top: 2rem;
                    font-size: 0.875rem;
                    color: #64748b;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status-badge">
                    <div class="status-dot"></div>
                    SYSTEM OPERATIONAL
                </div>
                <h1>Metaverse 2D</h1>
                <p>The backend server is live and ready for connections.</p>
                <div class="footer">
                    &copy; 2024 Metaverse 2D | All systems go
                </div>
            </div>
        </body>
        </html>
    `);
});

app.use('/api/auth',authRoutes)
app.use("/api/rooms", roomRoutes);
app.use('/api/call',callRoutes)
export default app

