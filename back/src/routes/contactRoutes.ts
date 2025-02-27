import { Router } from 'express';
import contactController from '../controllers/contactController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactRequest:
 *       type: object
 *       required:
 *         - email
 *         - message
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         message:
 *           type: string
 *           maxLength: 300
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid request (e.g., message too long)
 */

// Define contact routes
router.get('/', contactController.getAllMessages);
router.get('/:id', contactController.getMessageById);
router.post('/', contactController.createMessage);
router.patch('/:id', contactController.updateMessageStatus);
router.delete('/:id', contactController.deleteMessage);

export default router;