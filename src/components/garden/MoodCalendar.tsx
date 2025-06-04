import React from 'react';
import { motion } from 'framer-motion';

interface MoodEntry {
    date: Date;
    mood: number;
    activities: string[];
    notes?: string;
}

interface MoodCalendarProps {
    entries: MoodEntry[];
    onDayClick: (date: Date) => void;
}

const moodColors = {
    1: 'from-red-400 to-red-500',
    2: 'from-orange-400 to-orange-500',
    3: 'from-yellow-400 to-yellow-500',
    4: 'from-green-400 to-green-500',
    5: 'from-blue-400 to-blue-500',
};

const MoodCalendar: React.FC<MoodCalendarProps> = ({ entries, onDayClick }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const monthName = today.toLocaleString('default', { month: 'long' });

    const getMoodForDate = (date: Date) => {
        const entry = entries.find(e =>
            e.date.getDate() === date.getDate() &&
            e.date.getMonth() === date.getMonth() &&
            e.date.getFullYear() === date.getFullYear()
        );
        return entry?.mood;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{monthName} {currentYear}</h2>
                <div className="flex space-x-2">
                    {Object.entries(moodColors).map(([level, gradient]) => (
                        <div key={level} className="flex items-center">
                            <div className={`w-4 h-4 rounded bg-gradient-to-br ${gradient}`}></div>
                            <span className="ml-1 text-xs text-gray-600">Level {level}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                    </div>
                ))}

                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = new Date(currentYear, currentMonth, index + 1);
                    const mood = getMoodForDate(date);
                    const isToday = index + 1 === today.getDate();
                    const hasEntry = mood !== undefined;

                    return (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDayClick(date)}
                            className={`aspect-square rounded-lg flex items-center justify-center relative
                                ${hasEntry
                                    ? `bg-gradient-to-br ${moodColors[mood as keyof typeof moodColors]} text-white shadow-md`
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }
                                ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                            `}
                        >
                            <span className={`text-sm ${hasEntry ? 'font-medium' : ''}`}>
                                {index + 1}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodCalendar;
