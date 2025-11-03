import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserProfile);

export default router;
