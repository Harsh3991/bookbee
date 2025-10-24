const API_BASE = import.meta.env.VITE_API_URL;

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  // Stories endpoints
  getStories: async () => {
    const response = await fetch(`${API_BASE}/stories`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch stories');
    }
    return data;
  },

  getStoryById: async (id) => {
    const response = await fetch(`${API_BASE}/stories/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch story');
    }
    return data;
  },
};