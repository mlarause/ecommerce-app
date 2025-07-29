import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.get('/me', auth, getCurrentUser);

export default router;