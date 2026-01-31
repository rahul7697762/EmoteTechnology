import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getDashboardStats} from '../controllers/faculty.controller.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.get('/dashboard-stats', getDashboardStats);
export default router;
