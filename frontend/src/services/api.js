const API_BASE = import.meta.env.VITE_API_URL || '';

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('n2a_token');
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }
  return data;
}

export async function loginUser(login, password) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  return handleResponse(response);
}

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(response);
}

export async function getMeUser() {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function analyzeNotice(text, sampleId) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text, sampleId }),
  });
  return handleResponse(response);
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
  const response = await fetch(`${API_BASE}/api/history`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function fetchHistoryItem(id) {
  const response = await fetch(`${API_BASE}/api/history/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}
