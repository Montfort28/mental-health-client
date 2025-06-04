import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '../../store';
import { fetchGardenElements, updateGardenElement } from '../../store/gardenSlice';
import type { GardenElement } from '../../types/garden';
import { plantTypes } from './plantTypes';
import './GardenVisualization.css';

const weatherEffects = {
  rain: { emoji: '🌧️', effectClass: 'rain-effect' },
  sun: { emoji: '☀️', effectClass: 'sun-effect' },
  rainbow: { emoji: '🌈', effectClass: 'rainbow-effect' },
  clouds: { emoji: '☁️', effectClass: 'cloud-effect' }
} as const;

const GardenVisualization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements, loading } = useSelector((state: RootState) => state.garden);
  const [selectedElement, setSelectedElement] = useState<GardenElement | null>(null);
  const [weather, setWeather] = useState<keyof typeof weatherEffects>('sun');
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    dispatch(fetchGardenElements());

    // Weather changes
    const weatherInterval = setInterval(() => {
      const weathers = Object.keys(weatherEffects) as Array<keyof typeof weatherEffects>;
      const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(newWeather);
    }, 30000);

    // Day/night cycle
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
    const growthPercent = (element.growthStage / 5) * 100;

    if (growthPercent < 20) return 'Just planted';
    if (growthPercent < 40) return 'Starting to grow';
    if (growthPercent < 60) return 'Growing steadily';
    if (growthPercent < 80) return 'Thriving';
    return 'Fully bloomed';
  };

  const calculateGrowthBonus = (element: GardenElement) => {
    const currentPlant = plantTypes[element.plantTypeId];
    let bonus = 1;

    const recentMoods = element.moodHistory.slice(-3);
    const matchingMoods = recentMoods.filter(mood => currentPlant.associatedMoods?.includes(mood));
    bonus += (matchingMoods.length * 0.1);

    const recentActivities = element.activityHistory.slice(-3);
    const matchingActivities = recentActivities.filter(activity =>
      currentPlant.associatedActivities?.includes(activity)
    );
    bonus += (matchingActivities.length * 0.15);

    return bonus;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="backdrop-blur-md bg-white/30 p-8 rounded-xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[600px] rounded-xl overflow-hidden p-4 transition-all duration-1000 ${isNight
          ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900'
          : 'bg-gradient-to-b from-blue-200 via-green-100 to-green-200'
        }`}
    >
      {/* Sky Effect with advanced weather */}
      <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 flex items-center justify-center ${weatherEffects[weather].effectClass}`}>
          <span className="text-6xl">{weatherEffects[weather].emoji}</span>
        </div>

        {isNight && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-stars"></div>
            <div className="absolute top-4 right-8 animate-float">
              <span className="text-4xl">🌙</span>
            </div>
          </div>
        )}
      </div>

      {/* Garden Elements with enhanced animations */}
      <AnimatePresence>
        {elements.map((element: GardenElement) => (
          <motion.div
            key={element.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: element.healthStatus === 'wilting' ? [0, -2, 0] : 0
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.3,
              y: { duration: 2, repeat: Infinity }
            }}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${element.healthStatus === 'wilting' ? 'opacity-60' : ''
              }`}
            style={{
              left: `${element.position.x}px`,
              top: `${element.position.y}px`,
              fontSize: `${calculateSize(element.growthStage)}px`,
            }}
            onClick={() => {
              if (element.healthStatus !== 'healthy') {
                handleWater(element.id);
              }
              setSelectedElement(element);
            }}
            whileHover={{ scale: 1.1 }}
          >
            {plantTypes[element.plantTypeId].emoji}

            {/* Growth and Health Indicators with glassmorphism */}
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 backdrop-blur-sm bg-white/20 rounded-lg p-1"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-1.5 bg-black/10 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-500 ${element.healthStatus === 'healthy' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      element.healthStatus === 'needs-attention' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                  style={{ width: `${(element.growthStage / 5) * 100}%` }}
                />
              </div>
            </motion.div>

            {/* Hover Info Card with glassmorphism */}
            <AnimatePresence>
              {selectedElement?.id === element.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-72 backdrop-blur-md bg-white/90 rounded-xl shadow-xl z-10 mb-2 border border-white/20"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{plantTypes[element.plantTypeId].emoji}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{element.name}</h4>
                        <p className="text-sm text-gray-600">{plantTypes[element.plantTypeId].name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{plantTypes[element.plantTypeId].description}</p>
                    <div className="mt-3 space-y-2 text-sm text-gray-500">
                      <p>Planted: {new Date(element.plantedDate).toLocaleDateString()}</p>
                      <p>Growth Stage: {getGrowthDescription(element)}</p>
                      <div className="flex items-center gap-2">
                        <p>Growth Rate:</p>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWater(element.id);
                        }}
                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-md"
                      >
                        Water Plant
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty Garden Message with glassmorphism */}
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 backdrop-blur-md bg-white/90 rounded-xl shadow-xl max-w-lg border border-white/20"
          >
            <div className="flex justify-center space-x-4 mb-6">
              {Object.values(plantTypes).slice(0, 3).map(plant => (
                <motion.div
                  key={plant.id}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random()
                  }}
                  className="text-4xl"
                >
                  {plant.emoji}
                </motion.div>
              ))}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              Welcome to Your Mind Garden!
            </h3>
            <p className="text-gray-600 mb-6">
              This is your personal space for emotional growth and reflection. Each plant represents different aspects of your mental well-being journey.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 backdrop-blur-sm bg-green-50/90 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-medium text-green-800 mb-1">🌱 Growth</h4>
                <p className="text-sm text-green-600">Plants grow based on your mood patterns and self-care activities</p>
              </div>
              <div className="p-4 backdrop-blur-sm bg-blue-50/90 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-medium text-blue-800 mb-1">💧 Care</h4>
                <p className="text-sm text-blue-600">Nurture your garden through mindfulness and positive activities</p>
              </div>
              <div className="p-4 backdrop-blur-sm bg-purple-50/90 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-medium text-purple-800 mb-1">🎯 Goals</h4>
                <p className="text-sm text-purple-600">Set emotional well-being goals and watch your garden thrive</p>
              </div>
              <div className="p-4 backdrop-blur-sm bg-yellow-50/90 rounded-lg hover:shadow-lg transition-shadow">
                <h4 className="font-medium text-yellow-800 mb-1">✨ Achievements</h4>
                <p className="text-sm text-yellow-600">Unlock new plants and features as you progress</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Ground Effect with enhanced depth */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="absolute inset-0 h-32 bg-gradient-to-t from-green-400 to-transparent opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-600 to-green-400 shadow-lg"></div>
        {isNight && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-900 to-transparent opacity-30"></div>
        )}
      </div>
    </div>
  );
};

export default GardenVisualization;