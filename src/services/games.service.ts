import { client } from './api/client';

export interface GameProgress {
    id: number;
    gameType: string;
    score: number;
    timeSpent: number;
    completed: boolean; metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameProgressCreate {
    gameType: string;
    score: number;
    timeSpent: number;
    completed: boolean;
    metadata?: Record<string, unknown>;
}

export class GamesService {
    static async saveProgress(data: GameProgressCreate): Promise<GameProgress> {
        const response = await client.post('/games/progress', data);
        return response.data;
    }

    static async getProgress(gameType?: string): Promise<GameProgress[]> {
        const params = gameType ? { gameType } : {};
        const response = await client.get('/games/progress', { params });
        return response.data;
    }

    static async getStats(): Promise<{
        gamesPlayed: number;
        totalTimeSpent: number;
        averageScore: number;
        completionRate: number;
    }> {
        const response = await client.get('/games/stats');
        return response.data;
    }
}
