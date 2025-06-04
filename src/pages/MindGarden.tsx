import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import MoodTracker from '../components/garden/MoodTracker';
import GardenVisualization from '../components/garden/GardenVisualization';
import DailyChallenges from '../components/community/DailyChallenges';
import MoodCalendar from '../components/garden/MoodCalendar';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Your Mind Garden
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A peaceful space where your emotional well-being blooms into beautiful growth.
              Track your moods, nurture your garden, and watch your journey flourish.
            </p>
          </motion.div>

          {/* Daily Quote with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-8 mb-8 border border-white/20 transform hover:scale-[1.02] transition-all"
          >
            <div className="text-center">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl inline-block mb-4"
              >
                🌸
              </motion.span>
              <p className="text-xl text-gray-800 italic mb-3">&ldquo;{quote.quote}&rdquo;</p>
              <p className="text-sm text-gray-600">— {quote.author}</p>
            </div>
          </motion.div>

          {/* Stats Overview with Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Mood Streak</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {stats.streak} days
                  </p>
                </div>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  🔥
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Garden Health</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {stats.healthyPlants}/{stats.totalPlants}
                  </p>
                </div>
                <motion.span
                  animate={{
                    rotateZ: [0, 5, -5, 0],
                    y: [0, -2, 2, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-4xl"
                >
                  🌿
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {achievementsList.length}
                  </p>
                </div>
                <motion.span
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl"
                >
                  🏆
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Mood Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-1"
            >
              <div className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 border border-white/20">
                <MoodCalendar
                  entries={entries.map(entry => ({
                    ...entry,
                    date: new Date(entry.timestamp)
                  }))}
                  onDayClick={(date) => {
                    // TODO: Implement day click handler
                    console.log('Day clicked:', date);
                  }}
                />
              </div>
            </motion.div>

            {/* Garden Visualization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="xl:col-span-2 backdrop-blur-lg bg-white/80 rounded-xl shadow-lg overflow-hidden border border-white/20"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Your Garden
                </h2>
                <p className="text-gray-600 mb-4">
                  Watch your garden grow as you maintain your mental well-being.
                  Each plant represents an emotion, growing stronger with your journey.
                </p>
                <GardenVisualization />
              </div>
            </motion.div>
          </div>

          {/* Mood Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg overflow-hidden mb-8 border border-white/20"
          >
            <div className="p-6">
              <MoodTracker />
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 mb-8 border border-white/20"
          >
            <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Growth Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievementsList.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg backdrop-blur-sm bg-white/50 border-2 border-white/20 hover:border-green-200 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <motion.span
                      animate={{
                        rotate: achievement.icon === '🌱' ? [0, 5, -5, 0] : 0,
                        scale: achievement.icon === '🏆' ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl mr-2"
                    >
                      {achievement.icon}
                    </motion.span>
                    <h3 className="font-medium text-gray-800">{achievement.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tips and Community Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tips and Guidance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 border border-white/20"
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Growing Tips
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/80 backdrop-blur-sm"
                >
                  <h3 className="font-medium text-green-800 mb-2">Daily Check-ins</h3>
                  <p className="text-sm text-green-700">
                    Regular mood tracking helps your garden flourish. Try to log your feelings at the same time each day.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/80 backdrop-blur-sm"
                >
                  <h3 className="font-medium text-blue-800 mb-2">Activity Impact</h3>
                  <p className="text-sm text-blue-700">
                    Notice which activities boost your mood. These insights help you cultivate better mental well-being.
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/80 backdrop-blur-sm"
                >
                  <h3 className="font-medium text-purple-800 mb-2">Growth Takes Time</h3>
                  <p className="text-sm text-purple-700">
                    Like real plants, emotional growth needs patience. Celebrate small progress and keep nurturing yourself.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Community Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6 border border-white/20"
            >
              <DailyChallenges />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindGarden;