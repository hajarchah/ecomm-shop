import { Router } from 'express';
import wishlistController from '../controllers/wishlistController';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateJWT);

// Get user's wishlist
router.get('/wishlist', wishlistController.getUserWishlist);

// Add product to wishlist
router.post('/wishlist', wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/wishlist/:productId', wishlistController.removeFromWishlist);

// Check if product is in wishlist
router.get('/wishlist/check/:productId', wishlistController.isInWishlist);

export default router;