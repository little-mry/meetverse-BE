import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// TODO: Maria – lägg till routes här
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

async function start() {
  await connectDB(); // läser MONGODB_URI (+ ev. MONGODB_DBNAME)
  const server = app.listen(PORT, () =>
    console.log(`API listening on :${PORT}`),
  );

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
