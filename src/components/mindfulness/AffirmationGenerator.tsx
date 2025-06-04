import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiRefreshCw } from 'react-icons/fi';

interface AffirmationGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
}

const affirmations: string[] = [
    "I am capable of achieving great things",
    "I choose to be confident and self-assured",
    "I am worthy of love and respect",
    "I trust in my ability to make good decisions",
    "I am growing and learning every day",
    "I radiate positivity and attract positivity",
    "I am in charge of my own happiness",
    "I embrace the challenges that help me grow",
    "I celebrate my strengths and accept my weaknesses",
    "I am resilient and can overcome any obstacle",
    "My potential is limitless",
    "I deserve peace and tranquility",
    "I am grateful for this present moment",
    "My mind is clear and my heart is open",
    "I choose to see the good in every situation"
];

const AffirmationGenerator: React.FC<AffirmationGeneratorProps> = ({ isOpen, onClose }): JSX.Element => {
    const [currentAffirmation, setCurrentAffirmation] = useState<string>(
        affirmations[Math.floor(Math.random() * affirmations.length)]
    );
    const [isRotating, setIsRotating] = useState<boolean>(false);

    const generateNewAffirmation = (): void => {
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
                            <FiX className="w-6 h-6" />
                        </button>

                        <div className="text-center py-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                Daily Affirmation
                            </h2>

                            <motion.div
                                key={currentAffirmation}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <p className="text-xl text-gray-700 italic">
                                    {currentAffirmation}
                                </p>
                            </motion.div>

                            <button
                                onClick={generateNewAffirmation}
                                className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FiRefreshCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
                                <span>New Affirmation</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AffirmationGenerator;
