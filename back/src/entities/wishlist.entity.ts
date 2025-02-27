import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  productId!: number;

  @Column({ type: 'bigint' })
  createdAt!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product!: Product;
}