import { Router } from 'express';
import wishlistController from '../controllers/wishlistController';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateJWT);

// Update these routes - remove the '/wishlist' prefix since we're already mounting at '/api'
router.get('/', wishlistController.getUserWishlist);              // GET /api/wishlist
router.post('/', wishlistController.addToWishlist);              // POST /api/wishlist 
router.delete('/:productId', wishlistController.removeFromWishlist); // DELETE /api/wishlist/:productId
router.get('/check/:productId', wishlistController.isInWishlist);    // GET /api/wishlist/check/:productId

export default router;