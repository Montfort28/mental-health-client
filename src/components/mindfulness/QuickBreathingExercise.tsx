import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind } from 'lucide-react';

interface QuickBreathingExerciseProps {
    isOpen: boolean;
    onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

const QuickBreathingExercise: React.FC<QuickBreathingExerciseProps> = ({ isOpen, onClose }) => {
    const [phase, setPhase] = useState<BreathingPhase>('inhale');
    const [counter, setCounter] = useState<number>(4);
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive) {
            timer = setInterval(() => {
                setCounter((prev) => {
                    if (prev <= 1) {
                        // Switch phases
                        switch (phase) {
                            case 'inhale':
                                setPhase('hold');
                                return 4;
                            case 'hold':
                                setPhase('exhale');
                                return 4;
                            case 'exhale':
                                setPhase('inhale');
                                return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, phase]);

    const handleStart = () => {
        setIsActive(true);
        setPhase('inhale');
        setCounter(4);
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase('inhale');
        setCounter(4);
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
                        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <Wind className="w-12 h-12 text-blue-500" />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Quick Breathing Exercise
                            </h2>

                            <div className="mb-8">
                                <motion.div
                                    animate={{
                                        scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 1,
                                        opacity: phase === 'hold' ? 0.8 : 1
                                    }}
                                    transition={{ duration: 1 }}
                                    className="w-32 h-32 rounded-full border-4 border-blue-500 mx-auto flex items-center justify-center"
                                >
                                    <span className="text-4xl font-bold text-blue-500">
                                        {counter}
                                    </span>
                                </motion.div>
                                <p className="text-lg text-gray-600 mt-4">
                                    {phase === 'inhale' ? 'Breathe In...' :
                                        phase === 'hold' ? 'Hold...' : 'Breathe Out...'}
                                </p>
                            </div>

                            <button
                                onClick={isActive ? handleStop : handleStart}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors
                                    ${isActive
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-blue-500 hover:bg-blue-600'} 
                                    text-white`}
                            >
                                {isActive ? 'Stop' : 'Start'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickBreathingExercise;
