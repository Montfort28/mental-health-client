import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addMoodEntry, fetchMoodEntries, MoodEntry } from '../../store/moodSlice';
import { addGardenElement } from '../../store/gardenSlice';
import type { CreateGardenElementRequest } from '../../types/garden';

const moodEmojis = {
  1: { emoji: '😢', color: 'from-red-400 to-red-600', label: 'Very Sad' },
  2: { emoji: '😞', color: 'from-red-300 to-red-500', label: 'Sad' },
  3: { emoji: '😕', color: 'from-orange-400 to-red-400', label: 'Down' },
  4: { emoji: '😐', color: 'from-yellow-400 to-orange-400', label: 'Neutral' },
  5: { emoji: '🙂', color: 'from-yellow-300 to-yellow-500', label: 'Okay' },
  6: { emoji: '😊', color: 'from-green-300 to-yellow-400', label: 'Good' },
  7: { emoji: '😃', color: 'from-green-400 to-green-600', label: 'Happy' },
  8: { emoji: '😄', color: 'from-blue-400 to-green-500', label: 'Very Happy' },
  9: { emoji: '🥰', color: 'from-purple-400 to-blue-500', label: 'Fantastic' },
  10: { emoji: '🌟', color: 'from-pink-400 to-purple-500', label: 'Excellent' }
};

const activities = [
  { name: 'Exercise', emoji: '🏃‍♂️' },
  { name: 'Meditation', emoji: '🧘‍♂️' },
  { name: 'Reading', emoji: '📚' },
  { name: 'Nature Walk', emoji: '🌲' },
  { name: 'Creative Work', emoji: '🎨' },
  { name: 'Social Time', emoji: '👥' },
  { name: 'Self-Care', emoji: '💆‍♂️' },
  { name: 'Journaling', emoji: '📝' }
];

const MoodTracker = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { entries } = useSelector((state: RootState) => state.mood);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    dispatch(fetchMoodEntries());
  }, [dispatch]);

  const handleMoodSubmit = async (mood: number, notes: string) => {
    const entry = {
      mood,
      notes,
      activities: selectedActivities,
      timestamp: new Date().toISOString()
    };

    await dispatch(addMoodEntry(entry));

    // Create a garden element based on mood
    const gardenElement: CreateGardenElementRequest = {
      type: mood >= 7 ? 'flower' : mood >= 4 ? 'plant' : 'tree',
      name: `${moodEmojis[mood as keyof typeof moodEmojis].label} Day`,
      description: notes || `A moment of ${moodEmojis[mood as keyof typeof moodEmojis].label.toLowerCase()} reflection`,
      position: {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 400)
      }
    };

    await dispatch(addGardenElement(gardenElement));

    // Show celebration for positive moods
    if (mood >= 7) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Reset form
    setSelectedMood(null);
    setNotes('');
    setSelectedActivities([]);
  };

  const renderMoodHistory = () => {
    const lastSevenDays = entries.slice(-7).reverse();

    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Week at a Glance</h3>
        <div className="grid grid-cols-7 gap-2">
          {lastSevenDays.map((entry: MoodEntry) => (
            <div
              key={entry.timestamp}
              className="aspect-square flex flex-col items-center justify-center p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <span className="text-2xl transform hover:scale-110 transition-transform">
                {moodEmojis[entry.mood as keyof typeof moodEmojis].emoji}
              </span>
              <span className="text-xs text-gray-500 mt-1 font-medium">
                {new Date(entry.timestamp).toLocaleDateString(undefined, {
                  weekday: 'short'
                })}
              </span>
              {entry.activities.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {entry.activities.slice(0, 2).map(activity => (
                    <span key={activity} className="text-xs">
                      {activities.find(a => a.name === activity)?.emoji || ''}
                    </span>
                  ))}
                  {entry.activities.length > 2 && <span className="text-xs">...</span>}
                </div>
              )}
              {entry.notes && (
                <div className="mt-1 text-xs text-gray-500 truncate max-w-full hover:whitespace-normal hover:z-10 hover:absolute hover:bg-white hover:p-2 hover:rounded hover:shadow-lg">
                  {entry.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        How are you feeling today?
      </h2>

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {Object.entries(moodEmojis).map(([value, { emoji, color, label }]) => (
          <button
            key={value}
            onClick={() => setSelectedMood(parseInt(value))}
            className={`relative group flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:-translate-y-1 ${selectedMood === parseInt(value)
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : ''
              } bg-gradient-to-br ${color} text-white shadow-md`}
          >
            <span className="text-2xl mb-1">{emoji}</span>
            <span className="text-xs font-medium opacity-90">{label}</span>
            <div className="absolute inset-0 rounded-lg bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
          </button>
        ))}
      </div>

      {/* Activities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What activities helped your mood today?
        </label>
        <div className="grid grid-cols-4 gap-2">
          {activities.map(activity => (
            <button
              key={activity.name}
              onClick={() => setSelectedActivities(prev =>
                prev.includes(activity.name)
                  ? prev.filter(a => a !== activity.name)
                  : [...prev, activity.name]
              )}
              className={`flex items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${selectedActivities.includes(activity.name)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                }`}
            >
              <span className="text-xl mr-2">{activity.emoji}</span>
              <span className="text-sm">{activity.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Would you like to add any notes? (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="How are you feeling? What's on your mind?"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={() => {
          if (selectedMood !== null) {
            handleMoodSubmit(selectedMood, notes);
          }
        }}
        disabled={selectedMood === null}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-[1.02] ${selectedMood !== null
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
            : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        Save Entry & Plant Growth
      </button>

      {/* Mood History */}
      {renderMoodHistory()}

      {/* Celebration Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;