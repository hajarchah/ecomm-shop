import { Router } from 'express';
import cartController from '../controllers/cartController';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

// Important: Put specific routes BEFORE parametric routes
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/clear', cartController.clearCart); // Move this BEFORE /:id routes
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.removeFromCart);

export default router;