import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import authRouter from './routes/authRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.json());
// Routes
app.use('/api/auth', authRouter);

// Health check endpoint
// This is commonly known as a health check endpoint. 
// It's used to verify that your server or application is running and responsive—often 
// used in monitoring systems, load balancers, or deployment pipelines.

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
})
