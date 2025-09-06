import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { projectService } from '../services/projectService';

export const projectController = {
  // Get all projects for authenticated user
  getProjects: async (req: AuthRequest, res: Response) => {
    try {
      const projects = await projectService.getUserProjects(req.user._id);
      
      res.json({
        success: true,
        data: { projects }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get single project by ID
  getProject: async (req: AuthRequest, res: Response) => {
    try {
      const project = await projectService.getProject(req.params.id, req.user._id);
      
      res.json({
        success: true,
        data: { project }
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create new project
  createProject: async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, priority, startDate, endDate } = req.body;
      
      const project = await projectService.createProject({
        name,
        description,
        priority,
        startDate,
        endDate,
        owner: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: { project }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update project
  updateProject: async (req: AuthRequest, res: Response) => {
    try {
      const project = await projectService.updateProject(
        req.params.id,
        req.body,
        req.user._id
      );

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: { project }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete project
  deleteProject: async (req: AuthRequest, res: Response) => {
    try {
      await projectService.deleteProject(req.params.id, req.user._id);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Add member to project
  addMember: async (req: AuthRequest, res: Response) => {
    try {
      const { email } = req.body;
      
      const project = await projectService.addMember(
        req.params.id,
        email,
        req.user._id
      );

      res.json({
        success: true,
        message: 'Member added successfully',
        data: { project }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
