import { Router } from 'express';
import {
  getAllMeetups,
  getMeetupById,
  registerToMeetup,
  unregisterFromMeetup,
} from '../controllers/meetupController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllMeetups);
router.get('/:id', getMeetupById);
router.post('/:id/register', registerToMeetup);
router.delete('/:id/register', unregisterFromMeetup);
export default router;
