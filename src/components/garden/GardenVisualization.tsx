import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchGardenElements, updateGardenElement } from '../../store/gardenSlice';
import type { GardenElement } from '../../types/garden';
import { plantTypes } from './plantTypes';

const weatherEffects = {
  rain: '🌧️',
  sun: '☀️',
  rainbow: '🌈',
  clouds: '☁️'
};

const GardenVisualization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements, loading } = useSelector((state: RootState) => state.garden);
  const [selectedElement, setSelectedElement] = useState<GardenElement | null>(null);
  const [weather, setWeather] = useState<keyof typeof weatherEffects>('sun');
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    dispatch(fetchGardenElements());
    // Change weather every 30 seconds
    const weatherInterval = setInterval(() => {
      const weathers = Object.keys(weatherEffects) as Array<keyof typeof weatherEffects>;
      const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(newWeather);
    }, 30000);

    // Day/night cycle every 5 minutes
    const dayNightInterval = setInterval(() => {
      setIsNight(prev => !prev);
    }, 300000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(dayNightInterval);
    };
  }, [dispatch]);

  const handleWater = (elementId: number) => {
    const element = elements.find(e => e.id === elementId);
    if (element) {
      dispatch(updateGardenElement({
        id: elementId,
        updates: {
          healthStatus: 'healthy',
          growthStage: Math.min(5, element.growthStage + 1)
        }
      }));
    }
  };

  const calculateSize = (growthStage: number) => {
    const baseSize = 24;
    return Math.max(baseSize * (growthStage * 0.2), baseSize * 0.5);
  };
  const getGrowthDescription = (element: GardenElement) => {
    const plant = plantTypes[element.plantTypeId];
    const growthPercent = (element.growthStage / 5) * 100;

    if (growthPercent < 20) return 'Just planted';
    if (growthPercent < 40) return 'Starting to grow';
    if (growthPercent < 60) return 'Growing steadily';
    if (growthPercent < 80) return 'Thriving';
    return 'Fully bloomed';
  };

  const calculateGrowthBonus = (element: GardenElement) => {
    const plant = plantTypes[element.plantTypeId];
    let bonus = 1;

    // Mood bonus
    const recentMoods = element.moodHistory.slice(-3);
    const matchingMoods = recentMoods.filter(mood => plant.associatedMoods?.includes(mood));
    bonus += (matchingMoods.length * 0.1);

    // Activity bonus
    const recentActivities = element.activityHistory.slice(-3);
    const matchingActivities = recentActivities.filter(activity =>
      plant.associatedActivities?.includes(activity)
    );
    bonus += (matchingActivities.length * 0.15);

    return bonus;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[600px] rounded-lg overflow-hidden p-4 transition-colors duration-1000 ${isNight
      ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900'
      : 'bg-gradient-to-b from-blue-200 via-green-100 to-green-200'
      }`}>
      {/* Sky Effect */}
      <div className={`absolute top-0 left-0 right-0 h-32 transition-opacity duration-500 ${weather === 'rain' ? 'opacity-70' : 'opacity-100'
        }`}>
        {/* Weather Effects */}
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {weatherEffects[weather]}
        </div>
        {isNight && (
          <div className="absolute inset-0 flex items-start justify-between p-4">
            <span className="text-2xl">🌙</span>
            <span className="text-xl">✨</span>
          </div>
        )}
      </div>

      {/* Garden Elements */}
      {elements.map((element: GardenElement) => (
        <div
          key={element.id}
          className={`absolute transition-all duration-500 cursor-pointer hover:scale-110 ${element.healthStatus === 'wilting' ? 'opacity-60 animate-pulse' : ''
            }`}
          style={{
            left: `${element.position.x}px`,
            top: `${element.position.y}px`,
            fontSize: `${calculateSize(element.growthStage)}px`,
            transform: `translate(-50%, -50%)`,
          }} onClick={() => {
            if (element.healthStatus !== 'healthy') {
              handleWater(element.id);
            }
            setSelectedElement(element);
          }}
        >
          {plantTypes[element.plantTypeId].emoji}

          {/* Growth and Health Indicators */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-20">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-500 ${element.healthStatus === 'healthy' ? 'bg-green-500' :
                  element.healthStatus === 'needs-attention' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                style={{ width: `${(element.growthStage / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Hover Info Card */}
          {selectedElement?.id === element.id && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-64 p-4 bg-white rounded-lg shadow-lg z-10 mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{plantTypes[element.plantTypeId].emoji}</span>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">{element.name}</h4>
                  <p className="text-xs text-gray-600">{plantTypes[element.plantTypeId].name}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{plantTypes[element.plantTypeId].description}</p>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <p>Planted: {new Date(element.plantedDate).toLocaleDateString()}</p>
                <p>Growth Stage: {getGrowthDescription(element)}</p>
                <div className="flex items-center gap-1">
                  <p>Growth Rate:</p>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${calculateGrowthBonus(element) * 100}%` }}
                    />
                  </div>
                </div>
                <p className={`${element.healthStatus === 'healthy' ? 'text-green-500' :
                  element.healthStatus === 'needs-attention' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                  Status: {element.healthStatus.replace('-', ' ')}
                </p>
              </div>
              {element.healthStatus !== 'healthy' && (
                <button
                  className="mt-3 w-full px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-md"
                  onClick={() => handleWater(element.id)}
                >
                  Water Plant
                </button>
              )}
            </div>
          )}
        </div>
      ))}      {/* Empty Garden Message */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 bg-white/95 rounded-xl shadow-xl max-w-lg">
            <div className="flex justify-center space-x-4 mb-6">
              {Object.values(plantTypes).slice(0, 3).map(plant => (
                <div key={plant.id} className="text-4xl animate-bounce" style={{ animationDelay: Math.random() + 's' }}>
                  {plant.emoji}
                </div>
              ))}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Your Mind Garden!</h3>
            <p className="text-gray-600 mb-6">
              This is your personal space for emotional growth and reflection. Each plant represents different aspects of your mental well-being journey.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">🌱 Growth</h4>
                <p className="text-sm text-green-600">Plants grow based on your mood patterns and self-care activities</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">💧 Care</h4>
                <p className="text-sm text-blue-600">Nurture your garden through mindfulness and positive activities</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-1">🎯 Goals</h4>
                <p className="text-sm text-purple-600">Set emotional well-being goals and watch your garden thrive</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-1">✨ Achievements</h4>
                <p className="text-sm text-yellow-600">Unlock new plants and features as you progress</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ground Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <div className="absolute inset-0 bg-gradient-to-t from-green-400 to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-600 to-green-400"></div>
      </div>
    </div>
  );
};

export default GardenVisualization;