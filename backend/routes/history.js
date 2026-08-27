import { Router } from 'express';
import { listHistory, getHistoryItem } from '../controllers/historyController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listHistory);
router.get('/:id', optionalAuth, getHistoryItem);

export default router;
