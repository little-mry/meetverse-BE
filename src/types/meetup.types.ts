import { Types } from 'mongoose';

export type Review = {
  userId: Types.ObjectId;
  rating: number;
  text?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Meetup = {
  title: string;
  description?: string;
  category?: string;
  location?: {
    city?: string;
    address?: string;
    lat?: number;
    long?: number;
  };
  date: Date[];
  time?: string;
  capacity?: number;
  registrations: Types.ObjectId[];
  reviews: Review[];
  stats?: {
    confirmedCount: number;
    averageRating: number;
    reviewCount: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};
