import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../services/api/client';
import { CreatePostDto, CreateCommentDto } from '../types/forum';

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
  categoryId?: number;
  user?: {
    id: number;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
  comments: Comment[];
  commentsCount: number;
  likes: number;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  isAnonymous: boolean;
  createdAt: Date;
  userId?: number;
  user?: {
    id: number;
    email: string;
  };
  likes: number;
}

interface CommunityState {
  posts: ForumPost[];
  comments: Record<string, Comment[]>;
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  posts: [],
  comments: {},
  categories: [
    'General Discussion',
    'Anxiety Support',
    'Depression Support',
    'Mindfulness',
    'Self-Care',
    'Success Stories',
    'Coping Strategies',
  ],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async (category?: string) => {
    const { data } = await client.get<ForumPost[]>('/community/posts', {
      params: { category },
    });
    return data;
  }
);

export const fetchComments = createAsyncThunk(
  'community/fetchComments',
  async (postId: string) => {
    const numericPostId = parseInt(postId, 10);
    const { data } = await client.get<Comment[]>(`/community/posts/${numericPostId}/comments`);
    return { postId: numericPostId, comments: data };
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (post: CreatePostDto) => {
    const { data } = await client.post<ForumPost>('/community/posts', {
      ...post,
      categoryId: post.categoryId ? parseInt(post.categoryId.toString(), 10) : undefined
    });
    return data;
  }
);

export const createComment = createAsyncThunk(
  'community/createComment',
  async ({ postId, comment }: { postId: number; comment: CreateCommentDto }) => {
    const { data } = await client.post<Comment>(`/community/posts/${postId}/comments`, comment);
    return data;
  }
);

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId: string) => {
    const numericPostId = parseInt(postId, 10);
    const { data } = await client.post<ForumPost>(`/community/posts/${numericPostId}/like`);
    return data;
  }
);

export const likeComment = createAsyncThunk(
  'community/likeComment',
  async ({ postId, commentId }: { postId: string; commentId: string }) => {
    const numericCommentId = parseInt(commentId, 10);
    const numericPostId = parseInt(postId, 10);
    const { data } = await client.post<Comment>(`/community/comments/${numericCommentId}/like`);
    return { postId: numericPostId, comment: data };
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const postId = action.payload.postId;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].push(action.payload);

        // Update comment count in the post
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          post.commentsCount += 1;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const comments = state.comments[postId];
        if (comments) {
          const index = comments.findIndex(c => c.id === comment.id);
          if (index !== -1) {
            comments[index] = comment;
          }
        }
      });
  },
});

export default communitySlice.reducer;