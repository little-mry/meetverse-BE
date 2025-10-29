import Meetup from '../models/Meetup';
import type { Request, Response, NextFunction } from 'express';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../utils/AppError';

export const getAllMeetups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, date, category, location } = req.query;
    let query: FilterQuery<typeof Meetup> = {};

    if (search && typeof search === 'string') {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (date && typeof date === 'string') {
      const selectedDate = new Date(date as string);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDay,
      };
    }

    if (category && typeof category === 'string') {
      query.category = category;
    }

    if (location && typeof location === 'string') {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    const meetups = await Meetup.find(query);
    res.status(200).json(meetups);
  } catch (err) {
    next(err);
  }
};

export const getMeetupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const meetup = await Meetup.findById(id);
    if (!meetup) {
      return next(new AppError('Meetup not found', 404));
    }
    res.status(200).json(meetup);
  } catch (err) {
    next(err);
  }
};
