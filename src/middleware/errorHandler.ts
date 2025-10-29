import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`❌ [${err.statusCode || 500}] ${err.message}`);
  if (err.stack) console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
