// Modal component to handle resource interactions
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, Clock, Download, Bookmark, BookOpen } from 'lucide-react';
import { Resource } from '../../types/resources';
import { colors } from '../../utils/colors';

interface ResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark: (resource: Resource) => void;
  onShare?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  onUpdateProgress?: (resource: Resource, progress: number) => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  resource,
  isOpen,
  onClose,
  onBookmark,
  onShare,
  onDownload,
  onUpdateProgress
}) => {
  if (!resource) return null;

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark(resource);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        >
          <div className="min-h-screen px-4 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-xl"
              style={{ backgroundColor: colors.warmCream.light }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative">
                {resource.thumbnail && (
                  <div className="h-64 relative">
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 0%, ${colors.warmCream.light} 100%)`
                      }}
                    />
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X size={24} style={{ color: colors.charcoalGray.DEFAULT }} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={handleBookmark}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: resource.isBookmarked ? colors.dustyRose.light : colors.lightMint.light,
                      color: resource.isBookmarked ? colors.dustyRose.DEFAULT : colors.charcoalGray.DEFAULT
                    }}
                  >
                    <Heart size={20} fill={resource.isBookmarked ? 'currentColor' : 'none'} />
                    <span>{resource.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>

                  {onShare && (
                    <button
                      onClick={() => onShare(resource)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: colors.lightMint.light,
                        color: colors.charcoalGray.DEFAULT
                      }}
                    >
                      <Share2 size={20} />
                      <span>Share</span>
                    </button>
                  )}

                  {onDownload && (
                    <button
                      onClick={() => onDownload(resource)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: colors.lightMint.light,
                        color: colors.charcoalGray.DEFAULT
                      }}
                    >
                      <Download size={20} />
                      <span>Download</span>
                    </button>
                  )}
                </div>

                <h2 
                  className="text-3xl font-semibold mb-2"
                  style={{ color: colors.charcoalGray.DEFAULT }}
                >
                  {resource.title}
                </h2>

                <div className="flex items-center gap-4 mb-6 text-sm" style={{ color: colors.charcoalGray.light }}>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{resource.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>{resource.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark size={16} />
                    <span>{resource.category}</span>
                  </div>
                </div>

                <div 
                  className="prose max-w-none mb-8"
                  style={{ color: colors.charcoalGray.DEFAULT }}
                >
                  {resource.content}
                </div>

                {onUpdateProgress && resource.progress !== undefined && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span style={{ color: colors.charcoalGray.light }}>Progress</span>
                      <span style={{ color: colors.charcoalGray.DEFAULT }}>{resource.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${resource.progress}%`,
                          backgroundColor: colors.sageGreen.DEFAULT
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
