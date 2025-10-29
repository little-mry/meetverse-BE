import { Router } from 'express';
import { getAllMeetups, getMeetupById } from '../controllers/meetupController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllMeetups);
router.get('/:id', getMeetupById);
export default router;
