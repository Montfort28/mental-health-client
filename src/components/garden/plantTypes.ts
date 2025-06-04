export interface PlantType {
    id: string;
    name: string;
    emoji: string;
    description: string;
    growthRate: number;
    waterNeeds: number;
    associatedMoods: number[];
    associatedActivities: string[];
}

export const plantTypes: Record<string, PlantType> = {
    'peace-lily': {
        id: 'peace-lily',
        name: 'Peace Lily',
        emoji: '🌷',
        description: 'Represents inner peace and mindfulness',
        growthRate: 1.2,
        waterNeeds: 2,
        associatedMoods: [4, 5],
        associatedActivities: ['meditation', 'breathing', 'yoga']
    },
    'joy-flower': {
        id: 'joy-flower',
        name: 'Joy Flower',
        emoji: '🌻',
        description: 'Blooms with happiness and positivity',
        growthRate: 1.5,
        waterNeeds: 3,
        associatedMoods: [5],
        associatedActivities: ['exercise', 'socializing', 'hobbies']
    }, 'healing-herb': {
        id: 'healing-herb',
        name: 'Healing Herb',
        emoji: '🌿',
        description: 'Grows through self-care and recovery',
        growthRate: 1.0,
        waterNeeds: 1,
        associatedMoods: [2, 3],
        associatedActivities: ['selfcare', 'therapy', 'rest']
    },
    'hope-blossom': {
        id: 'hope-blossom',
        name: 'Hope Blossom',
        emoji: '🌸',
        description: 'Symbolizes resilience and growth',
        growthRate: 1.3,
        waterNeeds: 2,
        associatedMoods: [3, 4],
        associatedActivities: ['journaling', 'gratitude', 'creativity']
    },
    'calm-bamboo': {
        id: 'calm-bamboo',
        name: 'Calm Bamboo',
        emoji: '🎋',
        description: 'Strong and flexible, like emotional resilience',
        growthRate: 0.8,
        waterNeeds: 1,
        associatedMoods: [3, 4, 5],
        associatedActivities: ['meditation', 'nature', 'breathing']
    }
};
