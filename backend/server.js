import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import cors from "cors";
import dayjs from "dayjs";
import { sendEmail } from "./utils/emailSender.js";
import { generateAppointmentConfirmationHTML } from "./emailTemplates/appointmentConfirmation.js";
import { generateInvoiceEmailHTML } from "./emailTemplates/invoiceEmail.js";
import { fileURLToPath } from "url";
import path from "path";
import pool from "./config/db.js"; // Ensure this exports a promise-based pool
import authRouter from './routes/authRoutes.js';
import morgan from 'morgan';

const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.json());
// app.use(morgan('combined', { stream: logger.stream }));
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
