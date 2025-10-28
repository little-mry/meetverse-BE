import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173", //our frontend URL - lägg till CLIENT_URL i .env filen
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  app.use(express.json());

  // MongoDB connection
  if (!process.env.MONGO_URI)
    throw new Error("MONGO_URI is not defined in environment variables");
  const mongoUri = process.env.MONGO_URI;

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");

  // Routes
  // auth
  app.use("/auth", /* authRouter */);

  // meetups
  app.use("/meetups", /* meetupRouter */);

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({ message: `${req.originalUrl} not Found` });
  });

  // Global error handler (lägg till senare)
  // app.use(errorHandlerMiddleware);

  const port = process.env.PORT || 3030;
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
