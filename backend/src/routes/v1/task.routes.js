import { Router } from 'express';
import { body, param, query } from 'express-validator';
import auth from '../../middleware/auth.js';
import roles from '../../middleware/roles.js';
import validate from '../../middleware/validate.js';
import {
  createTask,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasksAdmin,
} from '../../controllers/task.controller.js';

const taskRouter = Router();

taskRouter.use(auth);

taskRouter.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status')
      .optional()
      .isIn(['todo', 'in_progress', 'done'])
      .withMessage('Status must be todo, in_progress, or done'),
  ],
  validate,
  createTask
);

taskRouter.get(
  '/my',
  [
    query('status')
      .optional()
      .isIn(['todo', 'in_progress', 'done'])
      .withMessage('Invalid status filter'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('q').optional().isString(),
  ],
  validate,
  getMyTasks
);

taskRouter.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task id')],
  validate,
  getTaskById
);

taskRouter.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task id'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('status')
      .optional()
      .isIn(['todo', 'in_progress', 'done'])
      .withMessage('Status must be todo, in_progress, or done'),
  ],
  validate,
  updateTask
);

taskRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task id')],
  validate,
  deleteTask
);

const adminRouter = Router();

adminRouter.use(auth, roles('admin'));

adminRouter.get(
  '/tasks',
  [
    query('status')
      .optional()
      .isIn(['todo', 'in_progress', 'done'])
      .withMessage('Invalid status filter'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('q').optional().isString(),
  ],
  validate,
  getAllTasksAdmin
);

export default taskRouter;
export { adminRouter as adminTaskRouter };
