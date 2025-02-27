import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import wishlistController from '../controllers/wishlistController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         productId:
 *           type: integer
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WishlistItem'
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to wishlist
 * 
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 */

// All routes require authentication
router.use(authenticateJWT);

// Update these routes - remove the '/wishlist' prefix since we're already mounting at '/api'
router.get('/', wishlistController.getWishlist);              // GET /api/wishlist
router.post('/', wishlistController.addToWishlist);              // POST /api/wishlist 
router.delete('/:productId', wishlistController.removeFromWishlist); // DELETE /api/wishlist/:productId
router.get('/check/:productId', wishlistController.checkWishlist);    // GET /api/wishlist/check/:productId

export default router;