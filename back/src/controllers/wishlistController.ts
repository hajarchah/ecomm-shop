import { Request, Response } from "express";
import WishlistModel from "../models/wishlistModel";

class WishlistController {
  public getWishlist = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const userId = Number(req.user.userId);
      const wishlist = await WishlistModel.getUserWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ message: "Error fetching wishlist" });
    }
  };

  public addToWishlist = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const userId = Number(req.user.userId);
      const productId = Number(req.params.productId);

      const wishlistItem = await WishlistModel.addToWishlist(userId, productId);
      res.json(wishlistItem);
    } catch (error) {
      res.status(500).json({ message: "Error adding to wishlist" });
    }
  };

  public removeFromWishlist = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const userId = Number(req.user.userId);
      const productId = Number(req.params.productId);

      const success = await WishlistModel.removeFromWishlist(userId, productId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Error removing from wishlist" });
    }
  };

  public checkWishlist = async (req: Request, res: Response) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const userId = Number(req.user.userId);
      const productId = Number(req.params.productId);

      const isInWishlist = await WishlistModel.isInWishlist(userId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      res.status(500).json({ message: "Error checking wishlist" });
    }
  };
}
export default new WishlistController();
