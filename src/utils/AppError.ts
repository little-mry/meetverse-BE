export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

/*  Så använder du AppError i dina controllers
import { AppError } from "../utils/AppError.js";

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("Användare hittades inte", 404));

  res.json(user);
};*/