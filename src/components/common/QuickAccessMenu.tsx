import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    PhoneCall,
    Wind,
    CheckCircle,
    X,
    Plus,
    Clock,
    Sun
} from 'lucide-react';
import QuickBreathingExercise from '../mindfulness/QuickBreathingExercise';
import DailyCheckIn from '../mindfulness/DailyCheckIn';
import MindfulnessTimer from '../mindfulness/MindfulnessTimer';
import QuickAffirmation from '../mindfulness/QuickAffirmation';

interface QuickAction {
    icon: React.ReactElement;
    label: string;
    onClick: () => void;
    color: string;
}

const QuickAccessMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
    const [showBreathingExercise, setShowBreathingExercise] = useState(false);
    const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
    const [showMindfulnessTimer, setShowMindfulnessTimer] = useState(false);
    const [showAffirmations, setShowAffirmations] = useState(false);

    const emergencyContacts = [
        { name: 'Crisis Helpline', number: '1-800-273-8255' },
        { name: 'Emergency Services', number: '911' },
        { name: 'Support Team', number: '1-888-123-4567' }
    ];

    const quickActions: QuickAction[] = [
        {
            icon: <HelpCircle className="w-6 h-6" />,
            label: 'Get Help',
            onClick: () => console.log('Help clicked'),
            color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
            icon: <PhoneCall className="w-6 h-6" />,
            label: 'Emergency',
            onClick: () => setShowEmergencyContacts(true),
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            icon: <Wind className="w-6 h-6" />,
            label: 'Quick Breath',
            onClick: () => setShowBreathingExercise(true),
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            label: 'Check-in',
            onClick: () => setShowDailyCheckIn(true),
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            icon: <Clock className="w-6 h-6" />,
            label: 'Mindfulness',
            onClick: () => setShowMindfulnessTimer(true),
            color: 'bg-indigo-500 hover:bg-indigo-600'
        },
        {
            icon: <Sun className="w-6 h-6" />,
            label: 'Affirmation',
            onClick: () => setShowAffirmations(true),
            color: 'bg-yellow-500 hover:bg-yellow-600'
        }
    ]; return (
        <>
            {/* Quick Access Button and Menu */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mb-4 space-y-2"
                        >
                            {quickActions.map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white shadow-lg transform transition-transform hover:scale-105 ${action.color}`}
                                    onClick={action.onClick}
                                >
                                    {action.icon}
                                    <span>{action.label}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    className="bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform transition-transform hover:scale-105" whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </motion.button>
            </div>

            {/* Emergency Contacts Modal */}
            <AnimatePresence>
                {showEmergencyContacts && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                        onClick={() => setShowEmergencyContacts(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Emergency Contacts</h3>
                            <div className="space-y-4">
                                {emergencyContacts.map(contact => (
                                    <a
                                        key={contact.name}
                                        href={`tel:${contact.number}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="font-medium text-gray-700">{contact.name}</span>
                                        <span className="text-blue-500">{contact.number}</span>
                                    </a>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowEmergencyContacts(false)}
                                className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Breathing Exercise Modal */}
            <QuickBreathingExercise
                isOpen={showBreathingExercise}
                onClose={() => setShowBreathingExercise(false)}
            />

            {/* Daily Check-in Modal */}
            <DailyCheckIn
                isOpen={showDailyCheckIn}
                onClose={() => setShowDailyCheckIn(false)}
            />

            {/* Mindfulness Timer Modal */}
            <MindfulnessTimer
                isOpen={showMindfulnessTimer}
                onClose={() => setShowMindfulnessTimer(false)}
            />

            {/* Quick Affirmation Modal */}
            <QuickAffirmation
                isOpen={showAffirmations}
                onClose={() => setShowAffirmations(false)}
            />
        </>
    );
};

export default QuickAccessMenu;
