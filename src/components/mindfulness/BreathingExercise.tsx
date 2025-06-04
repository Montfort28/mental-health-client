import React, { useState, useEffect } from 'react';
import { useMentalHealth } from '../../contexts/MentalHealthContext';
import BreathingStats from './BreathingStats';

interface BreathingPattern {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    rest: number;
    description: string;
}

interface StressLevel {
    level: number;
    label: string;
    color: string;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
type SessionPhase = 'pre' | 'active' | 'post' | 'complete';

const breathingPatterns: BreathingPattern[] = [
    {
        name: 'Square Breathing',
        inhale: 4,
        hold: 4,
        exhale: 4,
        rest: 4,
        description: 'A balanced pattern for focus and calmness'
    },
    {
        name: 'Deep Calm',
        inhale: 5,
        hold: 2,
        exhale: 6,
        rest: 2,
        description: 'A gentle pattern for deep relaxation and stress relief'
    }
];

const stressLevels: StressLevel[] = [
    { level: 1, label: 'Very Relaxed', color: 'from-green-300 to-green-500' },
    { level: 2, label: 'Relaxed', color: 'from-green-200 to-green-400' },
    { level: 3, label: 'Neutral', color: 'from-blue-200 to-blue-400' },
    { level: 4, label: 'Slightly Stressed', color: 'from-yellow-200 to-yellow-400' },
    { level: 5, label: 'Stressed', color: 'from-orange-200 to-orange-400' },
    { level: 6, label: 'Very Stressed', color: 'from-red-200 to-red-400' }
];

const BreathingExercise: React.FC = () => {
    const { createBreathingSession, breathingSessions, breathingStats, fetchBreathingSessions, fetchBreathingStats } = useMentalHealth();

    const [isActive, setIsActive] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
    const [phase, setPhase] = useState<BreathingPhase>('inhale');
    const [sessionPhase, setSessionPhase] = useState<SessionPhase>('pre');
    const [timeLeft, setTimeLeft] = useState(0);
    const [cycles, setCycles] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [stressLevelBefore, setStressLevelBefore] = useState<number | null>(null);
    const [stressLevelAfter, setStressLevelAfter] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchBreathingSessions();
        fetchBreathingStats();
    }, [fetchBreathingSessions, fetchBreathingStats]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isActive) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        // Move to next phase
                        switch (phase) {
                            case 'inhale':
                                setPhase('hold');
                                return selectedPattern.hold;
                            case 'hold':
                                setPhase('exhale');
                                return selectedPattern.exhale;
                            case 'exhale':
                                setPhase(selectedPattern.rest > 0 ? 'rest' : 'inhale');
                                if (selectedPattern.rest === 0) {
                                    setCycles((prev) => prev + 1);
                                }
                                return selectedPattern.rest || selectedPattern.inhale;
                            case 'rest':
                                setPhase('inhale');
                                setCycles((prev) => prev + 1);
                                return selectedPattern.inhale;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isActive, phase, selectedPattern]);

    const startExercise = () => {
        if (stressLevelBefore === null) {
            setError("Please rate your stress level before starting");
            return;
        }
        setError(null);
        setIsActive(true);
        setSessionPhase('active');
        setPhase('inhale');
        setTimeLeft(selectedPattern.inhale);
        setCycles(0);
        setSessionStartTime(new Date());
    };

    const stopExercise = () => {
        setIsActive(false);
        setPhase('inhale');
        setTimeLeft(0);
        setSessionPhase('post');
    };

    const getPhaseInstruction = () => {
        switch (phase) {
            case 'inhale':
                return 'Breathe in slowly...';
            case 'hold':
                return 'Hold your breath...';
            case 'exhale':
                return 'Breathe out gently...';
            case 'rest':
                return 'Rest...';
        }
    };

    const progressPercentage = () => {
        const total = phase === 'inhale' ? selectedPattern.inhale
            : phase === 'hold' ? selectedPattern.hold
                : phase === 'exhale' ? selectedPattern.exhale
                    : selectedPattern.rest;
        return ((total - timeLeft) / total) * 100;
    };

    const handleStressLevelSubmit = async () => {
        if (stressLevelBefore !== null && stressLevelAfter !== null && sessionStartTime) {
            setIsLoading(true);
            setError(null);
            try {
                const duration = cycles * (selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale + selectedPattern.rest);
                await createBreathingSession({
                    patternName: selectedPattern.name,
                    durationMinutes: Math.ceil(duration / 60), // Convert seconds to minutes
                    completedCycles: cycles,
                    stressLevelBefore,
                    stressLevelAfter,
                    notes
                });

                setSuccessMessage("Session recorded successfully!");
                setSessionPhase("complete");

                // Reset states after delay
                setTimeout(() => {
                    setStressLevelBefore(null);
                    setStressLevelAfter(null);
                    setNotes('');
                    setSessionPhase('pre');
                    setSuccessMessage(null);
                }, 3000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to save session');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Breathing Exercise</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Pattern Selection */}
                {sessionPhase === 'pre' && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose a breathing pattern:
                        </label>
                        <select
                            value={selectedPattern.name}
                            onChange={(e) => {
                                const pattern = breathingPatterns.find(p => p.name === e.target.value);
                                if (pattern) setSelectedPattern(pattern);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled={sessionPhase !== 'pre'}
                        >
                            {breathingPatterns.map((pattern) => (
                                <option key={pattern.name} value={pattern.name}>
                                    {pattern.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-gray-600">{selectedPattern.description}</p>

                        {/* Initial Stress Level Input */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                How stressed do you feel right now?
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {stressLevels.map((level) => (
                                    <button
                                        key={level.level}
                                        onClick={() => setStressLevelBefore(level.level)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all
                                        ${level.color} bg-gradient-to-r
                                        ${stressLevelBefore === level.level ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Visualization */}
                {sessionPhase === 'active' && (
                    <div className="mb-6">
                        <div className="relative w-48 h-48 mx-auto">
                            <div
                                className={`absolute inset-0 rounded-full border-4 border-blue-500 transition-transform duration-1000
                                ${phase === 'inhale' ? 'scale-100' : phase === 'exhale' ? 'scale-75' : 'scale-90'}`}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 mb-2">{timeLeft}</div>
                                    <div className="text-sm text-gray-600">{getPhaseInstruction()}</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercentage()}%` }}
                            ></div>
                        </div>
                        <div className="mt-6 text-center text-gray-600">
                            <p>Completed cycles: {cycles}</p>
                        </div>
                    </div>
                )}

                {/* Post-Session Stress Level Input */}
                {sessionPhase === 'post' && (
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            How do you feel now?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {stressLevels.map((level) => (
                                <button
                                    key={level.level}
                                    onClick={() => setStressLevelAfter(level.level)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all
                                    ${level.color} bg-gradient-to-r
                                    ${stressLevelAfter === level.level ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="How was your session? Add any notes here..."
                            />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-center space-x-4 mt-6">
                    {sessionPhase === 'pre' && stressLevelBefore !== null && (
                        <button
                            onClick={startExercise}
                            className="px-6 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                        >
                            Start
                        </button>
                    )}
                    {sessionPhase === 'active' && (
                        <button
                            onClick={stopExercise}
                            className="px-6 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                            Stop
                        </button>
                    )}
                    {sessionPhase === 'post' && (
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setSessionPhase('pre')}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleStressLevelSubmit}
                                disabled={isLoading || stressLevelAfter === null}
                                className={`px-4 py-2 rounded-lg font-medium text-white transition-colors
                                ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                            >
                                {isLoading ? 'Saving...' : 'Save Session'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <BreathingStats
                sessions={breathingSessions}
                stats={breathingStats}
            />
        </div>
    );
};

export default BreathingExercise;
