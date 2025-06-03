export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  content: string;
  category: ResourceCategory;
  thumbnail?: string;
  duration?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 
  | 'article'
  | 'meditation'
  | 'breathing'
  | 'exercise'
  | 'journal'
  | 'affirmation';

export type ResourceCategory =
  | 'anxiety'
  | 'depression'
  | 'stress'
  | 'sleep'
  | 'mindfulness'
  | 'self-care'
  | 'relationships'
  | 'personal-growth';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MeditationSession {
  id: string;
  resourceId: string;
  duration: number;
  completedAt: string;
  notes?: string;
}