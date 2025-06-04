import React from 'react';
import { BreathingSession, BreathingSessionStats } from '../../types/breathing';

interface BreathingStatsProps {
    sessions: BreathingSession[];
    stats: BreathingSessionStats | null;
}

const BreathingStats: React.FC<BreathingStatsProps> = ({ sessions, stats }) => {
    if (!stats || sessions.length === 0) {
        return null;
    }

    const latestSession = sessions[sessions.length - 1];
    const stressReduction = latestSession.stressLevelBefore && latestSession.stressLevelAfter
        ? latestSession.stressLevelBefore - latestSession.stressLevelAfter
        : 0;

    return (
        <div className="mt-8">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-blue-800 font-medium mb-1">Total Sessions</h4>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalSessions}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="text-green-800 font-medium mb-1">Minutes Practiced</h4>
                    <p className="text-2xl font-bold text-green-600">{stats.totalMinutes}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-purple-800 font-medium mb-1">Avg. Session</h4>
                    <p className="text-2xl font-bold text-purple-600">
                        {Math.round(stats.totalMinutes / stats.totalSessions)} min
                    </p>
                </div>
            </div>

            {stressReduction > 0 && latestSession.stressLevelBefore && latestSession.stressLevelAfter && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h4 className="text-green-800 font-medium mb-2">Last Session Impact</h4>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(latestSession.stressLevelAfter / latestSession.stressLevelBefore) * 100}%` }}
                            />
                        </div>
                        <span className="text-green-700 font-medium">
                            {stressReduction} point{stressReduction !== 1 ? 's' : ''} reduction
                        </span>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-blue-800 font-medium mb-4">Recent Sessions</h4>
                <div className="space-y-3">
                    {sessions.slice(-3).reverse().map((session, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <div>
                                <p className="text-blue-900 font-medium">{session.patternName}</p>
                                <p className="text-sm text-blue-700">
                                    {session.durationMinutes} minutes • {session.completedCycles} cycles
                                </p>
                            </div>
                            {session.stressLevelBefore && session.stressLevelAfter && (
                                <div className="text-sm">
                                    <span className="text-red-500">
                                        {session.stressLevelBefore}
                                    </span>
                                    {' → '}
                                    <span className="text-green-500">
                                        {session.stressLevelAfter}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreathingStats;
