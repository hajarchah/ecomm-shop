import { AppDataSource } from '../database';
import { Product } from '../entities/product.entity';

export const ProductRepository = AppDataSource.getRepository(Product);