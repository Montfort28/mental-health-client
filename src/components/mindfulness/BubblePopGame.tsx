import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GamesService } from '../../services/games.service';
import { toast } from 'react-hot-toast';

interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    text: string;
}

const positiveAffirmations = [
    "I am strong",
    "I am calm",
    "I am worthy",
    "I am peaceful",
    "I am capable",
    "I am loved",
    "I am growing",
    "I am healing",
    "All is well",
    "I am enough"
];

const colors = [
    'from-serenity-300 to-serenity-400',
    'from-healing-300 to-healing-400',
    'from-mindful-300 to-mindful-400',
    'from-warmth-300 to-warmth-400'
];

const BubblePopGame: React.FC = () => {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('bubbleGameHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [gameStartTime, setGameStartTime] = useState<Date | null>(null);

    const createBubble = () => {
        const id = Math.random();
        const size = Math.random() * 40 + 60; // 60-100px
        const x = Math.random() * (window.innerWidth - size - 40) + 20;
        const y = Math.random() * (400 - size - 40) + 20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const text = positiveAffirmations[Math.floor(Math.random() * positiveAffirmations.length)];

        return { id, x, y, size, color, text };
    };

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(60);
        setBubbles([createBubble(), createBubble(), createBubble()]);
        setGameStartTime(new Date());
    };

    const popBubble = (id: number) => {
        setBubbles(prev => {
            const newBubbles = prev.filter(bubble => bubble.id !== id);
            if (newBubbles.length < 3) {
                return [...newBubbles, createBubble()];
            }
            return newBubbles;
        });
        setScore(prev => prev + 1);
    };

    const endGame = async () => {
        setIsPlaying(false);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('bubbleGameHighScore', score.toString());
        }

        if (gameStartTime) {
            try {
                const timeSpent = Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000);
                await GamesService.saveProgress({
                    gameType: 'bubble-pop',
                    score,
                    timeSpent,
                    completed: true,
                    metadata: {
                        highScore,
                        affirmationsPopped: score
                    }
                });
                toast.success('Game progress saved!');
            } catch (error) {
                console.error('Failed to save game progress:', error);
                toast.error('Failed to save game progress');
            }
        }
    };
    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            endGame();
        }
    }, [isPlaying, timeLeft, endGame]);

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-serenity-600 to-mindful-600 bg-clip-text text-transparent mb-2">
                    Mindful Bubble Pop
                </h2>
                <p className="text-gray-600">
                    Pop the bubbles and embrace positive affirmations. Each pop brings a moment of mindfulness.
                </p>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                    <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft">
                        <span className="text-serenity-700">Score: {score}</span>
                    </div>
                    <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft">
                        <span className="text-mindful-700">High Score: {highScore}</span>
                    </div>
                </div>
                {isPlaying && (
                    <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft">
                        <span className="text-warmth-700">Time: {timeLeft}s</span>
                    </div>
                )}
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden backdrop-blur-lg bg-white/20 shadow-soft border border-white/20">
                <AnimatePresence>
                    {!isPlaying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startGame}
                                className="px-8 py-4 bg-gradient-to-r from-serenity-500 to-mindful-500 text-white rounded-xl shadow-lg text-lg font-medium"
                            >
                                Start Game
                            </motion.button>
                        </motion.div>
                    )}

                    {isPlaying && bubbles.map(bubble => (
                        <motion.button
                            key={bubble.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: bubble.x,
                                y: bubble.y
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{
                                position: 'absolute',
                                width: bubble.size,
                                height: bubble.size,
                            }}
                            onClick={() => popBubble(bubble.id)}
                            className={`rounded-full bg-gradient-to-br ${bubble.color} shadow-lg backdrop-blur-sm
                flex items-center justify-center text-white text-sm font-medium p-2 text-center
                hover:shadow-xl transition-shadow cursor-pointer`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {bubble.text}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {!isPlaying && score > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6"
                >
                    <p className="text-lg text-gray-700 mb-2">
                        Game Over! You popped {score} bubbles!
                    </p>
                    {score > highScore && (
                        <p className="text-mindful-600 font-medium">New High Score! 🎉</p>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default BubblePopGame;
