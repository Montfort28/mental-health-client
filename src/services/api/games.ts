import { client } from './client';

export interface GameProgress {
    id: number;
    userId: number;
    gameType: string;
    score: number;
    timeSpent: number;
    completed: boolean;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameProgressCreate {
    gameType: string;
    score: number;
    timeSpent: number;
    completed: boolean;
    metadata?: any;
}

export class GameService {
    async saveProgress(progress: GameProgressCreate): Promise<GameProgress> {
        const response = await client.post<GameProgress>('/api/games/progress', progress);
        return response.data;
    }

    async getProgress(gameType?: string): Promise<GameProgress[]> {
        const response = await client.get<GameProgress[]>('/api/games/progress', {
            params: { gameType }
        });
        return response.data;
    }

    async getStats(): Promise<{
        gamesPlayed: number;
        totalTimeSpent: number;
        averageScore: number;
        completionRate: number;
    }> {
        const response = await client.get('/api/games/stats');
        return response.data;
    }
}
