import { Request, Response } from 'express';
import ContactModel from '../models/contactModel';

class ContactController {
  // POST /contact - Add a new contact message
  public createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const message = req.body;
      
      if (!message.name || !message.email || !message.subject || !message.message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const newMessage = await ContactModel.addMessage(message);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  };

  // GET /contact - Get all messages
  public getAllMessages = async (_req: Request, res: Response): Promise<void> => {
    try {
      const messages = await ContactModel.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  };

  // GET /contact/:id - Get a message by ID
  public getMessageById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const message = await ContactModel.getMessageById(parseInt(id, 10));
      
      if (message) {
        res.json(message);
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    } catch (error) {
      console.error('Error retrieving message:', error);
      res.status(500).json({ error: 'Failed to retrieve message' });
    }
  };

  // PATCH /contact/:id - Update a message status
  public updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || !['new', 'read', 'replied'].includes(status)) {
        res.status(400).json({ error: 'Invalid status value' });
        return;
      }

      const message = await ContactModel.updateMessageStatus(parseInt(id, 10), status as 'new' | 'read' | 'replied');
      
      if (message) {
        res.json(message);
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      res.status(500).json({ error: 'Failed to update message status' });
    }
  };

  // DELETE /contact/:id - Delete a contact message
  public deleteMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await ContactModel.deleteMessage(parseInt(id, 10));
      
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  };
}

export default new ContactController();