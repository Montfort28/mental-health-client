import React, { useState } from 'react';
import { FiCheckCircle, FiCircle, FiPlus } from 'react-icons/fi';

interface Goal {
    id: string;
    text: string;
    completed: boolean;
}

const DailyGoals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([
        { id: '1', text: 'Complete a breathing exercise', completed: false },
        { id: '2', text: 'Write in gratitude journal', completed: false },
        { id: '3', text: 'Take a mindful walk', completed: false },
    ]);
    const [newGoal, setNewGoal] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const toggleGoal = (id: string) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            setGoals([...goals, {
                id: Date.now().toString(),
                text: newGoal.trim(),
                completed: false
            }]);
            setNewGoal('');
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Goals</h3>

            <div className="space-y-3">
                {goals.map(goal => (
                    <div
                        key={goal.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <button
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex-shrink-0 ${goal.completed ? 'text-green-500' : 'text-gray-400'}`}
                        >
                            {goal.completed ? <FiCheckCircle className="w-5 h-5" /> : <FiCircle className="w-5 h-5" />}
                        </button>
                        <span className={`flex-grow ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {goal.text}
                        </span>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="mt-4">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter your goal..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <div className="mt-2 flex space-x-2">
                        <button
                            onClick={addGoal}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Add Goal
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add New Goal</span>
                </button>
            )}
        </div>
    );
};

export default DailyGoals;
