import { User } from './user';

export interface ForumPost {
    id: number;
    title: string;
    content: string;
    isAnonymous: boolean;
    createdAt: Date;
    categoryId?: number;
    userId: number;
    user?: User;
    comments: ForumComment[];
}

export interface ForumComment {
    id: number;
    content: string;
    isAnonymous: boolean;
    createdAt: Date;
    userId: number;
    postId: number;
    user?: User;
}

export interface CreatePostDto {
    title: string;
    content: string;
    categoryId?: number;
    isAnonymous: boolean;
}

export interface CreateCommentDto {
    content: string;
    isAnonymous: boolean;
}
