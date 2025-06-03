import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../services/api/client';

export interface MoodEntry {
  id: number;
  mood: number;
  notes: string;
  activities: string[];
  timestamp: string;
}

interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  entries: [],
  loading: false,
  error: null,
};

export const fetchMoodEntries = createAsyncThunk<MoodEntry[]>(
  'mood/fetchEntries',
  async () => {
    const response = await client.get<MoodEntry[]>('/api/mood');
    return response.data;
  }
);

export const addMoodEntry = createAsyncThunk<MoodEntry, Omit<MoodEntry, 'id'>>(
  'mood/addEntry',
  async (entry) => {
    const response = await client.post<MoodEntry>('/api/mood', entry);
    return response.data;
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchMoodEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch mood entries';
      })
      .addCase(addMoodEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      });
  },
});

export default moodSlice.reducer;