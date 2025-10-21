// src/api/export.js
import { API_BASE_URL } from '../config';

export async function downloadExport(endpoint, format = 'csv', token) {
  const url = `${API_BASE_URL}/export/${endpoint}?format=${format}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Export failed' }));
    throw new Error(err.message || 'Export failed');
  }
  const blob = await res.blob();
  return blob;
}

export function saveBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
