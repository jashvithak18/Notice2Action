export function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);

  const status = err.status || 500;
  const message =
    err.message || 'Something went wrong. Please try again.';

  res.status(status).json({ error: message });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found.' });
}
