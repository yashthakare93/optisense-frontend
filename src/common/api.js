const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

export const apiClient = {
  post: async (url, data) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
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

  put : async(url,data) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}${url}`,{
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json',
        ...(token && { 'Authorization' : `Bearer ${token}`})
      },
      body : JSON.stringify(data)
    });

    if(!res.ok){
      const error = await res.text();
      throw new Error(error || 'Request failed');
    }
    return res.json();
  }
};