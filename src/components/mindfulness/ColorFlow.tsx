import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Point {
    x: number;
    y: number;
    color: string;
    size: number;
}

const colors = [
    'rgb(147, 197, 253)', // blue-300
    'rgb(167, 243, 208)', // green-300
    'rgb(216, 180, 254)', // purple-300
    'rgb(253, 186, 116)', // orange-300
    'rgb(249, 168, 212)', // pink-300
];

const ColorFlow: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [currentColor, setCurrentColor] = useState(colors[0]);
    const [brushSize, setBrushSize] = useState(20);
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Draw points
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            points.forEach((point, index) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
                ctx.fillStyle = point.color;
                ctx.fill();

                // Connect points with lines
                if (index > 0) {
                    ctx.beginPath();
                    ctx.moveTo(points[index - 1].x, points[index - 1].y);
                    ctx.lineTo(point.x, point.y);
                    ctx.strokeStyle = point.color;
                    ctx.lineWidth = point.size;
                    ctx.stroke();
                }
            });
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [points]);

    useEffect(() => {
        if (!isBreathing) return;

        const breathingCycle = async () => {
            // Inhale
            setBreathingPhase('inhale');
            await new Promise(resolve => setTimeout(resolve, 4000));

            // Hold
            setBreathingPhase('hold');
            await new Promise(resolve => setTimeout(resolve, 4000));

            // Exhale
            setBreathingPhase('exhale');
            await new Promise(resolve => setTimeout(resolve, 4000));
        };

        const interval = setInterval(breathingCycle, 12000);
        breathingCycle();

        return () => clearInterval(interval);
    }, [isBreathing]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isPlaying) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints(prev => [
            ...prev,
            {
                x,
                y,
                color: currentColor,
                size: brushSize,
            },
        ]);
    };

    const clearCanvas = () => {
        setPoints([]);
    };

    const startNew = () => {
        clearCanvas();
        setIsPlaying(true);
        setIsBreathing(true);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Color Flow
                </h2>
                <p className="text-gray-600">
                    Create flowing patterns while practicing deep breathing. Let your creativity flow with each breath.
                </p>
            </div>

            {!isPlaying ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startNew}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg text-lg font-medium"
                    >
                        Start Creating
                    </motion.button>
                </motion.div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4">
                            <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft flex items-center gap-2">
                                <span className="text-sm text-gray-700">Color:</span>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <motion.button
                                            key={color}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setCurrentColor(color)}
                                            className={`w-6 h-6 rounded-full ${currentColor === color ? 'ring-2 ring-white ring-offset-2' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft flex items-center gap-2">
                                <span className="text-sm text-gray-700">Size:</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="40"
                                    value={brushSize}
                                    onChange={(e) => setBrushSize(Number(e.target.value))}
                                    className="w-24"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={clearCanvas}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md text-sm font-medium"
                            >
                                Clear
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsBreathing(!isBreathing)}
                                className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium ${isBreathing
                                        ? 'bg-red-500 text-white'
                                        : 'bg-green-500 text-white'
                                    }`}
                            >
                                {isBreathing ? 'Stop Breathing Guide' : 'Start Breathing Guide'}
                            </motion.button>
                        </div>
                    </div>

                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            onPointerMove={handlePointerMove}
                            className="w-full h-[600px] rounded-xl backdrop-blur-lg bg-white/20 shadow-soft border border-white/20"
                        />

                        {isBreathing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute left-1/2 transform -translate-x-1/2 bottom-8 px-6 py-3 backdrop-blur-md bg-white/80 rounded-lg shadow-lg border border-white/20"
                            >
                                <motion.p
                                    key={breathingPhase}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-lg font-medium text-gray-800"
                                >
                                    {breathingPhase === 'inhale' && 'Breathe In...'}
                                    {breathingPhase === 'hold' && 'Hold...'}
                                    {breathingPhase === 'exhale' && 'Breathe Out...'}
                                </motion.p>
                            </motion.div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ColorFlow;
