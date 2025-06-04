import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BubblePopGame from '../components/mindfulness/BubblePopGame';
import MemoryMatch from '../components/mindfulness/MemoryMatch';
import { GamesService } from '../services/games.service';

const games = [
    {
        id: 'bubble-pop',
        name: 'Bubble Pop',
        description: 'Pop bubbles with positive affirmations to practice mindfulness',
        icon: '🫧',
        component: BubblePopGame
    },
    {
        id: 'memory-match',
        name: 'Memory Match',
        description: 'Match mindfulness symbols while staying present and focused',
        icon: '🎴',
        component: MemoryMatch
    }
];

const Games = () => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [stats, setStats] = useState<{
        gamesPlayed: number;
        totalTimeSpent: number;
        averageScore: number;
        completionRate: number;
    } | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const gameStats = await GamesService.getStats();
                setStats(gameStats);
            } catch (error) {
                console.error('Failed to fetch game stats:', error);
            }
        };
        fetchStats();
    }, [selectedGame]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-serenity-50 via-mindful-50 to-healing-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-serenity-600 to-mindful-600 bg-clip-text text-transparent mb-4">
                            Mindfulness Games
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
                            Explore our collection of therapeutic games designed to reduce anxiety, improve focus,
                            and promote emotional well-being through playful mindfulness.
                        </p>

                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
                                <div className="backdrop-blur-md bg-white/30 rounded-lg p-4 shadow-soft">
                                    <div className="text-3xl font-bold text-serenity-600">{stats.gamesPlayed}</div>
                                    <div className="text-gray-600">Games Played</div>
                                </div>
                                <div className="backdrop-blur-md bg-white/30 rounded-lg p-4 shadow-soft">
                                    <div className="text-3xl font-bold text-healing-600">
                                        {formatTime(stats.totalTimeSpent)}
                                    </div>
                                    <div className="text-gray-600">Time Spent</div>
                                </div>
                                <div className="backdrop-blur-md bg-white/30 rounded-lg p-4 shadow-soft">
                                    <div className="text-3xl font-bold text-mindful-600">
                                        {Math.round(stats.averageScore)}
                                    </div>
                                    <div className="text-gray-600">Avg Score</div>
                                </div>
                                <div className="backdrop-blur-md bg-white/30 rounded-lg p-4 shadow-soft">
                                    <div className="text-3xl font-bold text-warmth-600">
                                        {Math.round(stats.completionRate)}%
                                    </div>
                                    <div className="text-gray-600">Completion</div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {!selectedGame ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {games.map((game) => (
                                <motion.div
                                    key={game.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="backdrop-blur-lg bg-white/80 rounded-xl shadow-soft border border-white/20 overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedGame(game.id)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-4xl">{game.icon}</span>
                                            <h3 className="text-xl font-semibold text-gray-800">{game.name}</h3>
                                        </div>
                                        <p className="text-gray-600">{game.description}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Coming Soon Cards */}
                            {[
                                {
                                    name: 'Zen Garden',
                                    description: 'Create and tend to your digital zen garden',
                                    icon: '🪴'
                                },
                                {
                                    name: 'Memory Match',
                                    description: 'Match cards while practicing mindfulness',
                                    icon: '🎴'
                                },
                                {
                                    name: 'Color Flow',
                                    description: 'Create art with flowing colors and music',
                                    icon: '🎨'
                                }
                            ].map((game, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="backdrop-blur-lg bg-white/60 rounded-xl shadow-softer border border-white/20 overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                                        <span className="px-4 py-2 rounded-full bg-mindful-100 text-mindful-600 text-sm font-medium">
                                            Coming Soon
                                        </span>
                                    </div>
                                    <div className="p-6 opacity-50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-4xl">{game.icon}</span>
                                            <h3 className="text-xl font-semibold text-gray-800">{game.name}</h3>
                                        </div>
                                        <p className="text-gray-600">{game.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => setSelectedGame(null)}
                                className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <span>←</span> Back to Games
                            </button>
                            {games.find(g => g.id === selectedGame)?.component &&
                                React.createElement(games.find(g => g.id === selectedGame)?.component || null)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Games;
