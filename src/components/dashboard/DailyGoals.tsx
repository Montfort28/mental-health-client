import React, { useState } from 'react';
import { CheckCircle, Circle, Plus } from 'lucide-react';

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
                            className="flex-shrink-0"
                        >
                            {goal.completed ?
                                <CheckCircle className="w-5 h-5" /> :
                                <Circle className="w-5 h-5" />
                            }
                        </button>
                        <span className={`flex-1 text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {goal.text}
                        </span>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter a new goal..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={addGoal}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            disabled={!newGoal.trim()}
                        >
                            Add Goal
                        </button>
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                setNewGoal('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-4 flex items-center justify-center w-full py-2 text-gray-600 hover:text-gray-800"
                >
                    <Plus className="w-5 h-5" />
                    <span className="ml-2">Add Goal</span>
                </button>
            )}
        </div>
    );
};

export default DailyGoals;