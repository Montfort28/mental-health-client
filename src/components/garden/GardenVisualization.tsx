import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchGardenElements, updateGardenElement } from '../../store/gardenSlice';
import type { GardenElement } from '../../types/garden';

const plantTypes = {
  flower: ['🌸', '🌹', '🌷', '🌺', '🌻', '🌼'],
  tree: ['🌳', '🌲', '🎄', '🌴', '🪴'],
  plant: ['🌿', '☘️', '🍀', '🌱', '🎋']
};

const plantMeanings = {
  flower: 'represents joy and achievement',
  tree: 'symbolizes strength and resilience',
  plant: 'signifies growth and healing'
};

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

  const getRandomPlantEmoji = (type: keyof typeof plantTypes) => {
    const options = plantTypes[type];
    return options[Math.floor(Math.random() * options.length)];
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
          }}
          onClick={() => {
            if (element.healthStatus !== 'healthy') {
              handleWater(element.id);
            }
            setSelectedElement(element);
          }}
        >
          {getRandomPlantEmoji(element.type)}

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
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 p-3 bg-white rounded-lg shadow-lg z-10 mb-2">
              <h4 className="font-semibold text-sm text-gray-800">{element.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{plantMeanings[element.type]}</p>
              <div className="text-xs text-gray-500 mt-2">
                <p>Planted: {new Date(element.plantedDate).toLocaleDateString()}</p>
                <p>Growth: {element.growthStage}/5</p>
                <p className={`${element.healthStatus === 'healthy' ? 'text-green-500' :
                    element.healthStatus === 'needs-attention' ? 'text-yellow-500' :
                      'text-red-500'
                  }`}>
                  Status: {element.healthStatus.replace('-', ' ')}
                </p>
              </div>
              {element.healthStatus !== 'healthy' && (
                <button
                  className="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  onClick={() => handleWater(element.id)}
                >
                  Water Plant
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Empty Garden Message */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 bg-white/90 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Your Mind Garden!</h3>
            <p className="text-gray-600">
              This is your personal space for growth and reflection. Track your moods and watch your garden flourish with each entry.
              Each plant represents a moment in your journey, growing stronger as you maintain your mental well-being.
            </p>
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