import { Router } from 'express';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { auth, adminOnly, withAuthUser } from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, adminOnly, withAuthUser(deleteProduct));  // Agrega withAuthUser aquí

export default router;