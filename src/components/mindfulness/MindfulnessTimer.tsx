import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Bell } from 'lucide-react';
import { notify } from '../common/NotificationSystem';

interface MindfulnessTimerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Duration {
    label: string;
    value: number;
}

const DURATIONS: Duration[] = [
    { label: '1 min', value: 60 },
    { label: '3 min', value: 180 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 }
];

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MindfulnessTimer: React.FC<MindfulnessTimerProps> = ({ isOpen, onClose }) => {
    const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1].value);
    const [timeLeft, setTimeLeft] = useState(DURATIONS[1].value);
    const [isActive, setIsActive] = useState(false);
    const [bellAudio] = useState<HTMLAudioElement>(new Audio('/meditation-bell.mp3'));

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsActive(false);
                        bellAudio.play().then(() => {
                            notify("Mindfulness session completed! Great job taking time for yourself.", "success");
                        }).catch(console.error);
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft, bellAudio]);

    const handleStart = () => {
        if (!isActive) {
            setTimeLeft(selectedDuration);
        }
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(selectedDuration);
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
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <div className="text-center py-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                Mindfulness Timer
                            </h2>

                            <div className="flex justify-center space-x-2 mb-8">
                                {DURATIONS.map(duration => (
                                    <motion.button
                                        key={duration.value}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSelectedDuration(duration.value);
                                            setTimeLeft(duration.value);
                                            setIsActive(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg transition-colors ${selectedDuration === duration.value
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {duration.label}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mb-8">
                                <motion.div
                                    className="text-6xl font-bold text-gray-800 mb-4"
                                    key={timeLeft}
                                    initial={{ scale: 1.2, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {formatTime(timeLeft)}
                                </motion.div>
                                <div className="flex justify-center space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleStart}
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${isActive
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                            } text-white flex items-center space-x-2 shadow-lg`}
                                    >
                                        {isActive ? (
                                            <>
                                                {React.createElement(Pause, { className: "w-5 h-5" })}
                                                <span>Pause</span>
                                            </>
                                        ) : (
                                            <>
                                                {React.createElement(Play, { className: "w-5 h-5" })}
                                                <span>Start</span>
                                            </>
                                        )}
                                    </motion.button>
                                    {(isActive || timeLeft < selectedDuration) && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleReset}
                                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-lg"
                                        >
                                            Reset
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600"
                            >
                                {React.createElement(Bell, { className: "w-4 h-4 inline-block mr-1" })}
                                A bell will ring when the timer ends
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MindfulnessTimer;
