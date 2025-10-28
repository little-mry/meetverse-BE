import { Schema, model } from "mongoose";
import type { IUser } from "../types/userTypes";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    registration: [{ type: Schema.Types.ObjectId, ref: "Meetup" }],
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
