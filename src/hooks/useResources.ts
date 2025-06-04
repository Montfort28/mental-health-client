import { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resourcesApi } from '../services/api/resources';
import { Resource } from '../types/resources';
import {
  setResources,
  setBookmarkedResources,
  addBookmark,
  removeBookmark,
  updateResourceProgress,
  addResourceNote,
  setLoading,
  setError,
  updateFilters,
  ResourcesState
} from '../store/resourcesSlice';
import { RootState } from '../store';

type FilterValue = string | number | null;

export const useResources = () => {
  const dispatch = useDispatch();
  const { resources, bookmarkedResources, isLoading, error, filters } = useSelector(
    (state: RootState) => state.resources
  );

  const fetchResources = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const [allResources, bookmarked] = await Promise.all([
        resourcesApi.getAllResources(),
        resourcesApi.getBookmarkedResources()
      ]);
      dispatch(setResources(allResources));
      dispatch(setBookmarkedResources(bookmarked));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch resources'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const bookmarkResource = useCallback(async (resource: Resource) => {
    try {
      if (resource.isBookmarked) {
        await resourcesApi.removeBookmark(resource.id.toString());
        dispatch(removeBookmark(resource.id));
      } else {
        await resourcesApi.addBookmark(resource.id.toString());
        dispatch(addBookmark(resource));
      }
    } catch (error) {
      throw new Error('Failed to update bookmark');
    }
  }, [dispatch]);

  const updateProgress = useCallback(async (resourceId: string, progress: number) => {
    try {
      await resourcesApi.updateProgress(resourceId, progress);
      dispatch(updateResourceProgress({ resourceId, progress }));
    } catch (error) {
      throw new Error('Failed to update progress');
    }
  }, [dispatch]);

  const addNote = useCallback(async (resourceId: string, note: string) => {
    try {
      await resourcesApi.addNote(resourceId, note);
      dispatch(addResourceNote({ resourceId, note }));
    } catch (error) {
      throw new Error('Failed to add note');
    }
  }, [dispatch]);

  const updateFilter = useCallback((filterKey: keyof ResourcesState['filters'], value: FilterValue) => {
    dispatch(updateFilters({ [filterKey]: value }));
  }, [dispatch]);

  const parseDurationFilter = (duration: string): [number, number | null] => {
    if (duration === '60') return [60, null]; // > 60 minutes
    const [min, max] = duration.split('-').map(Number);
    return [min, max || null];
  };

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = !filters.searchQuery ||
        resource.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesType = !filters.type || resource.type === filters.type;
      const matchesCategory = !filters.category || resource.category === filters.category;
      const matchesDifficulty = !filters.difficulty || resource.difficulty === filters.difficulty;

      const matchesDuration = !filters.duration || (() => {
        if (!resource.duration) return false;
        const [min, max] = parseDurationFilter(filters.duration);
        return max ? (resource.duration >= min && resource.duration <= max) : resource.duration >= min;
      })();

      return matchesSearch && matchesType && matchesCategory && matchesDifficulty && matchesDuration;
    });
  }, [resources, filters]);

  return {
    resources,
    bookmarkedResources,
    filteredResources,
    isLoading,
    error,
    filters,
    updateFilter,
    bookmarkResource,
    updateProgress,
    addNote,
    fetchResources
  };
};
