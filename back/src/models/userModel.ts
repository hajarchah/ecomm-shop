import { AppDataSource } from '../database';
import { User } from '../entities/user.entity';

export class UserModel {
  // Create a new user
  public static async createUser(userData: Partial<User>): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = userRepository.create(userData);
      return await userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Find user by email
  public static async findByEmail(email: string): Promise<User | null> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Find user by ID
  public static async findById(id: number): Promise<User | null> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
}

export default UserModel;