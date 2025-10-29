import * as jose from 'jose';

declare global {
  namespace Express {
    export interface Request {
      user?: jose.JWTPayload;
    }
  }
}

export {};
