import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Heart, Sun, Coffee, Music, Book, Phone, Activity, Cloud, PenTool, User, Smile, Check } from 'lucide-react';

interface Activity {
    id: string;
    name: string;
    description: string;
    duration: string;
    category: 'mindful' | 'physical' | 'social' | 'creative' | 'relaxation';
    icon: React.ReactElement;
}

const categories = {
    mindful: { label: 'Mindfulness', color: 'from-blue-500 to-blue-600' },
    physical: { label: 'Physical', color: 'from-green-500 to-green-600' },
    social: { label: 'Social', color: 'from-purple-500 to-purple-600' },
    creative: { label: 'Creative', color: 'from-yellow-500 to-yellow-600' },
    relaxation: { label: 'Relaxation', color: 'from-pink-500 to-pink-600' }
};

const baseIconStyle = "w-6 h-6";

const activities: Activity[] = [
    {
        id: '1',
        name: 'Mindful Tea Break',
        description: 'Make a cup of tea and focus on the sensations as you drink it.',
        duration: '10 mins',
        category: 'mindful',
        icon: <Coffee className={baseIconStyle} />
    },
    {
        id: '2',
        name: 'Dance Break',
        description: 'Put on your favorite song and dance like nobody\'s watching!',
        duration: '5-10 mins',
        category: 'physical',
        icon: <Music className={baseIconStyle} />
    },
    {
        id: '3',
        name: 'Gratitude Message',
        description: 'Send a message to someone you appreciate.',
        duration: '5 mins',
        category: 'social',
        icon: <Phone className={baseIconStyle} />
    },
    {
        id: '4',
        name: 'Reading Break',
        description: 'Take a short break to read something enjoyable.',
        duration: '15 mins',
        category: 'relaxation',
        icon: <Book className={baseIconStyle} />
    },
    {
        id: '5',
        name: 'Sun Salutation',
        description: 'Step outside for a moment of sunshine and deep breathing.',
        duration: '5 mins',
        category: 'mindful',
        icon: <Sun className={baseIconStyle} />
    },
    {
        id: '6',
        name: 'Mindful Breathing',
        description: 'Practice deep breathing exercises for relaxation.',
        duration: '5 mins',
        category: 'mindful',
        icon: <Cloud className={baseIconStyle} />
    },
    {
        id: '7',
        name: 'Stretch Break',
        description: 'Do some gentle stretching to release tension.',
        duration: '5-10 mins',
        category: 'physical',
        icon: <Activity className={baseIconStyle} />
    },
    {
        id: '8',
        name: 'Creative Doodle',
        description: 'Take a moment to draw or doodle freely.',
        duration: '10 mins',
        category: 'creative',
        icon: <PenTool className={baseIconStyle} />
    },
    {
        id: '9',
        name: 'Self-Reflection',
        description: 'Take a moment to check in with yourself.',
        duration: '5 mins',
        category: 'mindful',
        icon: <User className={baseIconStyle} />
    },
    {
        id: '10',
        name: 'Smile Exercise',
        description: 'Practice smiling - it can boost your mood!',
        duration: '1 min',
        category: 'mindful',
        icon: <Smile className={baseIconStyle} />
    }
];

interface CompletedActivity {
    id: string;
    timestamp: string;
}

const SelfCareRandomizer: React.FC = () => {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories | 'all'>('all');
    const [isAnimating, setIsAnimating] = useState(false);
    const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>(() => {
        const saved = localStorage.getItem('completedActivities');
        return saved ? JSON.parse(saved) : [];
    });
    const [showCompletion, setShowCompletion] = useState(false);
    const [streak, setStreak] = useState<number>(() => {
        const saved = localStorage.getItem('selfCareStreak');
        return saved ? parseInt(saved) : 0;
    });

    useEffect(() => {
        localStorage.setItem('completedActivities', JSON.stringify(completedActivities));
    }, [completedActivities]);

    useEffect(() => {
        localStorage.setItem('selfCareStreak', streak.toString());
    }, [streak]);
    const calculateStreak = React.useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const hasCompletedToday = completedActivities.some(
            activity => activity.timestamp.startsWith(today)
        );

        const hasCompletedYesterday = completedActivities.some(
            activity => activity.timestamp.startsWith(yesterday)
        );

        if (hasCompletedToday) {
            if (!hasCompletedYesterday && streak === 0) {
                setStreak(1);
            }
        } else if (!hasCompletedYesterday) {
            setStreak(0);
        }
    }, [completedActivities, streak]);
    useEffect(() => {
        calculateStreak();
    }, [completedActivities, calculateStreak]);

    const filteredActivities = activities.filter(activity =>
        selectedCategory === 'all' || activity.category === selectedCategory
    );

    const getRandomActivity = () => {
        setIsAnimating(true);
        const duration = 1000;
        const iterations = 5;
        let currentIteration = 0;

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * filteredActivities.length);
            setSelectedActivity(filteredActivities[randomIndex]);
            currentIteration++;

            if (currentIteration >= iterations) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, duration / iterations);
    };

    const completeActivity = () => {
        if (!selectedActivity) return;

        const today = new Date().toISOString();
        setCompletedActivities(prev => [...prev, { id: selectedActivity.id, timestamp: today }]);
        setShowCompletion(true);

        setTimeout(() => {
            setShowCompletion(false);
        }, 2000);
    };

    const hasCompletedToday = (activityId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return completedActivities.some(
            activity => activity.id === activityId && activity.timestamp.startsWith(today)
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Self-Care Activity</h2>
                <div className="flex items-center gap-4">
                    {streak > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                            <span className="text-orange-500">🔥</span>
                            <span className="font-medium">{streak} day streak!</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span className="text-sm text-gray-600">Take care of yourself</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === 'all'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    All
                </button>
                {Object.entries(categories).map(([key, { label }]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key as keyof typeof categories)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === key
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {showCompletion && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                    >
                        <div className="bg-white rounded-xl shadow-xl p-6 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                                <Check className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Activity Completed!</h3>
                                <p className="text-sm text-gray-600">Keep up the great work!</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    key={selectedActivity?.id || 'empty'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                >
                    {selectedActivity ? (
                        <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-r ${categories[selectedActivity.category].color} text-white`}>
                                    {selectedActivity.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800 mb-1">
                                                {selectedActivity.name}
                                            </h3>
                                            <p className="text-gray-600 mb-2">{selectedActivity.description}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>⏱️ {selectedActivity.duration}</span>
                                                <span>•</span>
                                                <span>{categories[selectedActivity.category].label}</span>
                                            </div>
                                        </div>
                                        {hasCompletedToday(selectedActivity.id) ? (
                                            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                <Check className="w-4 h-4" />
                                                Done today
                                            </div>
                                        ) : (
                                            <button
                                                onClick={completeActivity}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Click the button below to get a random self-care activity
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-center">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getRandomActivity}
                    disabled={isAnimating}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-shadow flex items-center gap-2
            ${isAnimating ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    <Shuffle className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
                    <span>{isAnimating ? 'Shuffling...' : 'Shuffle Activity'}</span>
                </motion.button>
            </div>
        </div>
    );
};

export default SelfCareRandomizer;
