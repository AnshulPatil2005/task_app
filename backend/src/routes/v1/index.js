import { Router } from 'express';
import authRoutes from './auth.routes.js';
import taskRoutes, { adminTaskRouter } from './task.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminTaskRouter);

export default router;
