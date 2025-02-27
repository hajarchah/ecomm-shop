import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ default: false })
  isAdmin!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Method to compare password for login
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}