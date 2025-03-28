import axios from 'axios';

const API_URL = 'http://localhost:8070/api/workout';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Services for sessions
export const sessionService = {
  // Get all sessions with optional filtering
  getSessions: async (filters = {}) => {
    try {
      const response = await apiClient.get('/sessions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },
  
  // Get session by ID
  getSessionById: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new session
  createSession: async (sessionData) => {
    try {
      const response = await apiClient.post('/create', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },
  
  // Update a session
  updateSession: async (id, sessionData) => {
    try {
      const response = await apiClient.put(`/${id}`, sessionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating session ${id}:`, error);
      throw error;
    }
  },
  
  // Update session status and attendance
  updateSessionStatus: async (id, statusData) => {
    try {
      const response = await apiClient.patch(`/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error(`Error updating session status ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a session
  deleteSession: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting session ${id}:`, error);
      throw error;
    }
  },
  
  // Add progress to a session
  addProgress: async (id, progressData) => {
    try {
      const response = await apiClient.patch(`/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error(`Error adding progress to session ${id}:`, error);
      throw error;
    }
  },
  
  // Get member statistics
  getMemberStats: async (memberId) => {
    try {
      const response = await apiClient.get(`/stats/member/${memberId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for member ${memberId}:`, error);
      throw error;
    }
  }
};

export default apiClient; //apiClient