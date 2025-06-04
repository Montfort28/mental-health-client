import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smile, Sun, Moon, Heart } from 'lucide-react';

interface DailyCheckInProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MoodOption {
    emoji: string;
    label: string;
    value: number;
    icon: React.ReactElement;
}

const moodOptions: MoodOption[] = [
    { emoji: '😊', label: 'Great', value: 5, icon: <Smile className="text-green-500" /> },
    { emoji: '🙂', label: 'Good', value: 4, icon: <Smile className="text-blue-500" /> },
    { emoji: '😐', label: 'Okay', value: 3, icon: <Smile className="text-yellow-500" /> },
    { emoji: '😕', label: 'Not Great', value: 2, icon: <Smile className="text-orange-500" /> },
    { emoji: '😢', label: 'Struggling', value: 1, icon: <Smile className="text-red-500" /> }
];

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ isOpen, onClose }) => {
    const [mood, setMood] = useState<number | null>(null);
    const [energy, setEnergy] = useState<number>(3);
    const [gratitude, setGratitude] = useState('');

    const handleSubmit = () => {
        if (mood === null) return;
        // TODO: Implement submission to backend
        console.log({ mood, energy, gratitude });
        onClose();
    };

    const handleEnergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnergy(Number(e.target.value));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <Heart className="w-12 h-12 mx-auto text-pink-500 mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                Daily Check-In
                            </h2>

                            <div className="space-y-6">
                                {/* Mood Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        How are you feeling today?
                                    </label>
                                    <div className="flex justify-center space-x-4">
                                        {moodOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => setMood(option.value)}
                                                className={`p-3 rounded-lg transition-all ${mood === option.value
                                                    ? 'bg-blue-100 scale-110'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{option.emoji}</div>
                                                <div className="text-xs text-gray-600">
                                                    {option.label}
                                                </div>
                                                <div className="mt-1">
                                                    {option.icon}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Energy Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Energy Level
                                    </label>
                                    <div className="flex justify-center items-center space-x-2">
                                        <Moon className="text-gray-400" />
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={energy}
                                            onChange={handleEnergyChange}
                                            className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <Sun className="text-yellow-500" />
                                    </div>
                                </div>

                                {/* Gratitude */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        What&apos;s one thing you&apos;re grateful for today?
                                    </label>
                                    <textarea
                                        value={gratitude}
                                        onChange={(e) => setGratitude(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="I&apos;m grateful for..."
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-colors"
                                >
                                    Submit Check-In
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DailyCheckIn;
