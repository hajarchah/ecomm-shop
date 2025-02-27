import { Router } from 'express';
import cartController from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;