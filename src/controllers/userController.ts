import { type Request, type Response, type NextFunction } from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { AppError } from '../utils/AppError.js';
import type { User as UserType, UserLogin } from '../types/user.types.js';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(new AppError('Alla fält måste fyllas i', 400));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(new AppError('Användare med denna email eller användarnamn finns redan', 409));
    }

    const newUser = await User.create({
      username,
      email,
      passwordHash: password,
    });

    const token = await generateToken(newUser.id);

    res.status(201).json({
      message: 'Användare skapad och inloggad',
      user: username,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new AppError('Alla fält måste fyllas i', 400));
    }

    const user = (await User.findOne({ username })) as UserLogin;

    if (!user || !user.id) {
      return next(new AppError('Ogiltigt användarnamn', 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new AppError('Ogiltigt lösenord', 401));
    }

    const token = await generateToken(user.id);

    res.status(200).json({
      message: 'Inloggning lyckades',
      token: token,
      user: user.username,
    });
  } catch (error) {
    next(error);
  }
};
