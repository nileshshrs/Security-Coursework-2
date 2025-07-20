import express from 'express';
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';
import helmet from 'helmet';
import { PORT } from './utils/constants/env.js';
import connect from './database/connect.js';
import error from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import path from "path"; // ← You are missing this
import { fileURLToPath } from "url";
import { dirname } from "path";
import clothesRoutes from './routes/clothes.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import { generalLimiter } from './middleware/ratelimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../../localhost+2-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../localhost+2.pem')),
};

// Create Express app
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: false, // HSTS not needed on localhost
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(cookieParser());

app.use(generalLimiter);
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/clothes", clothesRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/order", orderRoutes)
app.use("/api/v1/upload", uploadRoutes) 
app.use("/api/v1/user", userRoutes)
// Error handler
app.use(error);

// Create HTTPS server
const server = https.createServer(sslOptions, app);

// Start server
server.listen(PORT, async () => {
    console.log(`App is running securely on https://localhost:${PORT}`);
    connect();
});
