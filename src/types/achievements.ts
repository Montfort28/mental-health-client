import { MentalHealthMetric } from './mentalHealth';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    criteria: (metrics: MentalHealthMetric[]) => boolean;
}

export interface AchievementProgress {
    achievementId: string;
    progress: number;
    isComplete: boolean;
}

export const achievements: Achievement[] = [
    {
        id: 'streak-3',
        name: 'Growing Strong',
        description: '3-day mood tracking streak',
        icon: '🌱',
        criteria: (metrics) => {
            const streak = calculateStreak(metrics);
            return streak >= 3;
        }
    },
    {
        id: 'streak-7',
        name: 'Steady Growth',
        description: '7-day mood tracking streak',
        icon: '🌿',
        criteria: (metrics) => {
            const streak = calculateStreak(metrics);
            return streak >= 7;
        }
    },
    {
        id: 'streak-30',
        name: 'Flourishing',
        description: '30-day mood tracking streak',
        icon: '🌳',
        criteria: (metrics) => {
            const streak = calculateStreak(metrics);
            return streak >= 30;
        }
    },
    {
        id: 'positive-mood',
        name: 'Ray of Sunshine',
        description: '5 positive mood entries',
        icon: '☀️',
        criteria: (metrics) => {
            const positiveMoods = metrics.filter(m => m.mood >= 7).length;
            return positiveMoods >= 5;
        }
    },
    {
        id: 'self-care',
        name: 'Self Care Master',
        description: 'Track activities for 5 days straight',
        icon: '💝',
        criteria: (metrics) => {
            const daysWithActivities = new Set(
                metrics
                    .filter(m => m.activities && m.activities.length > 0)
                    .map(m => m.createdAt.toISOString().split('T')[0])
            ).size;
            return daysWithActivities >= 5;
        }
    },
    {
        id: 'journaling',
        name: 'Dear Diary',
        description: 'Add notes to 7 mood entries',
        icon: '📔',
        criteria: (metrics) => {
            const daysWithNotes = new Set(
                metrics
                    .filter(m => m.notes && m.notes.length > 0)
                    .map(m => m.createdAt.toISOString().split('T')[0])
            ).size;
            return daysWithNotes >= 7;
        }
    },
    {
        id: 'mindfulness-beginner',
        name: 'Mindfulness Explorer',
        description: 'Complete 3 breathing exercises',
        icon: '🧘‍♂️',
        criteria: (metrics) => {
            const mindfulnessSessions = metrics
                .filter(m => m.activities && m.activities.includes('Meditation'))
                .length;
            return mindfulnessSessions >= 3;
        }
    },
    {
        id: 'emotional-awareness',
        name: 'Emotional Awareness',
        description: 'Track all mood levels from 1-10',
        icon: '🎭',
        criteria: (metrics) => {
            const uniqueMoods = new Set(metrics.map(m => m.mood));
            return uniqueMoods.size >= 10;
        }
    }
];

export function calculateStreak(metrics: MentalHealthMetric[]): number {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedMetrics = [...metrics].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let currentDate = today;
    for (const metric of sortedMetrics) {
        const metricDate = new Date(metric.createdAt);
        metricDate.setHours(0, 0, 0, 0);

        if (currentDate.getTime() - metricDate.getTime() <= 86400000) { // Within 24 hours
            streak++;
            currentDate = new Date(currentDate.getTime() - 86400000); // Move to previous day
        } else {
            break;
        }
    }

    return streak;
}

export function getAchievementProgress(metrics: MentalHealthMetric[]): AchievementProgress[] {
    return achievements.map(achievement => {
        let progress = 0;
        const isComplete = achievement.criteria(metrics);

        // Calculate progress percentage based on achievement type
        switch (achievement.id) {
            case 'streak-3':
            case 'streak-7':
            case 'streak-30': {
                const streak = calculateStreak(metrics);
                const target = parseInt(achievement.id.split('-')[1]);
                progress = Math.min((streak / target) * 100, 100);
                break;
            }
            case 'positive-mood': {
                const positiveMoods = metrics.filter(m => m.mood >= 7).length;
                progress = Math.min((positiveMoods / 5) * 100, 100);
                break;
            }
            case 'self-care': {
                const daysWithActivities = new Set(
                    metrics
                        .filter(m => m.activities && m.activities.length > 0)
                        .map(m => m.createdAt.toISOString().split('T')[0])
                ).size;
                progress = Math.min((daysWithActivities / 5) * 100, 100);
                break;
            }
            case 'journaling': {
                const daysWithNotes = new Set(
                    metrics
                        .filter(m => m.notes && m.notes.length > 0)
                        .map(m => m.createdAt.toISOString().split('T')[0])
                ).size;
                progress = Math.min((daysWithNotes / 7) * 100, 100);
                break;
            }
            case 'mindfulness-beginner': {
                const mindfulnessSessions = metrics
                    .filter(m => m.activities && m.activities.includes('Meditation'))
                    .length;
                progress = Math.min((mindfulnessSessions / 3) * 100, 100);
                break;
            }
            case 'emotional-awareness': {
                const uniqueMoods = new Set(metrics.map(m => m.mood));
                progress = Math.min((uniqueMoods.size / 10) * 100, 100);
                break;
            }
        }

        return {
            achievementId: achievement.id,
            progress,
            isComplete
        };
    });
}
