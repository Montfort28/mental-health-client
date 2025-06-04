import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import DailyGoals from '../components/dashboard/DailyGoals';
import WellnessTips from '../components/dashboard/WellnessTips';
import ActivityStreak from '../components/dashboard/ActivityStreak';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const wellnessStats = [
    { name: 'Mood Score', value: '8.5/10', trend: 'up', change: '+0.5', color: 'from-teal-500 to-emerald-500' },
    { name: 'Mindfulness Minutes', value: '45', trend: 'up', change: '+10', color: 'from-blue-500 to-indigo-500' },
    { name: 'Journal Entries', value: '12', trend: 'up', change: '+3', color: 'from-purple-500 to-pink-500' },
    { name: 'Activities Completed', value: '8', trend: 'up', change: '+2', color: 'from-orange-500 to-red-500' },
  ];

  const dailyQuotes = [
    {
      quote: "Your mind is a garden, your thoughts are the seeds. You can grow flowers or you can grow weeds.",
      author: "Anonymous"
    },
    {
      quote: "The strongest people are those who win battles we know nothing about.",
      author: "Unknown"
    }
  ];

  const recommendedActivities = [
    {
      title: "5-Minute Breathing",
      description: "A quick mindfulness exercise to center yourself",
      icon: "🌬️",
      color: "from-blue-400 to-blue-600",
      link: "/resources"
    },
    {
      title: "Mood Check-In",
      description: "Track your emotional well-being today",
      icon: "🌈",
      color: "from-purple-400 to-purple-600",
      link: "/mind-garden"
    },
    {
      title: "Gratitude Journal",
      description: "Write three things you're thankful for",
      icon: "✨",
      color: "from-pink-400 to-pink-600",
      link: "/mind-garden"
    },
    {
      title: "Community Share",
      description: "Connect with supportive peers",
      icon: "🤝",
      color: "from-green-400 to-green-600",
      link: "/community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-white/90 border border-blue-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
              {user?.email?.[0].toUpperCase() || '👤'}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                {greeting}, {user?.email?.split('@')[0]}
              </h1>
              <p className="text-gray-600 mt-1">Welcome to your safe space. How are you feeling today?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wellnessStats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
              </div>
              <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
              <dd className="mt-1 text-3xl font-bold text-gray-900">
                {stat.value}
                <span className={`ml-2 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                  {stat.change}
                </span>
              </dd>
            </div>
          ))}
        </div>

        {/* Activity Streak */}
        <div className="grid grid-cols-1 gap-6">
          <ActivityStreak />
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DailyGoals />
          </div>
          <div className="lg:col-span-1">
            <WellnessTips />
          </div>
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Inspiration</h3>
            <div className="text-center py-4">
              <blockquote className="text-lg text-gray-700 italic mb-4">
                &ldquo;{dailyQuotes[0].quote}&rdquo;
              </blockquote>
              <cite className="text-gray-600">— {dailyQuotes[0].author}</cite>
            </div>
          </div>
        </div>

        {/* Recommended Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedActivities.map((activity) => (
              <Link
                key={activity.title}
                to={activity.link}
                className="block p-4 rounded-lg bg-gradient-to-r hover:scale-105 transition-transform duration-200"
                style={{
                  backgroundImage: `linear-gradient(to right, ${activity.color.split(' ')[1]}, ${activity.color.split(' ')[3]})`
                }}
              >
                <div className="text-3xl mb-2">{activity.icon}</div>
                <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
                <p className="text-white/80 text-sm">{activity.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;