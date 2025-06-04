import { client } from './api/client';
import { MentalHealthMetric, MoodTrend } from '../types/mentalHealth';
import { BreathingSession, BreathingSessionStats } from '../types/breathing';

export interface CreateBreathingSessionRequest {
  pattern: string;
  duration: number; // Duration in seconds
  cycles: number;
  stressLevelBefore: number | null;
  stressLevelAfter: number | null;
  notes: string | null;
  completed: boolean;
}

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

  async createBreathingSession(userId: number, data: {
    patternName: string;
    durationMinutes: number;
    completedCycles: number;
    stressLevelBefore?: number;
    stressLevelAfter?: number;
    notes?: string;
  }): Promise<BreathingSession> {
    // Convert from frontend format to backend format
    const requestData: CreateBreathingSessionRequest = {
      pattern: data.patternName,
      duration: data.durationMinutes * 60, // Convert minutes to seconds
      cycles: data.completedCycles,
      stressLevelBefore: data.stressLevelBefore ?? null,
      stressLevelAfter: data.stressLevelAfter ?? null,
      notes: data.notes ?? null,
      completed: true // Mark as completed since we're creating it after completion
    };

    const response = await client.post<BreathingSession>(`/api/breathing/sessions`, requestData);
    return {
      ...response.data,
      createdAt: new Date(response.data.createdAt)
    };
  }

  async getBreathingSessions(): Promise<BreathingSession[]> {
    interface ApiBreathingSession {
      id: number;
      userId: number;
      pattern: string;
      duration: number;
      completed: boolean;
      cycles: number;
      stressLevelBefore: number | null;
      stressLevelAfter: number | null;
      notes: string | null;
      createdAt: string;
    }

    const response = await client.get<ApiBreathingSession[]>(`/api/breathing/sessions`);
    return response.data.map(session => ({
      ...session,
      patternName: session.pattern,
      durationMinutes: session.duration / 60,
      completedCycles: session.cycles,
      createdAt: new Date(session.createdAt),
      stressLevelBefore: session.stressLevelBefore ?? null,
      stressLevelAfter: session.stressLevelAfter ?? null,
      notes: session.notes ?? null
    }));
  }

  async getBreathingStats(): Promise<BreathingSessionStats> {
    const response = await client.get<BreathingSessionStats>(`/api/breathing/sessions/stats`);
    return {
      ...response.data,
      averageStressReduction: response.data.averageStressReduction ?? null
    };
  }
}
