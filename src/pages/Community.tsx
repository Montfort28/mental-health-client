import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  fetchPosts,
  createPost,
  likePost,
  createComment,
  fetchComments,
  likeComment,
  ForumPost,
  Comment,
} from '../store/communitySlice';
import { format } from 'date-fns';
import { CreatePostDto, CreateCommentDto } from '../types/forum';

const Community = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, comments, loading, error, categories } = useSelector(
    (state: RootState) => state.community
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState<CreatePostDto>({
    title: '',
    content: '',
    isAnonymous: false,
    categoryId: undefined,
  });
  const [newComment, setNewComment] = useState<string>(''); const [selectedPost, setSelectedPost] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPosts(selectedCategory));
  }, [dispatch, selectedCategory]);

  const handleCreatePost = async () => {
    if (newPost.title && newPost.content) {
      await dispatch(createPost(newPost));
      setNewPost({
        title: '',
        content: '',
        isAnonymous: false,
        categoryId: undefined,
      });
      setShowNewPostForm(false);
    }
  };

  const handleCreateComment = async (postId: string) => {
    if (newComment) {
      const comment: CreateCommentDto = {
        content: newComment,
        isAnonymous: false,
      };
      await dispatch(
        createComment({
          postId: parseInt(postId, 10),
          comment,
        })
      );
      setNewComment('');
    }
  };

  const toggleComments = (postId: string) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      dispatch(fetchComments(postId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md transition-colors ${selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNewPostForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          New Post
        </button>
      </div>

      {showNewPostForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={newPost.isAnonymous}
                onChange={(e) => setNewPost({ ...newPost, isAnonymous: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                Post anonymously
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewPostForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Posted by {post.isAnonymous ? 'Anonymous' : post.user?.email}{' · '}
                      {format(new Date(post.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {post.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {post.category.name}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-gray-700">{post.content}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => dispatch(likePost(post.id.toString()))}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <svg
                      className="h-5 w-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {post.likes}
                  </button>
                  <button
                    onClick={() => toggleComments(post.id.toString())}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <svg
                      className="h-5 w-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {post.commentsCount || 0}
                  </button>
                </div>
              </div>

              {selectedPost === post.id.toString() && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Comments</h4>
                  <div className="space-y-4">
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-gray-700">{comment.content}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {comment.isAnonymous ? 'Anonymous' : comment.user?.email}
                            {' · '}
                            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                          </p>
                          <button
                            onClick={() =>
                              dispatch(
                                likeComment({
                                  postId: post.id.toString(),
                                  commentId: comment.id.toString(),
                                })
                              )
                            }
                            className="flex items-center text-gray-600 hover:text-blue-600"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            {comment.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => handleCreateComment(post.id.toString())}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;