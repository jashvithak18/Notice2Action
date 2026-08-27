import { Router } from 'express';
import { listHistory, getHistoryItem } from '../controllers/historyController.js';

const router = Router();

router.get('/', listHistory);
router.get('/:id', getHistoryItem);

export default router;
