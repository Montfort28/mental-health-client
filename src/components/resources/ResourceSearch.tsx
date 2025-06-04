import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ResourceCategory, ResourceType } from '../../types/resources';
import { colors } from '../../utils/colors';

interface ResourceSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ResourceCategory | null;
  onCategoryChange: (category: ResourceCategory | null) => void;
  selectedType: ResourceType | null;
  onTypeChange: (type: ResourceType | null) => void;
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-8">
      <m.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
              size={20}
              style={{ color: isFocused ? colors.sageGreen.DEFAULT : colors.charcoalGray.light }}
            />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300"
              style={{
                backgroundColor: colors.warmCream.light,
                borderColor: isFocused ? colors.sageGreen.DEFAULT : colors.sageGreen.light,
                color: colors.charcoalGray.DEFAULT,
                boxShadow: isFocused ? `0 0 0 2px ${colors.sageGreen.light}` : 'none'
              }}
            />
            <AnimatePresence>
              {searchQuery && (
                <m.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => onSearchChange('')}
                  style={{ color: colors.charcoalGray.light }}
                >
                  <X size={16} />
                </m.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={selectedType || ''}
              onChange={(e) => onTypeChange(e.target.value ? e.target.value as ResourceType : null)}
              className="px-4 py-3 rounded-lg border transition-all duration-300"
              style={{
                backgroundColor: colors.warmCream.light,
                borderColor: selectedType ? colors.sageGreen.DEFAULT : colors.sageGreen.light,
                color: colors.charcoalGray.DEFAULT
              }}
            >
              <option value="">All Types</option>
              {Object.values(ResourceType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value ? e.target.value as ResourceCategory : null)}
              className="px-4 py-3 rounded-lg border transition-all duration-300"
              style={{
                backgroundColor: colors.warmCream.light,
                borderColor: selectedCategory ? colors.sageGreen.DEFAULT : colors.sageGreen.light,
                color: colors.charcoalGray.DEFAULT
              }}
            >
              <option value="">All Categories</option>
              {Object.values(ResourceCategory).map((category) => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </m.div>
    </div>
  );
};
