import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Target } from 'lucide-react';
import { colors } from '../../utils/colors';
import { Resource } from '../../types/resources';
import { ResourceProgressBar } from './ResourceProgressBar';

interface ResourceSectionProps {
  title: string;
  description: string;
  resources: Resource[];
  icon?: React.ReactNode;
  onResourceView: (resource: Resource) => void;
  onResourceBookmark: (resource: Resource) => void;
}

export const ResourceSection: React.FC<ResourceSectionProps> = ({
  title,
  description,
  resources,
  icon,
  onResourceView,
  onResourceBookmark
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 rounded-xl backdrop-blur-sm"
      style={{ backgroundColor: `${colors.warmCream.light}dd` }}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="text-2xl font-semibold" style={{ color: colors.charcoalGray.DEFAULT }}>
          {title}
        </h2>
      </div>

      <p className="mb-6" style={{ color: colors.charcoalGray.light }}>
        {description}
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {resources.map((resource) => (
          <motion.div
            key={resource.id}
            variants={item}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            className="group p-4 rounded-lg cursor-pointer transition-all duration-300"
            style={{
              backgroundColor: colors.lightMint.light,
              border: `1px solid ${colors.sageGreen.light}`
            }}
            onClick={() => onResourceView(resource)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3
                className="font-medium group-hover:text-sage-600 transition-colors duration-300"
                style={{ color: colors.charcoalGray.DEFAULT }}
              >
                {resource.title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onResourceBookmark(resource);
                }}
                className="p-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: resource.isBookmarked ? colors.dustyRose.light : 'transparent',
                  color: resource.isBookmarked ? colors.dustyRose.DEFAULT : colors.charcoalGray.light
                }}
              >
                <Heart
                  size={18}
                  fill={resource.isBookmarked ? 'currentColor' : 'none'}
                />
              </motion.button>
            </div>

            <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.charcoalGray.light }}>
              {resource.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm" style={{ color: colors.charcoalGray.light }}>
                <Clock size={16} />
                <span>{resource.duration || 0} min</span>
                <span className="mx-2">•</span>
                <Target size={16} />
                <span className="capitalize">{resource.difficulty || 'Beginner'}</span>
              </div>
            </div>

            {resource.progress !== undefined && (
              <div className="mt-3">
                <ResourceProgressBar progress={resource.progress} height="sm" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
