import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { client } from '../services/api/client';

// Define types for the client side
interface GardenElement {
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

interface CreateGardenElementRequest {
  type: 'plant' | 'tree' | 'flower';
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
}

interface UpdateGardenElementRequest {
  name?: string;
  description?: string;
  growthStage?: number;
  healthStatus?: 'healthy' | 'needs-attention' | 'wilting';
  position?: {
    x: number;
    y: number;
  };
}

interface GardenState {
  elements: GardenElement[];
  loading: boolean;
  error: string | null;
}

const gardenInitialState: GardenState = {
  elements: [],
  loading: false,
  error: null
};

export const fetchGardenElements = createAsyncThunk<GardenElement[], void>(
  'garden/fetchElements',
  async () => {
    const response = await client.get<GardenElement[]>('/api/garden');
    return response.data;
  }
);

export const addGardenElement = createAsyncThunk<GardenElement, CreateGardenElementRequest>(
  'garden/addElement',
  async (element) => {
    const response = await client.post<GardenElement>('/api/garden', element);
    return response.data;
  }
);

export const updateGardenElement = createAsyncThunk<
  GardenElement,
  { id: number; updates: UpdateGardenElementRequest }
>(
  'garden/updateElement',
  async ({ id, updates }) => {
    const response = await client.patch<GardenElement>(`/api/garden/${id}`, updates);
    return response.data;
  }
);

const gardenSlice = createSlice({
  name: 'garden',
  initialState: gardenInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGardenElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGardenElements.fulfilled, (state, action) => {
        state.loading = false;
        state.elements = action.payload;
      })
      .addCase(fetchGardenElements.rejected, (state, action: { error: SerializedError }) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch garden elements';
      })
      .addCase(addGardenElement.fulfilled, (state, action) => {
        state.elements.push(action.payload);
      })
      .addCase(updateGardenElement.fulfilled, (state, action) => {
        const index = state.elements.findIndex((element: GardenElement) => element.id === action.payload.id);
        if (index !== -1) {
          state.elements[index] = action.payload;
        }
      });
  }
});

export default gardenSlice.reducer;