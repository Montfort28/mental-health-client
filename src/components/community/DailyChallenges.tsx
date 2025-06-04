import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Users, Heart, TrendingUp, Check } from 'lucide-react';
import { createIconElement } from '../../utils/iconHelper';

interface Challenge {
    id: string;
    title: string;
    description: string;
    category: 'mindfulness' | 'social' | 'mood' | 'growth';
    participants: number;
    completions: number;
    icon: React.ReactElement;
    reward: string;
    points: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

const getIcon = {
    mindfulness: () => createIconElement(Heart, { className: "w-5 h-5" }),
    social: () => createIconElement(Users, { className: "w-5 h-5" }),
    mood: () => createIconElement(TrendingUp, { className: "w-5 h-5" }),
    growth: () => createIconElement(Award, { className: "w-5 h-5" }),
    check: () => createIconElement(Check, { className: "w-5 h-5" })
};

const categoryColors = {
    mindfulness: {
        bg: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200'
    },
    social: {
        bg: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-200'
    },
    mood: {
        bg: 'from-pink-500 to-pink-600',
        light: 'bg-pink-50',
        text: 'text-pink-800',
        border: 'border-pink-200'
    },
    growth: {
        bg: 'from-green-500 to-green-600',
        light: 'bg-green-50',
        text: 'text-green-800',
        border: 'border-green-200'
    }
};

const sampleChallenges: Challenge[] = [
    {
        id: '1',
        title: '5-Minute Mindfulness',
        description: 'Take 5 minutes to practice mindful breathing with our community.',
        category: 'mindfulness',
        participants: 245, completions: 178,
        icon: getIcon.mindfulness(),
        reward: '🌸 Peace Lily seed',
        points: 50,
        difficulty: 'easy'
    },
    {
        id: '2',
        title: 'Gratitude Circle',
        description: 'Share one thing you\'re grateful for with the community.',
        category: 'social',
        participants: 189, completions: 156,
        icon: getIcon.social(),
        reward: '🌻 Joy Flower seed',
        points: 75,
        difficulty: 'medium'
    },
    {
        id: '3',
        title: 'Mood Boost Chain',
        description: 'Complete 3 mood-boosting activities of your choice.',
        category: 'mood',
        participants: 167, completions: 89,
        icon: getIcon.mood(),
        reward: '🌺 Happiness Bloom seed',
        points: 100,
        difficulty: 'hard'
    }
];

const DailyChallenges: React.FC = () => {
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);

    // Load completed challenges from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('completedChallenges');
        if (saved) {
            setCompletedChallenges(JSON.parse(saved));
        }
    }, []);

    // Save completed challenges to localStorage
    useEffect(() => {
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
    }, [completedChallenges]);

    const handleChallengeComplete = (challenge: Challenge) => {
        if (!completedChallenges.includes(challenge.id)) {
            setCompletedChallenges(prev => [...prev, challenge.id]);
            setSelectedChallenge(challenge);
            setShowCompletionMessage(true);

            // Hide completion message after 2 seconds
            setTimeout(() => {
                setShowCompletionMessage(false);
            }, 2000);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Daily Growth Challenges
                </h2>
                <div className="flex items-center gap-2">
                    {createIconElement(Award, { className: "w-5 h-5 text-yellow-500" })}
                    <span className="text-sm text-gray-600">Earn rewards together</span>
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {showCompletionMessage && selectedChallenge && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="xed inset-x-0 top-4 mx-auto w-max z-50"
                        >
                            <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${categoryColors[selectedChallenge.category].light}`}>
                                {createIconElement(Check, { className: `w-5 h-5 ${categoryColors[selectedChallenge.category].text}` })}
                                <span className={categoryColors[selectedChallenge.category].text}>
                                    Challenge completed! +{selectedChallenge.reward}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {sampleChallenges.map((challenge, index) => (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="backdrop-blur-sm bg-white/40 rounded-lg border border-white/20 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.2
                                        }}
                                        className="text-2xl"
                                    >
                                        {challenge.icon}
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                                            <span className="text-sm text-purple-600 font-medium">+{challenge.points} pts</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${challenge.difficulty === 'easy'
                                                ? 'bg-green-100 text-green-700'
                                                : challenge.difficulty === 'medium'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => handleChallengeComplete(challenge)}
                                    disabled={completedChallenges.includes(challenge.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`mt-3 w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform shadow-md ${completedChallenges.includes(challenge.id) ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {completedChallenges.includes(challenge.id) ? (
                                        <span className="flex items-center gap-1">
                                            {React.createElement(Check, { className: "w-4 h-4" })}
                                            Completed
                                        </span>
                                    ) : (
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center"
                                        >
                                            {React.createElement(Check, { className: "w-4 h-4" })}
                                            <span className="ml-1">Join Challenge</span>
                                        </motion.span>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="mt-6 text-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform shadow-md"
                >
                    <span className="mr-2">🎯</span>
                    View All Challenges
                </motion.button>
            </div>
        </div>
    );
};

export default DailyChallenges;
