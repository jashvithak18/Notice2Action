import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController.js';
import { MAX_FILE_SIZE } from '../services/pdfService.js';
import { protect } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

const router = Router();

router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum size is 5 MB.' });
      }
      return res.status(400).json({ error: 'File upload failed. Please try again.' });
    }
    if (err) return next(err);
    uploadFile(req, res, next);
  });
});

export default router;
