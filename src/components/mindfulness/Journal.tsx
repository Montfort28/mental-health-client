import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Book, Save, ArrowLeft, Calendar, Tag
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface JournalEntry {
    id: string;
    content: string;
    mood: string;
    tags: string[];
    createdAt: string;
}

interface MoodOption {
    label: string;
    color: string;
    icon: string;
}

const moodOptions: MoodOption[] = [
    { label: 'Calm', color: 'bg-blue-100 text-blue-800', icon: '😌' },
    { label: 'Happy', color: 'bg-green-100 text-green-800', icon: '😊' },
    { label: 'Anxious', color: 'bg-yellow-100 text-yellow-800', icon: '😰' },
    { label: 'Sad', color: 'bg-purple-100 text-purple-800', icon: '😢' },
    { label: 'Frustrated', color: 'bg-red-100 text-red-800', icon: '😤' },
];

export const Journal: React.FC = () => {
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isViewingEntries, setIsViewingEntries] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;

    // Calculate paginated entries
    const paginatedEntries = entries.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    const totalPages = Math.ceil(entries.length / entriesPerPage);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            setIsLoading(true);
            setError('');
            // TODO: Replace with actual API call
            const response = await fetch('/api/journal/entries');
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }
            const data = await response.json();
            setEntries(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load journal entries';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            setError('');

            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                content,
                mood,
                tags,
                createdAt: new Date().toISOString(),
            };

            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            setEntries([newEntry, ...entries]);
            setContent('');
            setMood('');
            setTags([]);
            toast.success('Journal entry saved successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save journal entry';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    };

    if (isViewingEntries) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto p-6"
            >
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => setIsViewingEntries(false)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Journal
                    </button>
                    <h2 className="text-2xl font-semibold">Past Entries</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {paginatedEntries.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl p-6 shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar size={16} />
                                            {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
                                        </div>
                                        {entry.mood && (
                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                                {entry.mood}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-800 whitespace-pre-wrap mb-4">{entry.content}</p>
                                    {entry.tags.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Tag size={16} className="text-gray-400" />
                                            <div className="flex flex-wrap gap-2">
                                                {entry.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded bg-purple-100 text-purple-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded bg-purple-100 text-purple-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-6"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Book size={24} className="text-purple-600" />
                    <h2 className="text-2xl font-semibold">Journal</h2>
                </div>
                <button
                    onClick={() => setIsViewingEntries(true)}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                >
                    View Past Entries
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        How are you feeling today?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {moodOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => setMood(option.label)}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${mood === option.label
                                        ? option.color + ' ring-2 ring-offset-2 ring-purple-500'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-xl">{option.icon}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="w-full h-64 p-4 mb-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    disabled={isSubmitting}
                />

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add tags (optional)
                    </label>
                    <input
                        type="text"
                        placeholder="Type a tag and press Enter"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                e.preventDefault();
                                setTags([...tags, e.currentTarget.value.trim()]);
                                e.currentTarget.value = '';
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        disabled={isSubmitting}
                    />
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => setTags(tags.filter((t) => t !== tag))}
                                        className="text-gray-400 hover:text-gray-600"
                                        disabled={isSubmitting}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!content.trim() || isSubmitting}
                        className={`flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg transition-all ${isSubmitting
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-purple-700'
                            }`}
                    >
                        <Save size={20} />
                        {isSubmitting ? 'Saving...' : 'Save Entry'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
