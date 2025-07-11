import express from 'express';
import "dotenv/config";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';
import { PORT } from './utils/constants/env.js';
import connect from './database/connect.js';
import error from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('../server.key'),
  cert: fs.readFileSync('../server.cert')
};
// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)

// Error handler
app.use(error);

// Create HTTPS server
const server = https.createServer(sslOptions, app);

// Start server
server.listen(PORT, async () => {
    console.log(`App is running securely on https://localhost:${PORT}`);
    connect();
});
