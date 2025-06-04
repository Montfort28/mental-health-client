import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Edit3, Star, Heart, X, Check } from 'lucide-react';
import { useMentalHealth } from '../../contexts/MentalHealthContext';

interface JournalTemplate {
    id: string;
    title: string;
    description: string;
    prompts: string[];
    icon: React.ReactElement;
    color: string;
}

const IconEdit: React.ReactElement = <Edit3 className="w-5 h-5 text-gray-600" />;
const IconClose: React.ReactElement = <X className="w-4 h-4" />;
const IconCheck: React.ReactElement = <Check className="w-6 h-6" />;

const moodEmojis = {
    1: { emoji: '😢', color: 'from-red-400 to-red-500', label: 'Very Sad' },
    2: { emoji: '😞', color: 'from-orange-400 to-orange-500', label: 'Sad' },
    3: { emoji: '😐', color: 'from-yellow-400 to-yellow-500', label: 'Neutral' },
    4: { emoji: '😊', color: 'from-green-400 to-green-500', label: 'Happy' },
    5: { emoji: '🌟', color: 'from-blue-400 to-blue-500', label: 'Very Happy' }
};

const journalTemplates: JournalTemplate[] = [
    {
        id: 'gratitude',
        title: 'Gratitude Journal',
        description: 'Focus on what you\'re thankful for today',
        prompts: [
            'List three things that made you smile today...',
            'What\'s something about yourself you\'re grateful for?',
            'Describe a person who made a positive impact on your day...',
            'What\'s a small pleasure you enjoyed recently?',
        ],
        icon: <Heart className="w-5 h-5" />,
        color: 'from-pink-500 to-red-500'
    },
    {
        id: 'reflection',
        title: 'Daily Reflection',
        description: 'Process your thoughts and emotions',
        prompts: [
            'How are you feeling right now? Why?',
            'What challenged you today? What did you learn?',
            'What\'s something you\'re proud of from today?',
            'What would you like to do differently tomorrow?',
        ],
        icon: <Book className="w-5 h-5" />,
        color: 'from-blue-500 to-indigo-500'
    },
    {
        id: 'growth',
        title: 'Personal Growth',
        description: 'Track your progress and set intentions',
        prompts: [
            'What small step can you take today towards your goals?',
            'What\'s a recent challenge you overcame?',
            'What\'s something new you learned about yourself?',
            'What would your future self be proud of?',
        ],
        icon: <Star className="w-5 h-5" />,
        color: 'from-yellow-500 to-orange-500'
    }
];

const ThoughtJournal: React.FC = () => {
    const { addMetric } = useMentalHealth();
    const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);
    const [entries, setEntries] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleTemplateSelect = (template: JournalTemplate) => {
        setSelectedTemplate(template);
        if (!entries[template.id]) {
            setEntries(prev => ({
                ...prev,
                [template.id]: Array(template.prompts.length).fill('')
            }));
        }
    };

    const handleEntryChange = (index: number, value: string) => {
        if (!selectedTemplate) return;
        setEntries(prev => ({
            ...prev,
            [selectedTemplate.id]: prev[selectedTemplate.id].map((entry, i) =>
                i === index ? value : entry
            )
        }));
    };

    const validateEntries = () => {
        if (!selectedTemplate) return false;
        if (!selectedMood) {
            setError('Please select your mood');
            return false;
        }
        if (entries[selectedTemplate.id].some(entry => !entry.trim())) {
            setError('Please fill out all prompts');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!selectedTemplate || !validateEntries()) return;
        setIsSubmitting(true);
        setError('');

        try {
            if (!selectedMood) return;
            await addMetric(
                selectedMood,
                undefined,
                undefined,
                entries[selectedTemplate.id].join('\n\n')
            );

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedTemplate(null);
                setSelectedMood(null);
                setEntries({});
            }, 2000);
        } catch (err) {
            setError('Failed to save entry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">            <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Thought Journal</h2>
            {IconEdit}
        </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                        {IconClose}
                    </button>
                </div>
            )}

            <AnimatePresence mode="wait">
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-50"
                    >
                        <div className="bg-white rounded-xl shadow-xl p-6 flex items-center gap-3">                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            {IconCheck}
                        </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Entry Saved!</h3>
                                <p className="text-sm text-gray-600">Your thoughts have been recorded.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!selectedTemplate ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid gap-4"
                    >
                        {journalTemplates.map((template) => (
                            <motion.button
                                key={template.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTemplateSelect(template)}
                                className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 text-left transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg text-white bg-gradient-to-r ${template.color}`}>
                                        {template.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{template.title}</h3>
                                        <p className="text-sm text-gray-600">{template.description}</p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                ← Back
                            </button>
                            <h3 className="text-lg font-medium text-gray-800">{selectedTemplate.title}</h3>
                        </div>

                        {/* Mood Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                How are you feeling right now?
                            </label>
                            <div className="flex gap-2">
                                {Object.entries(moodEmojis).map(([value, { emoji, color, label }]) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedMood(Number(value))}
                                        className={`p-3 rounded-lg transition-all ${selectedMood === Number(value)
                                            ? `bg-gradient-to-r ${color} text-white scale-105`
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{emoji}</div>
                                        <div className="text-xs">{label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Prompts */}
                        {selectedTemplate.prompts.map((prompt, index) => (
                            <div key={index} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {prompt}
                                </label>
                                <textarea
                                    value={entries[selectedTemplate.id]?.[index] || ''}
                                    onChange={(e) => handleEntryChange(index, e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                                    placeholder="Write your thoughts here..."
                                />
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className={`px-4 py-2 rounded-lg text-white bg-gradient-to-r ${selectedTemplate.color} shadow-sm hover:shadow-md transition-shadow flex items-center gap-2
                  ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Entry</span>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThoughtJournal;
