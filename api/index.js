import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log(err.message);
    });

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
};

// Use CORS with the specified options
app.use(cors(corsOptions));

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

// Start the server
app.listen(3000, function () {
    console.log("Server listening on port 3000");
});
