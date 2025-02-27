import { AppDataSource } from '../database';
import { Wishlist } from '../entities/wishlist.entity';

export const WishlistRepository = AppDataSource.getRepository(Wishlist);