import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { addMoodEntry } from '../../store/moodSlice';

interface JournalEntry {
  id: string;
  content: string;
  mood: number;
  date: string;
  tags: string[];
}

const moodEmojis = {
  1: { emoji: '😢', color: 'from-blue-300 to-blue-500', label: 'Very Sad' },
  2: { emoji: '😔', color: 'from-blue-200 to-blue-400', label: 'Sad' },
  3: { emoji: '😕', color: 'from-yellow-200 to-yellow-400', label: 'Down' },
  4: { emoji: '😐', color: 'from-yellow-100 to-yellow-300', label: 'Neutral' },
  5: { emoji: '🙂', color: 'from-green-200 to-green-400', label: 'Okay' },
  6: { emoji: '😊', color: 'from-green-300 to-green-500', label: 'Good' },
  7: { emoji: '😃', color: 'from-teal-300 to-teal-500', label: 'Happy' },
};

const suggestedTags = [
  'Gratitude',
  'Self-Care',
  'Achievement',
  'Challenge',
  'Learning',
  'Relationship',
  'Work',
  'Health',
  'Anxiety',
  'Depression',
  'Stress',
  'Sleep',
  'Exercise',
  'Meditation',
  'Therapy'
];

const Journal: React.FC = () => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  // Use selector to get mood entries from store
  const moodEntries = useSelector((state: RootState) => state.mood.entries);

  // Update entries when mood entries change
  useEffect(() => {
    const formattedEntries: JournalEntry[] = moodEntries.map(entry => ({
      id: entry.timestamp,
      content: entry.notes || '',
      mood: entry.mood,
      date: new Date(entry.timestamp).toLocaleDateString(),
      tags: entry.activities || []
    }));
    setEntries(formattedEntries);
  }, [moodEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedMood) return;

    setIsSubmitting(true);
    try {
      await dispatch(addMoodEntry({
        mood: selectedMood,
        notes: content,
        activities: selectedTags,
        timestamp: new Date().toISOString()
      }));

      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setContent('');
        setSelectedMood(null);
        setSelectedTags([]);
      }, 2000);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 rounded-xl shadow-xl p-8 transition-all duration-300 transform hover:shadow-2xl">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
          Express Your Thoughts
        </h2>

        {/* Mood Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">How are you feeling today?</h3>
          <div className="grid grid-cols-7 gap-3">
            {Object.entries(moodEmojis).map(([value, { emoji, color, label }]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedMood(parseInt(value))}
                className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${selectedMood === parseInt(value)
                  ? `bg-gradient-to-r ${color} text-white scale-105 shadow-lg`
                  : 'bg-white hover:bg-gray-50 shadow-md'
                  }`}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <div className="text-xs font-medium">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Entry */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here... How has your day been? What's on your mind?"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm"
              disabled={isSubmitting}
            />
            <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
              {content.length}/1000
            </div>
          </div>

          {/* Tags Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Add relevant tags</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim() || !selectedMood}
            className={`w-full py-4 rounded-lg text-white font-medium transition-all duration-300 transform ${isSubmitting || !content.trim() || !selectedMood
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-[1.01] shadow-lg hover:shadow-xl'
              }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </form>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
            >
              <motion.div
                className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <p className="text-xl font-medium text-gray-800">Entry saved successfully!</p>
                <p className="text-sm text-gray-600 mt-2">Keep up the great work!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Journal History */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Previous Entries</h3>
        <div className="grid gap-4">
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {moodEmojis[entry.mood as keyof typeof moodEmojis]?.emoji}
                      </span>
                      <span className="text-sm text-gray-600">{entry.date}</span>
                    </div>
                    <p className="text-gray-800 mb-3">{entry.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Journal;
