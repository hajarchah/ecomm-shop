import { WishlistRepository } from '../repositories/wishlist.repository';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';

export class WishlistModel {
  // Get user's wishlist
  public static async getUserWishlist(userId: number): Promise<Wishlist[]> {
    return await WishlistRepository.find({
      where: { userId },
      relations: ['product'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  // Add product to wishlist
  public static async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    // Check if product already in wishlist
    const existingItem = await WishlistRepository.findOne({
      where: { userId, productId }
    });

    if (existingItem) {
      return existingItem; // Product already in wishlist
    }

    // Add product to wishlist
    const wishlistItem = WishlistRepository.create({
      userId,
      productId,
      createdAt: Date.now()
    });

    return await WishlistRepository.save(wishlistItem);
  }

  // Remove product from wishlist
  public static async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const result = await WishlistRepository.delete({ userId, productId });
    return result.affected !== 0;
  }

  // Check if product is in wishlist
  public static async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const count = await WishlistRepository.count({
      where: { userId, productId }
    });
    return count > 0;
  }
}

export default WishlistModel;