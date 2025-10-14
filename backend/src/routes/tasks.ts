import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';

const router = Router({ mergeParams: true });

// All routes in this file are protected and require authentication
router.use(authenticateToken);

// Routes for /projects/:projectId/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// Routes for /tasks/:taskId (needs to be separate)
const taskRouter = Router();
taskRouter.use(authenticateToken);

taskRouter.route('/:taskId')
  .put(updateTask)
  .delete(deleteTask);

export { router as projectTaskRoutes, taskRouter };
