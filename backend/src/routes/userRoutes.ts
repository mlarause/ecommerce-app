import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { auth, adminOnly } from '../middlewares/auth';

const router = Router();

// Rutas de usuarios
router.get('/', auth, adminOnly, getUsers); // Solo admin puede listar usuarios
router.get('/:id', auth, adminOnly, getUserById); // Solo admin puede ver usuario específico
router.post('/', auth, adminOnly, createUser); // Solo admin puede crear usuarios
router.put('/:id', auth, adminOnly, updateUser); // Solo admin puede actualizar usuarios
router.delete('/:id', auth, adminOnly, deleteUser); // Solo admin puede eliminar usuarios

export default router;