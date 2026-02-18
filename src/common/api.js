const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

export const apiClient = {
  post: async (url, data) => {
    const token = getToken();

    // Check if data is FormData
    const isFormData = data instanceof FormData;

    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Request failed');
    }
    return res.json();
  },

  get: async (url) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Request failed');
    }
    return res.json();
  },

  delete: async (url) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Request failed');
    }
    return res.json();
  },

  put: async (url, data) => {
    const token = getToken();
    const isFormData = data instanceof FormData;

    const headers = {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Request failed');
    }
    return res.json();
  }
};