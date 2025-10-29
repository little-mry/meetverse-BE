import Meetup from '../models/Meetup';
import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export const getAllMeetups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } },
        ],
      };
    }
    const meetups = await Meetup.find(query);
    res.status(200).json(meetups);
  } catch (err) {
    next(err);
  }
};
