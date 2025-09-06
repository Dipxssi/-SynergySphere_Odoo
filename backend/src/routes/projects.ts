import express from 'express';
import { projectController } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/members', projectController.addMember);

export default router;
