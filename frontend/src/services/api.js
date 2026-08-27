const API_BASE = import.meta.env.VITE_API_URL || '';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export async function analyzeNotice(text, sampleId) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, sampleId }),
  });
  return handleResponse(response);
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
}

export async function fetchSamples() {
  const response = await fetch(`${API_BASE}/api/samples`);
  return handleResponse(response);
}

export async function fetchSampleText(id) {
  const response = await fetch(`${API_BASE}/api/samples/${id}`);
  return handleResponse(response);
}

export async function fetchHistory() {
  const response = await fetch(`${API_BASE}/api/history`);
  return handleResponse(response);
}

export async function fetchHistoryItem(id) {
  const response = await fetch(`${API_BASE}/api/history/${id}`);
  return handleResponse(response);
}
