import React from 'react';
import { motion } from 'framer-motion';
import { ResourceCategory } from '../../types/resources';
import { colors } from '../../utils/colors';

interface ResourceCategoryTabProps {
  category: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const ResourceCategoryTab: React.FC<ResourceCategoryTabProps> = ({
  category,
  icon,
  isSelected,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${isSelected ? 'shadow-md' : ''
      }`}
    style={{
      backgroundColor: isSelected ? colors.sageGreen.DEFAULT : colors.lightMint.light,
      color: isSelected ? colors.warmCream.light : colors.charcoalGray.DEFAULT
    }}
  >
    {icon}
    <span>{category.replace(/_/g, ' ')}</span>
  </motion.button>
);

interface ResourceCategoryTabsProps {
  selectedCategory: ResourceCategory | null;
  onCategoryChange: (category: ResourceCategory | null) => void;
  categories: {
    [K in ResourceCategory]: {
      icon: React.ReactNode;
      description: string;
    };
  };
}

export const ResourceCategoryTabs: React.FC<ResourceCategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
  categories
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <motion.div
        className="flex gap-2 p-2 min-w-max"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResourceCategoryTab
          category="All"
          icon={null}
          isSelected={selectedCategory === null}
          onClick={() => onCategoryChange(null)}
        />
        {Object.entries(categories).map(([category, { icon }]) => (
          <ResourceCategoryTab
            key={category}
            category={category}
            icon={icon}
            isSelected={selectedCategory === category}
            onClick={() => onCategoryChange(category as ResourceCategory)}
          />
        ))}
      </motion.div>
    </div>
  );
};
