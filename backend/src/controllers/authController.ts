import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authService } from '../services/authService';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      const result = await authService.registerUser({
        firstName,
        lastName,
        email,
        password
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const result = await authService.loginUser(email, password);

      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userProfile = await authService.getUserProfile(req.user._id);
      
      res.json({
        success: true,
        data: { user: userProfile }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  logout: (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
};
