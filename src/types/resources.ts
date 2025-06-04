export enum ResourceType {
  ARTICLE = 'ARTICLE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  WORKSHEET = 'WORKSHEET',
  INTERACTIVE = 'INTERACTIVE',
  CHECKLIST = 'CHECKLIST',
  MEDITATION = 'MEDITATION',
  BREATHING = 'BREATHING',
  ASSESSMENT = 'ASSESSMENT',
  CRISIS = 'CRISIS'
}

export enum ResourceCategory {
  UNDERSTANDING_MENTAL_HEALTH = 'Understanding Mental Health',
  COPING_STRATEGIES = 'Coping Strategies',
  CRISIS_SUPPORT = 'Crisis Support',
  DAILY_SELF_CARE = 'Daily Self-Care',
  PROFESSIONAL_SUPPORT = 'Professional Support',
  EDUCATIONAL_LIBRARY = 'Educational Library'
}

export enum ResourceDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  content?: string;
  url?: string;
  category: ResourceCategory;
  thumbnail?: string;
  duration?: number;
  difficulty?: ResourceDifficulty;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  progress?: number;
}

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

export interface ResourceProgress {
  resourceId: string;
  userId: string;
  progress: number;
  lastAccessed: string;
  completed: boolean;
}

export interface ResourceNote {
  id: string;
  resourceId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}