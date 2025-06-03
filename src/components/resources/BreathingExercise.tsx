import { useState, useEffect, useCallback } from 'react';
import { Resource } from '../../types/resources';

interface BreathingExerciseProps {
  resource: Required<Resource>;
  onComplete: () => void;
  onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

const BREATHING_PATTERNS: Record<string, BreathingPattern> = {
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, rest: 1 },
  'box': { inhale: 4, hold: 4, exhale: 4, rest: 4 },
  'relaxing': { inhale: 4, hold: 2, exhale: 6, rest: 2 },
};

const BreathingExercise = ({ resource, onComplete, onClose }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [totalCycles, setTotalCycles] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [pattern] = useState<BreathingPattern>(BREATHING_PATTERNS['4-7-8']);

  const calculateCircleSize = useCallback(() => {
    switch (phase) {
      case 'inhale':
        return 'scale-100';
      case 'hold':
        return 'scale-100';
      case 'exhale':
        return 'scale-50';
      case 'rest':
        return 'scale-50';
      default:
        return 'scale-75';
    }
  }, [phase]);

  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return pattern.hold;
              case 'hold':
                setPhase('exhale');
                return pattern.exhale;
              case 'exhale':
                setPhase('rest');
                return pattern.rest;
              case 'rest':
                setPhase('inhale');
                setCurrentCycle((prev) => prev + 1);
                return pattern.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, phase, pattern]);

  useEffect(() => {
    if (currentCycle >= totalCycles && totalCycles !== 0) {
      setIsActive(false);
      onComplete();
    }
  }, [currentCycle, totalCycles, onComplete]);

  const startExercise = () => {
    setTotalCycles(Math.floor((resource.duration * 60) / 
      (pattern.inhale + pattern.hold + pattern.exhale + pattern.rest)));
    setCurrentCycle(0);
    setPhase('inhale');
    setTimeLeft(pattern.inhale);
    setIsActive(true);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{resource.title}</h2>
            <p className="text-gray-600 mt-1">{resource.duration} minutes</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          {/* Breathing Circle */}
          <div className="relative mb-8">
            <div
              className={`w-48 h-48 rounded-full bg-blue-100 transition-transform duration-1000 ease-in-out transform ${calculateCircleSize()}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">{timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-gray-900 capitalize">{phase}</h3>
            <p className="text-gray-600 mt-2">
              Cycle {currentCycle} of {totalCycles}
            </p>
          </div>

          {/* Controls */}
          <div className="flex space-x-4">
            {!isActive ? (
              <button
                onClick={startExercise}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseExercise}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Pause
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
          <p className="text-gray-600 text-sm">
            {`Find a comfortable position and follow the circle's rhythm. 
            Inhale through your nose as the circle expands, hold your breath when it's full,
            exhale through your mouth as it contracts, and rest before the next cycle.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;