import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../services/api/client';

interface ProfileState {
  loading: boolean;
  error: string | null;
  data: {
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
      language: string;
    };
    stats: {
      meditationMinutes: number;
      moodEntries: number;
      gardenElements: number;
    };
  } | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  data: null
};

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async () => {
    const response = await client.get('/api/profile');
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (updates: Partial<ProfileState['data']>) => {
    const response = await client.patch('/api/profile', updates);
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch profile';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  }
});

export default profileSlice.reducer;
