import { Router } from 'express';
import { 
  getSubcategories, 
  getSubcategoriesByCategory, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory 
} from '../controllers/subcategoryController';
import { auth, adminOnly } from '../middlewares/auth';

const router = Router();

router.get('/', getSubcategories);
router.get('/category/:categoryId', getSubcategoriesByCategory);
router.post('/', auth, createSubcategory);
router.put('/:id', auth, updateSubcategory);
router.delete('/:id', auth, adminOnly, deleteSubcategory);

export default router;