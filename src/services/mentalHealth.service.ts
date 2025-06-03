import { client } from './api/client';
import { MentalHealthMetric, MoodTrend } from '../types/mentalHealth';

export class MentalHealthService {
  async getUserMetrics(userId: number): Promise<MentalHealthMetric[]> {
    const response = await client.get(`/mental-health/metrics/${userId}`);
    return response.data;
  }

  async addMetric(userId: number, data: {
    mood: number;
    anxietyLevel?: number;
    stressLevel?: number;
    notes?: string;
  }): Promise<MentalHealthMetric> {
    const response = await client.post(`/mental-health/metrics/${userId}`, data);
    return response.data;
  }

  async getMoodTrends(userId: number, days = 30): Promise<MoodTrend[]> {
    const response = await client.get(`/mental-health/trends/${userId}`, {
      params: { days }
    });
    return response.data;
  }
}
