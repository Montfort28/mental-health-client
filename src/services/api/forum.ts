import { client } from './client';
import { ForumPost, ForumComment, CreatePostDto, CreateCommentDto } from '../../types/forum';

export class ForumService {
    async getPosts(categoryId?: number): Promise<ForumPost[]> {
        const response = await client.get<ForumPost[]>('/api/forum/posts', {
            params: { categoryId }
        });
        return response.data;
    }

    async createPost(userId: number, postData: CreatePostDto): Promise<ForumPost> {
        const response = await client.post<ForumPost>('/api/forum/posts', {
            ...postData,
            userId
        });
        return response.data;
    }

    async addComment(userId: number, postId: number, commentData: CreateCommentDto): Promise<ForumComment> {
        const response = await client.post<ForumComment>(`/api/forum/posts/${postId}/comments`, {
            ...commentData,
            userId
        });
        return response.data;
    }
}
