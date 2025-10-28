import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
  registration?: mongoose.Types.ObjectId[];
}
