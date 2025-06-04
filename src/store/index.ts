import { configureStore } from '@reduxjs/toolkit';
import gardenReducer from './gardenSlice';
import moodReducer from './moodSlice';
import profileReducer from './profileSlice';
import communityReducer from './communitySlice';
import resourcesReducer from './resourcesSlice';

export const store = configureStore({
  reducer: {
    garden: gardenReducer,
    mood: moodReducer,
    profile: profileReducer,
    community: communityReducer,
    resources: resourcesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;