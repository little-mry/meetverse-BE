import { Types } from 'mongoose';

export type User = {
  username: string;
  email: string;
  passwordHash: string;
  registration?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  _id?: Types.ObjectId;
};

export type UserLogin = {
  username: string;
  email: string;
  passwordHash: string;
  registration?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
  comparePassword(candidate: string): Promise<boolean>;
};
