export interface MentalHealthMetric {
  id: number;
  userId: number;
  mood: number;
  anxietyLevel?: number;
  stressLevel?: number;
  notes?: string;
  activities?: string[];
  createdAt: Date;
}

export interface MoodTrend {
  date: string;
  averageMood: number;
  averageAnxiety: number;
  averageStress: number;
}
