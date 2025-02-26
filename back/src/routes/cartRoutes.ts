import { Router } from 'express';
import cartController from '../controllers/cartController';

const router = Router();

router.get('/cart', cartController.getCart);
router.post('/cart', cartController.addToCart);
router.patch('/cart/:id', cartController.updateCart);
router.delete('/cart/:id', cartController.removeFromCart);
router.delete('/cart', cartController.clearCart);

export default router;