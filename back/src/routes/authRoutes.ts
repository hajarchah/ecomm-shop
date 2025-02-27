import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

// Handle both new and legacy endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Legacy endpoints
router.post('/account', authController.register);
router.post('/token', authController.login);

export default router;