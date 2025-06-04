import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Leaf, BookOpen, Activity, User, Award } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth(); const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moodOptions = [
    { value: 5, emoji: '😊', label: 'Great' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 2, emoji: '😕', label: 'Down' },
    { value: 1, emoji: '😢', label: 'Bad' },
    { value: 0, emoji: '😫', label: 'Awful' },
  ];

  const stats = {
    achievements: 12,
    morningSessions: 5,
    eveningSessions: 3,
  };

  const recentActivities = [
    {
      title: 'Morning Meditation',
      timestamp: '2 hours ago',
      icon: <Activity className="text-purple-400" />,
    },
    {
      title: 'Journal Entry',
      timestamp: '5 hours ago',
      icon: <BookOpen className="text-blue-400" />,
    },
    {
      title: 'Mind Garden Visit',
      timestamp: 'Yesterday',
      icon: <Leaf className="text-green-400" />,
    },
  ];

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
    // TODO: Implement mood tracking logic
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Welcome Card */}
          <motion.div variants={item} className="col-span-full">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-purple-200">
                Here&apos;s an overview of your mental wellness journey
              </p>
            </div>
          </motion.div>

          {/* Mood Tracker Card */}
          <motion.div variants={item}>
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Current Mood</h2>
                  <div className="flex items-center space-x-2">
                    <Heart className="text-pink-400" />
                    <span className="text-purple-200">How are you feeling?</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`p-3 rounded-lg transition-all duration-200 ${selectedMood === mood.value
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-purple-200'
                      }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl h-full">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/mind-garden" className="group">
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-center">
                    <Leaf className="w-8 h-8 mb-2 mx-auto text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-purple-200">Mind Garden</span>
                  </div>
                </Link>
                <Link to="/resources" className="group">
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-center">
                    <BookOpen className="w-8 h-8 mb-2 mx-auto text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-purple-200">Resources</span>
                  </div>
                </Link>
                <Link to="/breathing" className="group">
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-center">
                    <Activity className="w-8 h-8 mb-2 mx-auto text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-purple-200">Breathing</span>
                  </div>
                </Link>
                <Link to="/community" className="group">
                  <div className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-center">
                    <User className="w-8 h-8 mb-2 mx-auto text-yellow-400 group-hover:scale-110 transition-transform" />
                    <span className="text-purple-200">Community</span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={item}>
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl h-full">
              <h2 className="text-xl font-semibold text-white mb-4">Today&apos;s Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="text-yellow-400" />
                    <span className="text-purple-200">Achievements</span>
                  </div>
                  <span className="text-white font-semibold">{stats.achievements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="text-orange-400" />
                    <span className="text-purple-200">Morning Sessions</span>
                  </div>
                  <span className="text-white font-semibold">{stats.morningSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="text-blue-400" />
                    <span className="text-purple-200">Evening Sessions</span>
                  </div>
                  <span className="text-white font-semibold">{stats.eveningSessions}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div variants={item} className="col-span-full">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activities</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        {activity.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <p className="text-purple-200 text-sm">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;