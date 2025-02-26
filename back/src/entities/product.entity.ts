import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  category!: string;

  @Column('float')
  price!: number;

  @Column()
  quantity!: number;

  @Column({ nullable: true })
  internalReference?: string;

  @Column({ nullable: true })
  shellId?: number;

  @Column()
  inventoryStatus!: string;

  @Column('float', { nullable: true })
  rating?: number;

  @Column('bigint')
  createdAt!: number;

  @Column('bigint')
  updatedAt!: number;

  constructor() {
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}