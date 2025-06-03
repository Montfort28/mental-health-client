import React, { useState, useEffect } from 'react';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingPattern {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    rest: number;
    description: string;
}

const breathingPatterns: BreathingPattern[] = [
    {
        name: 'Square Breathing',
        inhale: 4,
        hold: 4,
        exhale: 4,
        rest: 4,
        description: 'A calming technique that helps reduce stress and improve focus'
    },
    {
        name: '4-7-8 Breathing',
        inhale: 4,
        hold: 7,
        exhale: 8,
        rest: 0,
        description: 'A relaxing pattern that can help with anxiety and sleep'
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

const BreathingExercise: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
    const [phase, setPhase] = useState<BreathingPhase>('inhale');
    const [timeLeft, setTimeLeft] = useState(0);
    const [cycles, setCycles] = useState(0);

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
        setIsActive(true);
        setPhase('inhale');
        setTimeLeft(selectedPattern.inhale);
        setCycles(0);
    };

    const stopExercise = () => {
        setIsActive(false);
        setPhase('inhale');
        setTimeLeft(0);
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

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Breathing Exercise</h2>

            {/* Pattern Selection */}
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
                    disabled={isActive}
                >
                    {breathingPatterns.map((pattern) => (
                        <option key={pattern.name} value={pattern.name}>
                            {pattern.name}
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-sm text-gray-600">{selectedPattern.description}</p>
            </div>

            {/* Visualization */}
            {isActive && (
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
                </div>
            )}

            {/* Controls */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={isActive ? stopExercise : startExercise}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors
            ${isActive
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    {isActive ? 'Stop' : 'Start'}
                </button>
            </div>

            {/* Stats */}
            {isActive && (
                <div className="mt-6 text-center text-gray-600">
                    <p>Completed cycles: {cycles}</p>
                </div>
            )}
        </div>
    );
};

export default BreathingExercise;
