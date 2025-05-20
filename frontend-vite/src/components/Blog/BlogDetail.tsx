import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import type { Blog } from '../../types/blog';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch blog');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading blog...</div>;
  }

  if (!blog) {
    return <div className="error">Blog not found</div>;
  }

  return (
    <div className="blog-detail">
      <div className="blog-header">
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
          <span className={`status-badge ${blog.status}`}>
            {blog.status}
          </span>
        </div>
        <div className="blog-tags">
          {blog.tags?.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="blog-actions">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          Back to Blogs
        </button>
        <button 
          className="edit-button"
          onClick={() => navigate(`/edit/${blog._id}`)}
        >
          Edit Blog
        </button>
      </div>
    </div>
  );
};

export default BlogDetail; 