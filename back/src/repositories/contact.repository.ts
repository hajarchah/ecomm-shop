import { AppDataSource } from '../database';
import { Contact } from '../entities/contact.entity';

// Export the repository
export const ContactRepository = AppDataSource.getRepository(Contact);