import { Request, Response } from 'express';
import WishlistModel from '../models/wishlistModel';

class WishlistController {
  // Get user's wishlist
  public getUserWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.userId;
      const wishlist = await WishlistModel.getUserWishlist(userId);
      
      // Transform to include only product data
      const transformedWishlist = wishlist.map(item => ({
        id: item.id,
        product: item.product,
        addedAt: item.createdAt
      }));
      
      res.json(transformedWishlist);
    } catch (error) {
      console.error('Error retrieving wishlist:', error);
      res.status(500).json({ message: 'Failed to retrieve wishlist' });
    }
  };

  // Add product to wishlist
  public addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.userId;
      const { productId } = req.body;
      
      if (!productId) {
        res.status(400).json({ message: 'Product ID is required' });
        return;
      }
      
      const wishlistItem = await WishlistModel.addToWishlist(userId, productId);
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Failed to add item to wishlist' });
    }
  };

  // Remove product from wishlist
  public removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.userId;
      const productId = parseInt(req.params.productId, 10);
      
      const success = await WishlistModel.removeFromWishlist(userId, productId);
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Product not found in wishlist' });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ message: 'Failed to remove item from wishlist' });
    }
  };

  // Check if product is in wishlist
  public isInWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.userId;
      const productId = parseInt(req.params.productId, 10);
      
      const isInWishlist = await WishlistModel.isInWishlist(userId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      console.error('Error checking wishlist:', error);
      res.status(500).json({ message: 'Failed to check wishlist status' });
    }
  };
}

export default new WishlistController();