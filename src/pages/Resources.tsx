import { useState } from 'react';
import { Resource, ResourceType, ResourceCategory } from '../types/resources';

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Mindfulness',
    description: 'Learn the basics of mindfulness meditation and its benefits for mental health.',
    type: 'meditation',
    content: 'Guided meditation audio content...',
    category: 'mindfulness',
    duration: 10,
    difficulty: 'beginner',
    tags: ['meditation', 'mindfulness', 'beginners'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more sample resources
];

const Resources = () => {
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = SAMPLE_RESOURCES.filter((resource) => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {resource.thumbnail && (
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {resource.type}
          </span>
          {resource.duration && (
            <span className="text-sm text-gray-500">
              {resource.duration} min
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 mb-4">{resource.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {resource.difficulty && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {resource.difficulty}
              </span>
            )}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            {resource.type === 'meditation' || resource.type === 'breathing'
              ? 'Start Session'
              : 'Read More'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Self-Help Resources</h1>
        <p className="mt-2 text-gray-600">
          Explore our collection of guided meditations, exercises, and articles to support your mental wellness journey.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ResourceType | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="meditation">Meditation</option>
            <option value="breathing">Breathing</option>
            <option value="exercise">Exercise</option>
            <option value="article">Articles</option>
            <option value="journal">Journal</option>
            <option value="affirmation">Affirmations</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="anxiety">Anxiety</option>
            <option value="depression">Depression</option>
            <option value="stress">Stress</option>
            <option value="sleep">Sleep</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="self-care">Self-Care</option>
            <option value="relationships">Relationships</option>
            <option value="personal-growth">Personal Growth</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {/* Recommended Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_RESOURCES.slice(0, 3).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Daily Wellness Challenge</h2>
        <p className="mb-6">
          Practice mindful breathing for 5 minutes today. Find a quiet space, sit comfortably,
          and focus on your breath.
        </p>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
          Start Challenge
        </button>
      </div>

      {/* Progress Tracking */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Meditation Minutes</h3>
            <p className="text-3xl font-bold text-blue-600">120</p>
            <p className="text-sm text-gray-500">This week</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Sessions</h3>
            <p className="text-3xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-500">This week</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500">days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;