import { Router } from 'express';
import { login, getCurrentUser } from '../controllers/authController';
import { auth, withAuthUser } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.get('/me', auth, withAuthUser(getCurrentUser));  // Usa el wrapper para convertir el tipo

export default router;