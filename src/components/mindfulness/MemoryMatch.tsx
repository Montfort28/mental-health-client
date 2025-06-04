import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
    id: number;
    emoji: string;
    theme: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const mindfulnessCards = [
    { emoji: '🧘', theme: 'meditation' },
    { emoji: '🌸', theme: 'growth' },
    { emoji: '🌊', theme: 'flow' },
    { emoji: '🦋', theme: 'transformation' },
    { emoji: '☮️', theme: 'peace' },
    { emoji: '🌈', theme: 'hope' },
    { emoji: '🌟', theme: 'energy' },
    { emoji: '🍃', theme: 'nature' },
];

const MemoryMatch: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number>(0);
    const [moves, setMoves] = useState<number>(0);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [messageText, setMessageText] = useState<string>('');

    const initializeGame = () => {
        const duplicatedCards = [...mindfulnessCards, ...mindfulnessCards]
            .map((card, index) => ({
                ...card,
                id: index,
                isFlipped: false,
                isMatched: false,
            }))
            .sort(() => Math.random() - 0.5);

        setCards(duplicatedCards);
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setIsGameStarted(true);
    };

    const handleCardClick = (id: number) => {
        if (
            flippedCards.length === 2 ||
            cards[id].isFlipped ||
            cards[id].isMatched
        ) {
            return;
        }

        const newFlippedCards = [...flippedCards, id];
        setFlippedCards(newFlippedCards);

        const updatedCards = cards.map((card) =>
            card.id === id ? { ...card, isFlipped: true } : card
        );
        setCards(updatedCards);

        if (newFlippedCards.length === 2) {
            setMoves((prev) => prev + 1);
            const [firstCard, secondCard] = newFlippedCards;

            if (cards[firstCard].theme === cards[secondCard].theme) {
                // Match found
                setTimeout(() => {
                    const matchedCards = cards.map((card) =>
                        card.id === firstCard || card.id === secondCard
                            ? { ...card, isMatched: true }
                            : card
                    );
                    setCards(matchedCards);
                    setFlippedCards([]);
                    setMatchedPairs((prev) => prev + 1);

                    // Show mindfulness message
                    setMessageText(getMindfulnessMessage(cards[firstCard].theme));
                    setShowMessage(true);
                    setTimeout(() => setShowMessage(false), 2000);
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = cards.map((card) =>
                        card.id === firstCard || card.id === secondCard
                            ? { ...card, isFlipped: false }
                            : card
                    );
                    setCards(resetCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const getMindfulnessMessage = (theme: string): string => {
        const messages: { [key: string]: string } = {
            meditation: 'Take a deep breath and center yourself',
            growth: 'Every moment is an opportunity to grow',
            flow: 'Let your thoughts flow like water',
            transformation: 'Embrace change with an open heart',
            peace: 'Find peace in the present moment',
            hope: 'Hope lights the path forward',
            energy: 'Feel the positive energy within you',
            nature: 'Connect with the calming power of nature',
        };
        return messages[theme] || 'Stay mindful and present';
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-mindful-600 to-serenity-600 bg-clip-text text-transparent mb-2">
                    Mindful Memory Match
                </h2>
                <p className="text-gray-600">
                    Match pairs while practicing mindfulness. Each pair carries a message of peace and wisdom.
                </p>
            </div>

            {!isGameStarted ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={initializeGame}
                        className="px-8 py-4 bg-gradient-to-r from-mindful-500 to-serenity-500 text-white rounded-xl shadow-lg text-lg font-medium"
                    >
                        Start Game
                    </motion.button>
                </motion.div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4">
                            <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft">
                                <span className="text-serenity-700">Moves: {moves}</span>
                            </div>
                            <div className="backdrop-blur-md bg-white/30 px-4 py-2 rounded-lg shadow-soft">
                                <span className="text-mindful-700">
                                    Pairs: {matchedPairs}/{mindfulnessCards.length}
                                </span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={initializeGame}
                            className="px-4 py-2 bg-gradient-to-r from-serenity-500 to-mindful-500 text-white rounded-lg shadow-md text-sm font-medium"
                        >
                            Restart Game
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleCardClick(card.id)}
                                className="relative aspect-square cursor-pointer"
                            >
                                <motion.div
                                    initial={false}
                                    animate={{
                                        rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-full h-full rounded-xl ${card.isFlipped || card.isMatched
                                            ? 'bg-gradient-to-br from-mindful-100 to-serenity-100'
                                            : 'bg-gradient-to-br from-mindful-500 to-serenity-500'
                                        } shadow-md backdrop-blur-sm flex items-center justify-center transform-gpu preserve-3d`}
                                >
                                    {(card.isFlipped || card.isMatched) && (
                                        <span className="text-4xl transform rotate-180 preserve-3d">
                                            {card.emoji}
                                        </span>
                                    )}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {showMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-white/20"
                            >
                                <p className="text-gray-800">{messageText}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default MemoryMatch;
