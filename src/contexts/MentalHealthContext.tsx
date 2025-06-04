import React, { createContext, useContext, useState, useCallback } from 'react';
import { MentalHealthMetric, MoodTrend } from '../types/mentalHealth';
import { BreathingSession, BreathingSessionStats } from '../types/breathing';
import { MentalHealthService } from '../services/mentalHealth.service';

interface MentalHealthContextType {
  metrics: MentalHealthMetric[];
  trends: MoodTrend[];
  loading: boolean;
  breathingSessions: BreathingSession[];
  breathingStats: BreathingSessionStats | null;
  addMetric: (mood: number, anxiety?: number, stress?: number, notes?: string) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchTrends: (days?: number) => Promise<void>;
  createBreathingSession: (data: {
    patternName: string;
    durationMinutes: number;
    completedCycles: number;
    stressLevelBefore?: number;
    stressLevelAfter?: number;
    notes?: string;
  }) => Promise<void>;
  fetchBreathingSessions: () => Promise<void>;
  fetchBreathingStats: () => Promise<void>;
}

const MentalHealthContext = createContext<MentalHealthContextType | undefined>(undefined);
const mentalHealthService = new MentalHealthService();

export const MentalHealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<MentalHealthMetric[]>([]);
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [loading, setLoading] = useState(false);
  const [breathingSessions, setBreathingSessions] = useState<BreathingSession[]>([]);
  const [breathingStats, setBreathingStats] = useState<BreathingSessionStats | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const userId = parseInt(localStorage.getItem('userId') || '0');
      const data = await mentalHealthService.getUserMetrics(userId);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrends = useCallback(async (days = 30) => {
    try {
      const userId = parseInt(localStorage.getItem('userId') || '0');
      const data = await mentalHealthService.getMoodTrends(userId, days);
      setTrends(data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    }
  }, []);

  const addMetric = useCallback(async (
    mood: number,
    anxiety?: number,
    stress?: number,
    notes?: string
  ) => {
    try {
      const userId = parseInt(localStorage.getItem('userId') || '0');
      await mentalHealthService.addMetric(userId, {
        mood,
        anxietyLevel: anxiety,
        stressLevel: stress,
        notes
      });
      await fetchMetrics();
      await fetchTrends();
    } catch (error) {
      console.error('Error adding metric:', error);
    }
  }, [fetchMetrics, fetchTrends]);
  const fetchBreathingSessions = useCallback(async () => {
    try {
      const sessions = await mentalHealthService.getBreathingSessions();
      setBreathingSessions(sessions);
    } catch (error) {
      console.error('Error fetching breathing sessions:', error);
    }
  }, []);
  const fetchBreathingStats = useCallback(async () => {
    try {
      const stats = await mentalHealthService.getBreathingStats();
      setBreathingStats(stats);
    } catch (error) {
      console.error('Error fetching breathing stats:', error);
    }
  }, []);

  const createBreathingSession = useCallback(async (data: {
    patternName: string;
    durationMinutes: number;
    completedCycles: number;
    stressLevelBefore?: number;
    stressLevelAfter?: number;
    notes?: string;
  }) => {
    try {
      const userId = parseInt(localStorage.getItem('userId') || '0');
      await mentalHealthService.createBreathingSession(userId, data);
      await fetchBreathingSessions();
      await fetchBreathingStats();
    } catch (error) {
      console.error('Error creating breathing session:', error);
    }
  }, [fetchBreathingSessions, fetchBreathingStats]);

  return (
    <MentalHealthContext.Provider
      value={{
        metrics,
        trends,
        loading,
        breathingSessions,
        breathingStats,
        addMetric,
        fetchMetrics,
        fetchTrends,
        createBreathingSession,
        fetchBreathingSessions,
        fetchBreathingStats
      }}
    >
      {children}
    </MentalHealthContext.Provider>
  );
};

export const useMentalHealth = () => {
  const context = useContext(MentalHealthContext);
  if (context === undefined) {
    throw new Error('useMentalHealth must be used within a MentalHealthProvider');
  }
  return context;
};
