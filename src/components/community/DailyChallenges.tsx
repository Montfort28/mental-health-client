import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiUsers, FiHeart, FiTrendingUp, FiCheck } from 'react-icons/fi';

interface Challenge {
    id: string;
    title: string;
    description: string;
    category: 'mindfulness' | 'social' | 'mood' | 'growth';
    participants: number;
    completions: number;
    icon: React.ReactNode;
    reward: string;
}

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
        participants: 245,
        completions: 178,
        icon: <FiHeart className="w-5 h-5" />,
        reward: '🌸 Peace Lily seed'
    },
    {
        id: '2',
        title: 'Gratitude Circle',
        description: 'Share one thing you\'re grateful for with the community.',
        category: 'social',
        participants: 189,
        completions: 156,
        icon: <FiUsers className="w-5 h-5" />,
        reward: '🌻 Joy Flower seed'
    },
    {
        id: '3',
        title: 'Mood Boost Chain',
        description: 'Complete 3 mood-boosting activities of your choice.',
        category: 'mood',
        participants: 167,
        completions: 89,
        icon: <FiTrendingUp className="w-5 h-5" />,
        reward: '🌿 Healing Herb seed'
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
                <h2 className="text-xl font-semibold text-gray-800">Daily Community Challenges</h2>
                <div className="flex items-center gap-2">
                    <FiAward className="w-5 h-5 text-yellow-500" />
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
                            className="fixed inset-x-0 top-4 mx-auto w-max z-50"
                        >
                            <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${categoryColors[selectedChallenge.category].light
                                }`}>
                                <FiCheck className={`w-5 h-5 ${categoryColors[selectedChallenge.category].text}`} />
                                <span className={categoryColors[selectedChallenge.category].text}>
                                    Challenge completed! +{selectedChallenge.reward}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {sampleChallenges.map((challenge) => (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg border ${categoryColors[challenge.category].border} hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg text-white bg-gradient-to-r ${categoryColors[challenge.category].bg}`}>
                                        {challenge.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FiUsers className="w-4 h-4" />
                                                {challenge.participants} participating
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiTrendingUp className="w-4 h-4" />
                                                {challenge.completions} completed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChallengeComplete(challenge)}
                                    disabled={completedChallenges.includes(challenge.id)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${completedChallenges.includes(challenge.id)
                                            ? `${categoryColors[challenge.category].light} ${categoryColors[challenge.category].text}`
                                            : `bg-gradient-to-r ${categoryColors[challenge.category].bg} text-white hover:opacity-90`
                                        }`}
                                >
                                    {completedChallenges.includes(challenge.id) ? (
                                        <span className="flex items-center gap-1">
                                            <FiCheck className="w-4 h-4" />
                                            Completed
                                        </span>
                                    ) : (
                                        'Join Challenge'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DailyChallenges;
