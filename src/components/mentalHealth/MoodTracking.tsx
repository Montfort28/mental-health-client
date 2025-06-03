import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useMentalHealth } from '../../contexts/MentalHealthContext';

const MoodTracking: React.FC = () => {
  const { metrics, trends, loading, addMetric, fetchMetrics, fetchTrends } = useMentalHealth();
  const [mood, setMood] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchMetrics();
    fetchTrends(30); // Fetch last 30 days of trends
  }, [fetchMetrics, fetchTrends]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMetric(mood, anxiety, stress, notes);
    setNotes('');
  };

  const chartData = {
    labels: trends.map(t => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood',
        data: trends.map(t => t.averageMood),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Anxiety',
        data: trends.map(t => t.averageAnxiety),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Stress',
        data: trends.map(t => t.averageStress),
        borderColor: 'rgb(255, 205, 86)',
        tension: 0.1
      }
    ]
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Track Your Mood</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block mb-2">
            Mood (1-10):
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-lg font-bold">{mood}</span>
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Anxiety Level (1-10):
            <input
              type="range"
              min="1"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-lg font-bold">{anxiety}</span>
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Stress Level (1-10):
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-lg font-bold">{stress}</span>
          </label>
        </div>

        <div>
          <label className="block mb-2">
            Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log Mood
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Your Mood Trends</h3>
        <div className="h-96">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;
