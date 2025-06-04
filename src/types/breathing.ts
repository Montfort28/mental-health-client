export interface BreathingSession {
    id: number;
    userId: number;
    pattern: string;
    duration: number; // Duration in seconds
    completed: boolean;
    cycles: number;
    patternName: string;
    durationMinutes: number;
    stressLevelBefore: number | null;
    stressLevelAfter: number | null;
    completedCycles: number;
    notes: string | null;
    createdAt: Date;
}

export interface BreathingSessionStats {
    totalSessions: number;
    totalMinutes: number;
    averageStressReduction: number | null;
    longestStreak: number;
    currentStreak: number;
}

export interface BreathingPattern {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    rest: number;
    description: string;
}
