import React, { useState } from 'react';

interface JournalEntry {
  id: number;
  content: string;
  mood: string;
  date: Date;
}

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: JournalEntry = {
      id: Date.now(),
      content,
      mood,
      date: new Date()
    };

    setEntries([newEntry, ...entries]);
    setContent('');
    setMood('neutral');
  };

  const moodEmojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    peaceful: '😌'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Mental Health Journal</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block mb-2">How are you feeling?</label>
          <div className="flex gap-4 mb-4">
            {Object.entries(moodEmojis).map(([moodName, emoji]) => (
              <button
                key={moodName}
                type="button"
                onClick={() => setMood(moodName)}
                className={`text-2xl p-2 rounded-full ${
                  mood === moodName ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Write your thoughts:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={6}
            placeholder="How are you feeling today? What's on your mind?"
          />
        </div>

        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Save Entry
        </button>
      </form>

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl">{moodEmojis[entry.mood as keyof typeof moodEmojis]}</span>
              <span className="text-gray-500">
                {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}
              </span>
            </div>
            <p className="whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
