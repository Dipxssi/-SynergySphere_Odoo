import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { taskService } from '../services/taskService';

export const taskController = {
  // Get all tasks for a project
  getProjectTasks: async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await taskService.getProjectTasks(req.params.projectId, req.user._id);
      
      res.json({
        success: true,
        data: { tasks }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get single task
  getTask: async (req: AuthRequest, res: Response) => {
    try {
      const task = await taskService.getTask(req.params.id, req.user._id);
      
      res.json({
        success: true,
        data: { task }
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  },

  // Create new task
  createTask: async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, project, assignee, priority, dueDate, tags } = req.body;
      
      const task = await taskService.createTask({
        title,
        description,
        project,
        assignee,
        priority,
        dueDate,
        tags,
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update task
  updateTask: async (req: AuthRequest, res: Response) => {
    try {
      const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.user._id
      );

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: { task }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Delete task
  deleteTask: async (req: AuthRequest, res: Response) => {
    try {
      await taskService.deleteTask(req.params.id, req.user._id);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Add comment to task
  addComment: async (req: AuthRequest, res: Response) => {
    try {
      const { message } = req.body;
      
      const task = await taskService.addComment(
        req.params.id,
        message,
        req.user._id
      );

      res.json({
        success: true,
        message: 'Comment added successfully',
        data: { task }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};
