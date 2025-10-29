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
