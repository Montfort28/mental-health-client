import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const tips = [
    {
        title: "Practice Deep Breathing",
        description: "Take 5 deep breaths when feeling overwhelmed.",
        category: "stress",
        icon: "🌬️"
    },
    {
        title: "Stay Hydrated",
        description: "Drink water regularly throughout the day.",
        category: "physical",
        icon: "💧"
    },
    {
        title: "Practice Gratitude",
        description: "List 3 things you're thankful for today.",
        category: "mental",
        icon: "🙏"
    },
    {
        title: "Take Movement Breaks",
        description: "Stand up and stretch every hour.",
        category: "physical",
        icon: "🚶"
    },
    {
        title: "Connect with Others",
        description: "Reach out to a friend or family member.",
        category: "social",
        icon: "👥"
    },
    {
        title: "Practice Mindfulness",
        description: "Focus on the present moment for 1 minute.",
        category: "mental",
        icon: "🧘"
    },
    {
        title: "Get Some Sunlight",
        description: "Spend 10 minutes in natural light.",
        category: "physical",
        icon: "☀️"
    },
    {
        title: "Express Yourself",
        description: "Write down your thoughts and feelings.",
        category: "mental",
        icon: "✍️"
    }
];

const WellnessTips: React.FC = () => {
    const [currentTip, setCurrentTip] = useState(tips[0]);
    const [isRotating, setIsRotating] = useState(false);

    const getRandomTip = () => {
        setIsRotating(true);
        const newTip = tips[Math.floor(Math.random() * tips.length)];
        setCurrentTip(newTip);
        setTimeout(() => setIsRotating(false), 500);
    };

    useEffect(() => {
        // Change tip every 5 minutes
        const interval = setInterval(getRandomTip, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Wellness Tip</h3>
                <button
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                    onClick={getRandomTip}
                >
                    {React.createElement(RefreshCw, { className: "w-5 h-5" })}
                </button>
            </div>

            <div className="text-center py-4">
                <div className="text-4xl mb-4">{currentTip.icon}</div>
                <h4 className="text-xl font-medium text-gray-800 mb-2">{currentTip.title}</h4>
                <p className="text-gray-600">{currentTip.description}</p>
            </div>

            <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    #{currentTip.category}
                </span>
            </div>
        </div>
    );
};

export default WellnessTips;
