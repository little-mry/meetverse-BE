import mongoose from "mongoose";

type ConnectOptions = {
  uri?: string;          // default: process.env.MONGODB_URI
  appName?: string;      // default: package name
  dbName?: string;       // default: from URI
  maxRetries?: number;   // default: 5
  retryDelayMs?: number; // default: 3000
};

let connecting = false;

export async function connectDB(opts: ConnectOptions = {}) {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (connecting) return;

  const {
    uri = process.env.MONGODB_URI,
    appName = process.env.npm_package_name || "meetverse-be",
    dbName = process.env.MONGODB_DBNAME, // valfritt
    maxRetries = 5,
    retryDelayMs = 3000,
  } = opts;

  if (!uri) throw new Error("MONGODB_URI is not set");

  connecting = true;

  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      await mongoose.connect(uri, { appName, dbName } as any);
      console.log(`[db] Connected → ${mongoose.connection.name}`);
      connecting = false;

      mongoose.connection.on("disconnected", () =>
        console.warn("[db] Disconnected"),
      );
      mongoose.connection.on("reconnected", () =>
        console.log("[db] Reconnected"),
      );
      mongoose.connection.on("error", (err) =>
        console.error("[db] Error:", err),
      );

      return;
    } catch (err: any) {
      attempt++;
      console.error(
        `[db] Connect failed (${attempt}/${maxRetries + 1}): ${err.message}`,
      );
      if (attempt > maxRetries) {
        connecting = false;
        throw err;
      }
      await new Promise((r) => setTimeout(r, retryDelayMs));
      console.log("[db] Retrying…");
    }
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("[db] Connection closed");
  }
}

/** 0=disconnected, 1=connected, 2=connecting, 3=disconnecting */
export function getDBState() {
  return mongoose.connection.readyState;
}
