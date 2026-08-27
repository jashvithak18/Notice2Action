import { Router } from 'express';
import { getSamples, getSampleText } from '../controllers/sampleController.js';

const router = Router();

router.get('/', getSamples);
router.get('/:id', getSampleText);

export default router;
