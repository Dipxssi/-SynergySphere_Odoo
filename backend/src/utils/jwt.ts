import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import { Types } from 'mongoose';


export interface IUserWithId extends IUser {
  _id: Types.ObjectId;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  
  return jwt.sign(payload, secret);
};


export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as JWTPayload;
};
