import React from 'react';
import { Heart } from 'lucide-react';
import { colors } from '../../utils/colors';
import { motion } from 'framer-motion';

interface ResourceBookmarkButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export const ResourceBookmarkButton: React.FC<ResourceBookmarkButtonProps> = ({
  isBookmarked,
  onClick,
  variant = 'icon',
  size = 'md'
}) => {
  const sizeMap = {
    sm: { button: 'h-8', icon: 16 },
    md: { button: 'h-10', icon: 20 },
    lg: { button: 'h-12', icon: 24 }
  };

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`flex items-center gap-2 px-4 ${sizeMap[size].button} rounded-lg transition-colors`}
        style={{
          backgroundColor: isBookmarked ? colors.dustyRose.light : colors.lightMint.light,
          color: isBookmarked ? colors.dustyRose.DEFAULT : colors.charcoalGray.DEFAULT
        }}
      >
        <Heart
          size={sizeMap[size].icon}
          fill={isBookmarked ? 'currentColor' : 'none'}
        />
        <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex items-center justify-center rounded-full transition-colors ${
        size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'
      }`}
      style={{
        backgroundColor: isBookmarked ? colors.dustyRose.light : 'transparent',
        color: isBookmarked ? colors.dustyRose.DEFAULT : colors.charcoalGray.light
      }}
    >
      <Heart
        size={sizeMap[size].icon}
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </motion.button>
  );
};
