const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8081/api';

export const apiBase = API_BASE;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('fixora-token');

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    const errorText = contentType.includes('application/json')
      ? await response.text()
      : await response.text();

    let message = 'Request failed.';
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) {
        const details = parsed.details
          ? Object.entries(parsed.details).map(([field, detail]) => `${field}: ${detail}`).join(', ')
          : '';
        message = details ? `${parsed.message}: ${details}` : parsed.message;
      } else if (parsed.error) {
        message = parsed.error;
      }
    } catch {
      message = errorText || message;
    }

    throw new Error(message);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
