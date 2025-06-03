import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

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
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-lg bg-white/90 border border-blue-50">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-16 -translate-y-16 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 transform -translate-x-16 translate-y-16 bg-white/10 rounded-full"></div>
          <div className="relative">
            <svg className="w-8 h-8 mx-auto mb-4 opacity-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl font-medium italic mb-2 text-center">{dailyQuotes[0].quote}</p>
            <p className="text-sm opacity-90 text-center">― {dailyQuotes[0].author}</p>
          </div>
        </div>

        {/* Recommended Activities */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recommendedActivities.map((activity) => (
            <Link
              key={activity.title}
              to={activity.link}
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
            >
              <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center text-2xl transform transition-transform group-hover:scale-110 shadow-lg`}>
                {activity.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
            </Link>
          ))}
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Streaks</h3>
              <p className="text-3xl font-bold text-green-600">7 Days</p>
              <p className="text-sm text-green-600 mt-1">Keep going strong!</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Achievements</h3>
              <p className="text-3xl font-bold text-purple-600">12</p>
              <p className="text-sm text-purple-600 mt-1">Unlocked this month</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Next Goal</h3>
              <p className="text-3xl font-bold text-blue-600">2 Days</p>
              <p className="text-sm text-blue-600 mt-1">Until 10-day streak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;