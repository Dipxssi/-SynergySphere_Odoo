import express from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

router.get('/project/:projectId', taskController.getProjectTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/comments', taskController.addComment);

export default router;
