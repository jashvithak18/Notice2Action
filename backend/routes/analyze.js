import { Router } from 'express';
import { analyze } from '../controllers/analyzeController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalAuth, analyze);

export default router;
