import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Heart } from 'lucide-react';

interface QuickAffirmationProps {
    isOpen: boolean;
    onClose: () => void;
}

const affirmations: string[] = [
    // Mental Health & Well-being
    "I am worthy of peace, joy, and all good things",
    "My feelings are valid, and I honor them",
    "I choose to be confident and self-assured",
    "I am becoming stronger every day",
    "I trust my inner wisdom and intuition",
    "I deserve love, respect, and happiness",
    "I embrace my authenticity and uniqueness",
    "My potential is limitless",
    "I am capable of handling whatever comes my way",

    // Growth & Progress
    "Every day is a new opportunity to grow",
    "I am constantly learning and evolving",
    "I celebrate my progress, no matter how small",
    "I am patient with myself as I learn and grow",
    "My challenges help me grow stronger",
    "I welcome positive change into my life",

    // Self-Love & Acceptance
    "I am enough, just as I am",
    "I love and accept myself unconditionally",
    "I treat myself with kindness and respect",
    "My body is strong and healthy",
    "I radiate love and positivity",

    // Resilience & Strength
    "I can overcome any obstacle",
    "I am resilient and bounce back from setbacks",
    "My strength is greater than any struggle",
    "I face my fears with courage",
    "Every challenge makes me stronger",

    // Peace & Calm
    "I breathe in peace and exhale stress",
    "I am grounded and centered",
    "My mind is calm and my heart is at peace",
    "I choose tranquility over anxiety",
    "I release all tension and worry"
];

const QuickAffirmation: React.FC<QuickAffirmationProps> = ({ isOpen, onClose }) => {
    const [currentAffirmation, setCurrentAffirmation] = useState<string>(
        affirmations[Math.floor(Math.random() * affirmations.length)]
    );
    const [isRotating, setIsRotating] = useState<boolean>(false);

    const getNewAffirmation = (): void => {
        setIsRotating(true);
        const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        setCurrentAffirmation(newAffirmation);
        setTimeout(() => setIsRotating(false), 500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{
                            scale: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                damping: 25,
                                stiffness: 300
                            }
                        }}
                        exit={{
                            scale: 0.9,
                            y: 20,
                            opacity: 0,
                            transition: { duration: 0.2 }
                        }}
                        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative"
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            {React.createElement(X, { className: "w-6 h-6" })}
                        </motion.button>

                        <div className="text-center py-6">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex justify-center mb-6"
                            >
                                {React.createElement(Heart, { className: "w-12 h-12 text-pink-500" })}
                            </motion.div>

                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                Daily Affirmation
                            </h2>

                            <motion.div
                                key={currentAffirmation}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="mb-8 min-h-[100px] flex items-center justify-center"
                            >
                                <p className="text-xl text-gray-700 leading-relaxed px-4">
                                    {currentAffirmation}
                                </p>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={getNewAffirmation}
                                className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {React.createElement(RefreshCw, { className: `w-5 h-5 ${isRotating ? 'animate-spin' : ''}` })}
                                <span>New Affirmation</span>
                            </motion.button>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 text-sm text-gray-600"
                            >
                                Take a moment to reflect on this affirmation
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickAffirmation;
