import React from 'react';
import { Calendar } from 'lucide-react';

interface Day {
    date: string;
    completed: boolean;
}

const ActivityStreak: React.FC = () => {
    const generateLastWeek = (): Day[] => {
        const days: Day[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split('T')[0],
                completed: Math.random() > 0.3 // Simulated completion status
            });
        }
        return days;
    };

    const days = generateLastWeek();
    const streakCount = days.reduce((acc, day, index) => {
        if (index === 0) return day.completed ? 1 : 0;
        if (!day.completed) return acc;
        return days[index - 1].completed ? acc + 1 : 1;
    }, 0);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center mb-4">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-800 ml-2">Activity Streak</h2>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                {days.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${day.completed
                                ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-400'
                                }`}
                        >
                            {day.completed ? '✓' : '·'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">
                    {streakCount}
                </div>
                <div className="text-sm text-gray-600">
                    Day{streakCount !== 1 ? 's' : ''} in a Row
                </div>
            </div>

            {streakCount >= 5 && (
                <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm text-center">
                    🎉 Amazing! You&apos;re on a {streakCount}-day streak!
                </div>
            )}
        </div>
    );
};

export default ActivityStreak;
