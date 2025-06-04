import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  HeartPulse,
  Phone,
  Sun,
  Users,
  GraduationCap,
  Loader
} from 'lucide-react';
import { ResourceSection } from '../components/resources/ResourceSection';
import { ResourceModal } from '../components/resources/ResourceModal';
import { ResourceSearch } from '../components/resources/ResourceSearch';
import { ResourceFilters } from '../components/resources/ResourceFilters';
import { useResources } from '../hooks/useResources';
import { Resource, ResourceCategory } from '../types/resources';
import { colors } from '../utils/colors';
import { toast } from 'react-hot-toast';

const Resources: React.FC = () => {
  const {
    filters,
    isLoading,
    error,
    updateFilter,
    bookmarkResource,
    updateProgress,
    filteredResources
  } = useResources();

  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const handleResourceView = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleResourceBookmark = async (resource: Resource) => {
    try {
      await bookmarkResource(resource);
      toast.success(
        resource.isBookmarked ? 'Resource removed from bookmarks' : 'Resource bookmarked successfully'
      );
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const getResourcesByCategory = (category: ResourceCategory) => {
    return filteredResources.filter(r => r.category === category);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-rose-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2" style={{ color: colors.charcoalGray.DEFAULT }}>
          Mental Health Resources
        </h1>
        <p className="text-lg" style={{ color: colors.charcoalGray.light }}>
          Explore our curated collection of mental health resources and tools
        </p>
      </motion.div>

      <ResourceSearch
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => updateFilter('searchQuery', query)}
        selectedCategory={filters.category}
        onCategoryChange={(category) => updateFilter('category', category)}
        selectedType={filters.type}
        onTypeChange={(type) => updateFilter('type', type)}
      />

      <ResourceFilters
        selectedType={filters.type}
        onTypeChange={(type) => updateFilter('type', type)}
        selectedDifficulty={filters.difficulty}
        onDifficultyChange={(difficulty) => updateFilter('difficulty', difficulty)}
        selectedDuration={filters.duration}
        onDurationChange={(duration) => updateFilter('duration', duration)}
      />

      <AnimatePresence>
        {Object.values(ResourceCategory).map((category) => {
          const categoryResources = getResourcesByCategory(category);
          if (categoryResources.length === 0) return null;

          return (
            <ResourceSection
              key={category}
              title={category.replace(/_/g, ' ')}
              description={getCategoryDescription(category)}
              resources={categoryResources}
              icon={getCategoryIcon(category)}
              onResourceView={handleResourceView}
              onResourceBookmark={handleResourceBookmark}
            />
          );
        })}
      </AnimatePresence>

      <ResourceModal
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        onBookmark={handleResourceBookmark}
        onUpdateProgress={(resource, progress) => updateProgress(resource.id.toString(), progress)}
      />
    </div>
  );
};

const getCategoryIcon = (category: ResourceCategory) => {
  switch (category) {
    case ResourceCategory.UNDERSTANDING_MENTAL_HEALTH:
      return <Brain size={24} />;
    case ResourceCategory.COPING_STRATEGIES:
      return <HeartPulse size={24} />;
    case ResourceCategory.CRISIS_SUPPORT:
      return <Phone size={24} />;
    case ResourceCategory.DAILY_SELF_CARE:
      return <Sun size={24} />;
    case ResourceCategory.PROFESSIONAL_SUPPORT:
      return <Users size={24} />;
    case ResourceCategory.EDUCATIONAL_LIBRARY:
      return <GraduationCap size={24} />;
  }
};

const getCategoryDescription = (category: ResourceCategory): string => {
  switch (category) {
    case ResourceCategory.UNDERSTANDING_MENTAL_HEALTH:
      return 'Learn about mental health conditions, symptoms, and warning signs.';
    case ResourceCategory.COPING_STRATEGIES:
      return 'Discover effective techniques to manage stress, anxiety, and other challenges.';
    case ResourceCategory.CRISIS_SUPPORT:
      return 'Immediate help and resources for mental health crises.';
    case ResourceCategory.DAILY_SELF_CARE:
      return 'Simple practices to maintain your mental well-being every day.';
    case ResourceCategory.PROFESSIONAL_SUPPORT:
      return 'Connect with mental health professionals and support services.';
    case ResourceCategory.EDUCATIONAL_LIBRARY:
      return 'Educational resources and research about mental health.';
  }
};

export default Resources;