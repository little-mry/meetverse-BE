import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/db.js";

// Tillåt båda env-namnen: MONGODB_URI (din) och MONGO_URI (Marias)
if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
  process.env.MONGODB_URI = process.env.MONGO_URI;
}

const app = express();

// CORS enligt Marias setup + rimliga defaults
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes (Maria kopplar in riktiga routers här när de är klara)
// import authRouter from "./routes/auth.routes.js";
// import meetupRouter from "./routes/meetup.routes.js";
// app.use("/auth", authRouter);
// app.use("/meetups", meetupRouter);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: `${req.originalUrl} not Found` });
});

// (valfritt) Global error handler kan läggas till senare
// app.use(errorHandlerMiddleware);

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  await connectDB(); // läser MONGODB_URI/MONGO_URI
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on :${PORT}`)
  );

  // Graceful shutdown (din kod)
  const shutdown = async (signal: string) => {
    console.log(`[app] ${signal} received → shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error("[app] Startup error:", err);
  process.exit(1);
});
