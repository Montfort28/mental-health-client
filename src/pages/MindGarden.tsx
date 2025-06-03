import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MoodTracker from '../components/garden/MoodTracker';
import GardenVisualization from '../components/garden/GardenVisualization';

const achievementsList = [
  { id: 'streak-3', name: 'Growing Strong', description: '3-day mood tracking streak', icon: '🌱' },
  { id: 'streak-7', name: 'Steady Growth', description: '7-day mood tracking streak', icon: '🌿' },
  { id: 'streak-30', name: 'Flourishing', description: '30-day mood tracking streak', icon: '🌳' },
  { id: 'positive-mood', name: 'Ray of Sunshine', description: '5 positive mood entries', icon: '☀️' },
  { id: 'garden-variety', name: 'Garden Variety', description: 'Plant all types of garden elements', icon: '🌸' },
  { id: 'self-care', name: 'Self Care Master', description: 'Track activities for 5 days straight', icon: '💝' },
  { id: 'journaling', name: 'Dear Diary', description: 'Add notes to 7 mood entries', icon: '📔' },
  { id: 'growth-master', name: 'Growth Master', description: 'Achieve full growth on 5 plants', icon: '🏆' }
];

const mindfulnessQuotes = [
  { quote: "Your mind is like a garden, tend to it with care.", author: "Anonymous" },
  { quote: "Every flower must grow through dirt.", author: "Unknown" },
  { quote: "Growth is a process, not an event.", author: "Unknown" },
  { quote: "In the garden of life, resilience is the most beautiful flower.", author: "Anonymous" }
];

const MindGarden = () => {
  const { entries } = useSelector((state: RootState) => state.mood);
  const { elements } = useSelector((state: RootState) => state.garden);
  const [quote, setQuote] = useState(mindfulnessQuotes[0]);

  useEffect(() => {
    // Change quote every 5 minutes
    const interval = setInterval(() => {
      const newQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
      setQuote(newQuote);
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const calculateStats = () => {
    const now = new Date();
    const streak = entries.reduce((acc, entry) => {
      const entryDate = new Date(entry.timestamp);
      const dayDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return dayDiff === acc.days ? { count: acc.count + 1, days: acc.days + 1 } : acc;
    }, { count: 0, days: 0 }).count;

    const healthyPlants = elements.filter(e => e.healthStatus === 'healthy').length;
    const totalPlants = elements.length;

    return { streak, healthyPlants, totalPlants };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Your Mind Garden</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A peaceful space where your emotional well-being blooms into beautiful growth.
            Track your moods, nurture your garden, and watch your journey flourish.
          </p>
        </div>

        {/* Daily Quote */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform hover:scale-[1.02] transition-transform">
          <div className="text-center">
            <span className="text-3xl mb-4">🌸</span>
            <p className="text-lg text-gray-800 italic mb-2">&ldquo;{quote.quote}&rdquo;</p>
            <p className="text-sm text-gray-600">— {quote.author}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Mood Streak</h3>
                <p className="text-3xl font-bold text-green-600">{stats.streak} days</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Garden Health</h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.healthyPlants}/{stats.totalPlants}
                </p>
              </div>
              <span className="text-4xl">🌿</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
                <p className="text-3xl font-bold text-green-600">
                  {achievementsList.length}
                </p>
              </div>
              <span className="text-4xl">🏆</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Tracking */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <MoodTracker />
            </div>
          </div>

          {/* Garden Visualization */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Garden</h2>
              <p className="text-gray-600 mb-4">
                Watch your garden grow as you maintain your mental well-being.
                Each plant represents an emotion, growing stronger with your journey.
              </p>
              <GardenVisualization />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Growth Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievementsList.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 rounded-lg border-2 border-gray-100 hover:border-green-200 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{achievement.icon}</span>
                  <h3 className="font-medium text-gray-800">{achievement.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips and Guidance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Growing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-green-50">
              <h3 className="font-medium text-green-800 mb-2">Daily Check-ins</h3>
              <p className="text-sm text-green-700">
                Regular mood tracking helps your garden flourish. Try to log your feelings at the same time each day.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Activity Impact</h3>
              <p className="text-sm text-blue-700">
                Notice which activities boost your mood. These insights help you cultivate better mental well-being.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
              <h3 className="font-medium text-purple-800 mb-2">Growth Takes Time</h3>
              <p className="text-sm text-purple-700">
                Like real plants, emotional growth needs patience. Celebrate small progress and keep nurturing yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindGarden;