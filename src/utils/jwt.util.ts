import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { RequestUserProp } from '../types';
config();

export function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, process.env.AUTH_TOKEN_SECRET!) as jwt.JwtPayload;
}

export function createToken(payload: RequestUserProp) {
  return jwt.sign(payload, process.env.AUTH_TOKEN_SECRET!, {
    expiresIn: process.env.AUTH_TOKEN_LIFETIME,
  });
}
