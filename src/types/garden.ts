export interface GardenElement {
  id: number;
  type: 'plant' | 'tree' | 'flower';
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
}

export interface CreateGardenElementRequest {
  type: 'plant' | 'tree' | 'flower';
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
}
