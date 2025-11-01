import { Schema, model } from 'mongoose';
import type { Meetup, Review } from '../types/meetup.types.js';

const reviewSchema = new Schema<Review>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: String,
  },
  { timestamps: true },
);

reviewSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

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
    registrations: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reviews: [reviewSchema],
  },
  { timestamps: true },
);

meetupSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, unknown>) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<Meetup>('Meetup', meetupSchema);
