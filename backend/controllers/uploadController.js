import {
  extractTextFromPdf,
  extractTextFromTxt,
  validateFile,
} from '../services/pdfService.js';

export async function uploadFile(req, res, next) {
  try {
    const fileValidation = validateFile(req.file);
    if (!fileValidation.valid) {
      return res.status(400).json({ error: fileValidation.message });
    }

    let result;
    if (fileValidation.type === 'pdf') {
      result = await extractTextFromPdf(req.file.buffer);
    } else {
      result = extractTextFromTxt(req.file.buffer);
    }

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json({
      text: result.text,
      fileName: req.file.originalname,
    });
  } catch (err) {
    next(err);
  }
}
