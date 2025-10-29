import { type Request, type Response, type NextFunction } from 'express';
import * as jose from 'jose';

const secret = process.env.JWT_SECRET;
let secretKey: Uint8Array;

if (!secret) {
  throw new Error('Secret is not defined in env');
} else {
  secretKey = new TextEncoder().encode(secret);
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'Unathorized' });
    }

    const token = authHeader.split(' ')[1];

    const { payload } = await jose.jwtVerify(token, secretKey);

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unathorized or expired token', error: error });
  }
};
