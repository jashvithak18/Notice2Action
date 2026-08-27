import { Router } from 'express';
import { analyze } from '../controllers/analyzeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, analyze);

export default router;
