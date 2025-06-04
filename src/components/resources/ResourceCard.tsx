import { motion } from 'framer-motion';
import { Clock, Heart, BookOpen, ChevronRight } from 'lucide-react';
import { Resource } from '../../types/resources';
import { colors } from '../../utils/colors';

export interface ResourceCardProps {
    resource: Resource;
    onView: (resource: Resource) => void;
    onBookmark: (resource: Resource) => void;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'beginner':
            return colors.sageGreen.light;
        case 'intermediate':
            return colors.dustyRose.DEFAULT;
        case 'advanced':
            return colors.charcoalGray.DEFAULT;
        default:
            return colors.sageGreen.light;
    }
};

export const ResourceCard = ({ resource, onView, onBookmark }: ResourceCardProps): JSX.Element => {
    const handleBookmark = (e: React.MouseEvent) => {
        e.stopPropagation();
        onBookmark(resource);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group backdrop-blur-lg rounded-xl overflow-hidden shadow-md transition-all duration-300 cursor-pointer"
            style={{ backgroundColor: colors.warmCream.light }}
            onClick={() => onView(resource)}
        >
            {resource.thumbnail && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, ${colors.warmCream.light} 100%)`
                        }}
                    />
                </div>
            )}

            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <h3
                        className="text-xl font-semibold line-clamp-2"
                        style={{ color: colors.charcoalGray.DEFAULT }}
                    >
                        {resource.title}
                    </h3>
                    <button
                        onClick={handleBookmark}
                        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                        style={{
                            backgroundColor: resource.isBookmarked ? colors.dustyRose.light : 'transparent',
                            color: resource.isBookmarked ? colors.dustyRose.DEFAULT : colors.charcoalGray.light
                        }}
                    >
                        <Heart
                            size={20}
                            fill={resource.isBookmarked ? 'currentColor' : 'none'}
                        />
                    </button>
                </div>

                <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: colors.charcoalGray.light }}
                >
                    {resource.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm" style={{ color: colors.charcoalGray.light }}>
                            <Clock size={16} />
                            <span className="text-sm">{resource.duration || 0} min</span>
                            <span className="mx-2">•</span>
                            <BookOpen size={16} style={{ color: colors.charcoalGray.light }} />
                            <span
                                className="text-sm px-2 py-0.5 rounded"
                                style={{
                                    backgroundColor: getDifficultyColor(resource.difficulty),
                                    color: colors.warmCream.light
                                }}
                            >
                                {resource.difficulty}
                            </span>
                        </div>
                    </div>
                    <ChevronRight size={20} style={{ color: colors.charcoalGray.light }} />
                </div>

                {resource.progress !== undefined && (
                    <div className="mt-4">
                        <div className="h-1 rounded-full" style={{ backgroundColor: colors.lightMint.light }}>
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
    );
};
