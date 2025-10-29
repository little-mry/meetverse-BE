import * as jose from 'jose';

export const generateToken = async (userId: string): Promise<string> => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('SECRET is not defined in env variables');
  }

  const secretKey = new TextEncoder().encode(secret);

  const jwt = await new jose.SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);

  return jwt;
};
