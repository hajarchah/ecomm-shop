import { AppDataSource } from '../database';
import { User } from '../entities/user.entity';

export const UserRepository = AppDataSource.getRepository(User);