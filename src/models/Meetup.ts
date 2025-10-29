import { Schema, model } from "mongoose";
import type { Meetup, Review } from '../types/meetup.types'

const reviewSchema = new Schema<Review>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: String,
  },
  { timestamps: true }
);

const meetupSchema = new Schema<Meetup>(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    category: { type: String, index: true },
    location: {
      city: String,
      address: String,
      lat: Number,
      long: Number,
    },
    date: [{ type: Date, required: true }],
    time: String,
    capacity: { type: Number, default: 0 },
    registrations: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviews: [reviewSchema],
    stats: {
      confirmedCount: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default model<Meetup>("Meetup", meetupSchema);
