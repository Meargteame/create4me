import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Import database
import { connectDB } from "./database/mongoose";

// Import routes
import authRoutes from "./routes/auth";
import campaignRoutes from "./routes/campaigns";
import pageRoutes from "./routes/pages";
import { projectTaskRoutes, taskRouter } from "./routes/tasks";
import aiRoutes from "./routes/ai";
import applicationRoutes from "./routes/applications";
import creatorRoutes from "./routes/creators";
import connectionRoutes from "./routes/connections";
import uploadRoutes from "./routes/upload";
import analyticsRoutes from "./routes/analytics";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { authenticateToken } from "./middleware/auth";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static("uploads"));

// Health check routes
app.get(["/", "/health", "/api/health"], (req, res) => {
  res.json({
    status: "ok",
    message: "Create4Me API Server",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/projects/:projectId/tasks", projectTaskRoutes);
app.use("/api/tasks", taskRouter);
app.use("/api/pages", pageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/creators", creatorRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// Project pages routes
app.post("/api/projects/:id/pages", authenticateToken, pageRoutes);
app.get("/api/projects/:id/pages", authenticateToken, pageRoutes);

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is working correctly",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: MongoDB with Mongoose ODM`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await require("./database/mongoose").disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await require("./database/mongoose").disconnectDB();
  process.exit(0);
});
