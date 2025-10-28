import { Schema, model, Types } from 'mongoose';

const reviewSchema = new Schema({
  reviewId: { type: Types.ObjectId, auto: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const meetupSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  location: {
    city: String,
    address: String,
    lat: Number,
    long: Number,
  },
  date: [{ type: Date }],
  time: String,
  capacity: Number,
  registrations: [{ type: Types.ObjectId, ref: 'User' }],
  reviews: [reviewSchema],
  stats: {
    confirmedCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('Meetup', meetupSchema);
