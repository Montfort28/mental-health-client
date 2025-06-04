import { PlantType } from '../components/garden/plantTypes';

export interface GardenElement {
  id: number;
  plantTypeId: string;
  name: string;
  description: string;
  plantedDate: string;
  lastWateredDate: string;
  growthStage: number;
  healthStatus: 'healthy' | 'needs-attention' | 'wilting';
  position: {
    x: number;
    y: number;
  };
  moodHistory: number[];
  activityHistory: string[];
}

export interface CreateGardenElementRequest {
  plantTypeId: string;
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
}

export interface UpdateGardenElementRequest {
  name?: string;
  description?: string;
  growthStage?: number;
  healthStatus?: 'healthy' | 'needs-attention' | 'wilting';
  position?: {
    x: number;
    y: number;
  };
  moodHistory?: number[];
  activityHistory?: string[];
}
