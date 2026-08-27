import pdfParse from 'pdf-parse';

const pdf = pdfParse.default || pdfParse;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function extractTextFromPdf(buffer) {
  try {
    const data = await pdf(buffer);
    const text = (data.text || '').trim();
    if (!text || text.length < 20) {
      return {
        success: false,
        message:
          'This PDF appears to be scanned or image-based. Notice2Action currently supports text-based PDFs only.',
      };
    }
    return { success: true, text };
  } catch {
    return {
      success: false,
      message: 'Unable to read this PDF. Please try a text-based PDF or paste the notice text directly.',
    };
  }
}

export function extractTextFromTxt(buffer) {
  const text = buffer.toString('utf-8').trim();
  if (!text) {
    return { success: false, message: 'The uploaded file appears to be empty.' };
  }
  return { success: true, text };
}

export function validateFile(file) {
  if (!file) {
    return { valid: false, message: 'No file provided.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: 'File is too large. Maximum size is 10 MB.' };
  }

  const allowed = [
    'text/plain',
    'application/pdf',
    'text/plain; charset=utf-8',
  ];
  const ext = file.originalname?.toLowerCase().split('.').pop();
  const isTxt = ext === 'txt' || file.mimetype?.includes('text/plain');
  const isPdf = ext === 'pdf' || file.mimetype === 'application/pdf';

  if (!isTxt && !isPdf) {
    return {
      valid: false,
      message: 'Unsupported file type. Please upload a .txt or text-based .pdf file.',
    };
  }

  return { valid: true, type: isPdf ? 'pdf' : 'txt' };
}

export { MAX_FILE_SIZE };
