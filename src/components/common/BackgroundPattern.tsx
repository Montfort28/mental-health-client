import React from 'react';
import { motion } from 'framer-motion';

const BackgroundPattern: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Floating Circles with Enhanced Colors */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-blue-300/40 via-purple-300/40 to-pink-300/40 blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }} className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-pink-300/40 via-purple-300/40 to-indigo-300/40 blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.15, 0.25, 0.15],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-teal-300/40 via-cyan-300/40 to-blue-300/40 blur-3xl"
            />

            {/* Sacred Geometry Pattern with enhanced design */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-soft-light">
                <svg width="100%" height="100%">                    <pattern
                    id="sacred-geometry"
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M50 10L90 50L50 90L10 50Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M50 20L80 50L50 80L20 50Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="4" fill="currentColor" />
                    <path d="M50 0L100 50L50 100L0 50Z" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2,2" />
                </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#sacred-geometry)" />
                </svg>
            </div>            {/* Light Rays and Ambient Effects */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/5 to-transparent"></div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0.1, 0.15, 0.1],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),_transparent_60%)]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30"></div>
        </div>
    );
};

export default BackgroundPattern;
