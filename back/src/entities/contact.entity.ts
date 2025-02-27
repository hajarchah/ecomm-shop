import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number; // Using ! to avoid TypeScript initialization errors

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: 'new' })
  status!: 'new' | 'read' | 'replied';

  @Column({ type: 'bigint' })
  createdAt!: number;

  constructor() {
    this.createdAt = Date.now();
  }
}