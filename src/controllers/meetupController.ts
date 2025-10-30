import Meetup from '../models/Meetup';
import type { Request, Response, NextFunction } from 'express';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import { Types } from 'mongoose';

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

export const registerToMeetup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const userIdString = req.user?.id as string;

    if (!userIdString) {
      return next(new AppError('Unauthorized', 401));
    }

    const userId = new Types.ObjectId(userIdString);

    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const meetup = await Meetup.findById(id);
    if (!meetup) {
      return next(new AppError('Meetup not found', 404));
    }

    if (meetup.registrations.includes(userId)) {
      return next(new AppError('User already registered', 400));
    }

    meetup.registrations.push(userId);
    await meetup.save();

    await User.findByIdAndUpdate(userId, { $push: { registration: meetup._id } });

    res.status(200).json({
      status: 'success',
      message: 'User registered to meetup successfully',
      data: { meetup },
    });
  } catch (error) {
    next(error);
  }
};

export const unregisterFromMeetup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userIdString = req.user?.id as string;

    if (!userIdString) {
      return next(new AppError('Unauthorized', 401));
    }

    const userId = new Types.ObjectId(userIdString);

    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    const meetup = await Meetup.findById(id);
    if (!meetup) {
      return next(new AppError('Meetup not found', 404));
    }
    const isRegistered = meetup.registrations?.some((regId: Types.ObjectId) =>
      regId.equals(userId),
    );
    if (!isRegistered) {
      return next(new AppError('User not registered to this meetup', 400));
    }
    meetup.registrations = meetup.registrations.filter(
      (regId: Types.ObjectId) => !regId.equals(userId),
    );
    await meetup.save();

    await User.findByIdAndUpdate(userId, { $pull: { registration: meetup._id } });

    res.status(200).json({
      status: 'success',
      message: 'User unregistered from meetup successfully',
      data: { meetup },
    });
  } catch (error) {
    next(error);
  }
};
