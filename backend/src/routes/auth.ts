import express from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Route definitions only - delegate to controllers
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

export default router;
