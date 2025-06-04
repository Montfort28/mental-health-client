import { Resource, ResourceType, ResourceCategory } from '../../types/resources';
import { client } from './client';

export const resourcesApi = {
  getAllResources: async () => {
    const response = await client.get<Resource[]>('/api/resources');
    return response.data;
  },

  getResourcesByType: async (type: ResourceType) => {
    const response = await client.get<Resource[]>(`/api/resources/type/${type}`);
    return response.data;
  },

  getResourcesByCategory: async (category: ResourceCategory) => {
    const response = await client.get<Resource[]>(`/api/resources/category/${category}`);
    return response.data;
  },

  searchResources: async (query: string) => {
    const response = await client.get<Resource[]>(`/api/resources/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getRecommendedResources: async () => {
    const response = await client.get<Resource[]>('/api/resources/recommended');
    return response.data;
  },

  trackResourceProgress: async (resourceId: string, data: { duration: number; completed: boolean }) => {
    const response = await client.post(`/api/resources/${resourceId}/progress`, data);
    return response.data;
  },

  getDailyChallenge: async () => {
    const response = await client.get('/api/resources/daily-challenge');
    return response.data;
  },

  getUserProgress: async () => {
    const response = await client.get('/api/resources/user-progress');
    return response.data;
  },

  addBookmark: async (resourceId: string) => {
    const response = await client.post(`/api/resources/${resourceId}/bookmark`);
    return response.data;
  },

  removeBookmark: async (resourceId: string) => {
    const response = await client.delete(`/api/resources/${resourceId}/bookmark`);
    return response.data;
  },

  getBookmarkedResources: async () => {
    const response = await client.get<Resource[]>('/api/resources/bookmarks');
    return response.data;
  },

  addNote: async (resourceId: string, content: string) => {
    const response = await client.post(`/api/resources/${resourceId}/notes`, { content });
    return response.data;
  },

  getNotes: async (resourceId: string) => {
    const response = await client.get(`/api/resources/${resourceId}/notes`);
    return response.data;
  },

  updateProgress: async (resourceId: string, progress: number) => {
    const response = await client.put(`/api/resources/${resourceId}/progress`, { progress });
    return response.data;
  }
};
