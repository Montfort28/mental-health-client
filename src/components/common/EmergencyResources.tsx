import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Globe, MessageCircle, Heart } from 'lucide-react';

interface EmergencyResourcesProps {
    isOpen: boolean;
    onClose: () => void;
}

const resources = {
    emergency: [
        { name: 'Emergency Services', number: '911', description: 'For immediate life-threatening emergencies' },
        { name: 'National Suicide Prevention Lifeline', number: '1-800-273-8255', description: '24/7 support for people in distress' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free 24/7 crisis counseling' }
    ],
    helplines: [
        { name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: 'Treatment referral and information' },
        { name: 'Veterans Crisis Line', number: '1-800-273-8255', description: 'Press 1 for veterans support' },
        { name: 'Trevor Project (LGBTQ+)', number: '1-866-488-7386', description: 'Crisis support for LGBTQ+ youth' },
        { name: 'National Domestic Violence', number: '1-800-799-7233', description: '24/7 domestic violence support' }
    ],
    onlineResources: [
        { name: '7 Cups', url: 'https://www.7cups.com', description: 'Online therapy and free support' },
        { name: 'BetterHelp', url: 'https://www.betterhelp.com', description: 'Professional online counseling' },
        { name: 'NAMI', url: 'https://www.nami.org', description: 'Mental health education and support' }
    ],
    localSupport: [
        { name: 'Find Local Support Groups', url: 'https://www.psychologytoday.com/groups', description: 'Local support group directory' },
        { name: 'Find a Therapist', url: 'https://www.psychologytoday.com/therapists', description: 'Local therapist directory' }
    ]
};

const EmergencyResources: React.FC<EmergencyResourcesProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-8"
                    onClick={() => onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{
                            scale: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                damping: 25,
                                stiffness: 300
                            }
                        }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 relative"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onClose()}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <div className="text-center mb-6">
                            <Heart className="w-12 h-12 text-red-500 mx-auto mb-2" />
                            <h2 className="text-2xl font-semibold text-gray-800">Emergency Resources</h2>
                            <p className="text-gray-600">Help is available 24/7</p>
                        </div>

                        {/* Emergency Contacts */}
                        <section className="mb-6">
                            <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                                <Phone className="mr-2" /> Emergency Contacts
                            </h3>
                            <div className="space-y-3">
                                {resources.emergency.map(contact => (
                                    <a
                                        key={contact.name}
                                        href={`tel:${contact.number.replace(/\D/g, '')}`}
                                        className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <div className="font-medium text-red-700">{contact.name}</div>
                                        <div className="text-red-600">{contact.number}</div>
                                        <div className="text-sm text-red-600/80">{contact.description}</div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Helplines */}
                        <section className="mb-6">
                            <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                                <MessageCircle className="mr-2" /> Support Helplines
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {resources.helplines.map(helpline => (
                                    <a
                                        key={helpline.name}
                                        href={`tel:${helpline.number.replace(/\D/g, '')}`}
                                        className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <div className="font-medium text-blue-700">{helpline.name}</div>
                                        <div className="text-blue-600">{helpline.number}</div>
                                        <div className="text-sm text-blue-600/80">{helpline.description}</div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Online Resources */}
                        <section>
                            <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                                <Globe className="mr-2" /> Online Resources
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[...resources.onlineResources, ...resources.localSupport].map(resource => (
                                    <a
                                        key={resource.name}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <div className="font-medium text-green-700">{resource.name}</div>
                                        <div className="text-sm text-green-600/80">{resource.description}</div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmergencyResources;