import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationSystemProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface Notification {
    id: string;
    text: string;
    type: 'success' | 'error' | 'info';
}

const getIcon = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
};

const NotificationSystem: React.FC<NotificationSystemProps> = ({ position = 'top-right' }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4'
    };

    const colors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Auto-remove notifications after 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications(prev => {
                const now = Date.now();
                return prev.filter(notif => {
                    const timeElapsed = now - parseInt(notif.id);
                    return timeElapsed < 5000;
                });
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`fixed z-50 ${positionClasses[position]}`}>
            <AnimatePresence>
                {notifications.map(notification => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`relative mb-4 p-4 min-w-[300px] border rounded-lg shadow-lg ${colors[notification.type]}`}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {getIcon[notification.type]}
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-gray-800">
                                    {notification.text}
                                </p>
                            </div>                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="ml-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

// Create a singleton instance for global notifications
let notifyInstance: (message: string, type: 'success' | 'error' | 'info') => void;

export const setNotifyInstance = (callback: typeof notifyInstance) => {
    notifyInstance = callback;
};

export const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (notifyInstance) {
        notifyInstance(message, type);
    }
};

export default NotificationSystem;
