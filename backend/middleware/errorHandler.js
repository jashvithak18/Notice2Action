export function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);

  // express.json() body-too-large → give a friendly message instead of raw 413
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      error: 'Notice text is too large. Please paste a shorter excerpt (under 50,000 characters) and try again.',
    });
  }

  const status = err.status || 500;
  const message =
    err.message || 'Something went wrong. Please try again.';

  res.status(status).json({ error: message });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found.' });
}
