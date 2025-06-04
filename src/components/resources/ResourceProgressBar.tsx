import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../utils/colors';

interface ResourceProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: 'sm' | 'md';
}

export const ResourceProgressBar: React.FC<ResourceProgressBarProps> = ({
  progress,
  showLabel = false,
  height = 'sm'
}) => {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span style={{ color: colors.charcoalGray.light }}>Progress</span>
          <span style={{ color: colors.charcoalGray.DEFAULT }}>{progress}%</span>
        </div>
      )}
      <div
        className={`rounded-full w-full ${height === 'sm' ? 'h-1' : 'h-2'}`}
        style={{ backgroundColor: colors.lightMint.light }}
      >                <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            backgroundColor: colors.sageGreen.DEFAULT
          }}
        />
      </div>
    </div>
  );
};
