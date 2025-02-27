import { ContactRepository } from '../repositories/contact.repository';
import { Contact } from '../entities/contact.entity';

export class ContactModel {
  // Get all contact messages
  public static async getAllMessages(): Promise<Contact[]> {
    return await ContactRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  // Get a contact message by ID
  public static async getMessageById(id: number): Promise<Contact | null> {
    return await ContactRepository.findOneBy({ id });
  }

  // Add a new contact message
  public static async addMessage(message: Partial<Contact>): Promise<Contact> {
    const newContact = ContactRepository.create({
      ...message,
      createdAt: Date.now(),
      status: 'new'
    });
    return await ContactRepository.save(newContact);
  }

  // Update a contact message status
  public static async updateMessageStatus(id: number, status: 'new' | 'read' | 'replied'): Promise<Contact | null> {
    const message = await ContactRepository.findOneBy({ id });
    
    if (!message) {
      return null;
    }
    
    message.status = status;
    return await ContactRepository.save(message);
  }

  // Delete a contact message
  public static async deleteMessage(id: number): Promise<boolean> {
    const result = await ContactRepository.delete(id);
    return result.affected !== 0;
  }
}

export default ContactModel;