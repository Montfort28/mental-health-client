import React, { useState, useEffect } from 'react';
import { ForumPost, CreatePostDto } from '../../types/forum';
import { ForumService } from '../../services/api/forum';

const ForumComponent: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const forumService = new ForumService();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await forumService.getPosts(selectedCategory);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) return;

    try {
      const newPost: CreatePostDto = {
        title,
        content,
        categoryId: selectedCategory,
        isAnonymous
      }; const userId = parseInt(localStorage.getItem('userId') || '0', 10);
      await forumService.createPost(userId, newPost);
      setTitle('');
      setContent('');
      setIsAnonymous(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Community Forum</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category:</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="1">Mental Health</option>
            <option value="2">Support</option>
            <option value="3">General Discussion</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            Post Anonymously
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
            <div className="text-sm text-gray-500">
              Posted by {post.isAnonymous ? 'Anonymous' : post.user?.email} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumComponent;
