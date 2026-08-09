// src/lib/api.js
const API_BASE = '/api';

export async function fetchApi(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const data = await res.json();
  
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}