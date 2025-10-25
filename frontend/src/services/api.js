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

  createStory: async (storyData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create story');
    }
    return data;
  },

  updateStory: async (id, storyData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update story');
    }
    return data;
  },

  deleteStory: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/stories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete story');
    }
  },

  getUserStories: async (userId) => {
    const response = await fetch(`${API_BASE}/stories/user/${userId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user stories');
    }
    return data;
  },

  uploadCover: async (storyId, coverFile) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('cover', coverFile);

    const response = await fetch(`${API_BASE}/stories/${storyId}/cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload cover');
    }
    return data;
  },

  // Chapters endpoints
  getChapters: async (storyId) => {
    const response = await fetch(`${API_BASE}/chapters/${storyId}/chapters`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch chapters');
    }
    return data;
  },

  createChapter: async (storyId, chapterData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/chapters/${storyId}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chapterData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create chapter');
    }
    return data;
  },

  updateChapter: async (id, chapterData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/chapters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(chapterData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update chapter');
    }
    return data;
  },

  publishChapter: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/chapters/${id}/publish`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to publish chapter');
    }
    return data;
  },

  // Reading progress endpoints
  getReadingProgress: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reading/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reading progress');
    }
    return data;
  },

  updateReadingProgress: async (storyId, chapterId, progress) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reading/progress/${storyId}/${chapterId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ progress }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update reading progress');
    }
    return data;
  },

  // Bookmarks endpoints
  getBookmarks: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reading/bookmarks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bookmarks');
    }
    return data;
  },

  addBookmark: async (storyId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reading/bookmarks/${storyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add bookmark');
    }
    return data;
  },

  removeBookmark: async (storyId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/reading/bookmarks/${storyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to remove bookmark');
    }
  },
};