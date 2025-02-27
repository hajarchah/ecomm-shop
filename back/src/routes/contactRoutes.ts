import { Router } from 'express';
import contactController from '../controllers/contactController';

const router = Router();

// Define contact routes
router.get('/', contactController.getAllMessages);
router.get('/:id', contactController.getMessageById);
router.post('/', contactController.createMessage);
router.patch('/:id', contactController.updateMessageStatus);
router.delete('/:id', contactController.deleteMessage);

export default router;