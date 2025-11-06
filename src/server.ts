import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, disconnectDB, getDBState } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import userRouter from './routes/userRoutes.js';
import meetupRouter from './routes/meetupRoutes.js';


const startServer = async () => {
  const app = express();

  // CORS
  const rawOrigins = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const ALLOWED_ORIGINS = rawOrigins
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

  app.use(express.json());

  // Healthcheck
  app.get('/api/health', (_req, res) => res.json({ ok: true, dbState: getDBState() }));

  await connectDB();
  console.log('✅ MongoDB connected via connectDB');

  app.use('/api/user', userRouter);
  app.use('/api/meetups', meetupRouter);

  // 404
  app.use((req, res) => {
    res.status(404).json({ message: `${req.originalUrl} not found` });
  });

  app.use(errorHandler);

  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, () => console.log(`Server running on :${port}`));
  const shutdown = async (signal: string) => {
    console.log(`[app] ${signal} received → shutting down`);
    server.close(async () => {
      try {
        await disconnectDB();
      } finally {
        process.exit(0);
      }
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
 // process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
