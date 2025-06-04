import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource, ResourceType, ResourceCategory, ResourceDifficulty } from '../types/resources';
import type { RootState } from '.';

export interface ResourcesState {
    resources: Resource[];
    recommendedResources: Resource[];
    bookmarkedResources: Resource[];
    resourceNotes: {
        [resourceId: string]: string[];
    };
    userProgress: {
        [resourceId: string]: {
            progress: number;
            lastUpdated: string;
        };
    };
    isLoading: boolean;
    error: string | null;
    filters: {
        type: ResourceType | null;
        category: ResourceCategory | null;
        difficulty: ResourceDifficulty | null;
        duration: string | null;
        searchQuery: string;
    };
}

const initialState: ResourcesState = {
    resources: [],
    recommendedResources: [],
    bookmarkedResources: [],
    resourceNotes: {},
    userProgress: {},
    isLoading: false,
    error: null,
    filters: {
        type: null,
        category: null,
        difficulty: null,
        duration: null,
        searchQuery: ''
    }
};

export const resourcesSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {
        setResources: (state, action: PayloadAction<Resource[]>) => {
            state.resources = action.payload;
        },
        setRecommendedResources: (state, action: PayloadAction<Resource[]>) => {
            state.recommendedResources = action.payload;
        },
        setBookmarkedResources: (state, action: PayloadAction<Resource[]>) => {
            state.bookmarkedResources = action.payload;
        },
        addBookmark: (state, action: PayloadAction<Resource>) => {
            const resourceToBookmark = action.payload;
            state.bookmarkedResources.push(resourceToBookmark);
            state.resources = state.resources.map(r =>
                r.id.toString() === resourceToBookmark.id.toString() ? { ...r, isBookmarked: true } : r
            );
        },
        removeBookmark: (state, action: PayloadAction<string>) => {
            const resourceId = action.payload;
            state.bookmarkedResources = state.bookmarkedResources.filter(r => r.id.toString() !== resourceId);
            state.resources = state.resources.map(r =>
                r.id.toString() === resourceId ? { ...r, isBookmarked: false } : r
            );
        },
        updateResourceProgress: (state, action: PayloadAction<{ resourceId: string; progress: number }>) => {
            const { resourceId, progress } = action.payload;
            state.userProgress[resourceId] = {
                progress,
                lastUpdated: new Date().toISOString()
            };
            state.resources = state.resources.map(r =>
                r.id.toString() === resourceId ? { ...r, progress } : r
            );
        },
        addResourceNote: (state, action: PayloadAction<{ resourceId: string; note: string }>) => {
            const { resourceId, note } = action.payload;
            if (!state.resourceNotes[resourceId]) {
                state.resourceNotes[resourceId] = [];
            }
            state.resourceNotes[resourceId].push(note);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateFilters: (state, action: PayloadAction<Partial<ResourcesState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = initialState.filters;
        }
    }
});

// Selectors
export const selectResources = (state: RootState) => state.resources.resources;
export const selectBookmarkedResources = (state: RootState) => state.resources.bookmarkedResources;
export const selectResourceProgress = (state: RootState, resourceId: string) =>
    state.resources.userProgress[resourceId]?.progress || 0;
export const selectResourceNotes = (state: RootState, resourceId: string) =>
    state.resources.resourceNotes[resourceId] || [];
export const selectFilters = (state: RootState) => state.resources.filters;

export const {
    setResources,
    setRecommendedResources,
    setBookmarkedResources,
    addBookmark,
    removeBookmark,
    updateResourceProgress,
    addResourceNote,
    setLoading,
    setError,
    updateFilters,
    resetFilters
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
