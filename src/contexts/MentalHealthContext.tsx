import React, { createContext, useContext, useState, useCallback } from 'react';
import { MentalHealthMetric, MoodTrend } from '../types/mentalHealth';
import { MentalHealthService } from '../services/mentalHealth.service';

interface MentalHealthContextType {
  metrics: MentalHealthMetric[];
  trends: MoodTrend[];
  loading: boolean;
  addMetric: (mood: number, anxiety?: number, stress?: number, notes?: string) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchTrends: (days?: number) => Promise<void>;
}

const MentalHealthContext = createContext<MentalHealthContextType | undefined>(undefined);
const mentalHealthService = new MentalHealthService();

export const MentalHealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<MentalHealthMetric[]>([]);
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchTrends = useCallback(async (days: number = 30) => {
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

  return (
    <MentalHealthContext.Provider
      value={{
        metrics,
        trends,
        loading,
        addMetric,
        fetchMetrics,
        fetchTrends
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
