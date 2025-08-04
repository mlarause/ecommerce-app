import { Router } from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController';
import { auth, adminOnly, withAuthUser } from '../middlewares/auth';

const router = Router();

router.get('/', getCategories);
router.post('/', auth, adminOnly, createCategory);
router.put('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, withAuthUser(deleteCategory));

export default router;