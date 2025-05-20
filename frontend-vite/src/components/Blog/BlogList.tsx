import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import type { Blog } from '../../types/blog';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const draftBlogs = blogs.filter(blog => blog.status === 'draft');

  const renderBlogCard = (blog: Blog) => (
    <div key={blog._id} className="blog-card">
      <Link to={`/blog/${blog._id}`} className="blog-card-content">
        <h2>{blog.title}</h2>
        <p className="blog-meta">
          By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
        </p>
        <p className="blog-excerpt">
          {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className={`status-badge ${blog.status}`}>
          {blog.status}
        </span>
      </Link>
      <div className="blog-actions">
        <Link to={`/edit/${blog._id}`} className="edit-button">
          Edit
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  return (
    <div className="blog-list">
      <div className="blog-list-header">
        <h1>All Blogs</h1>
        <div className="header-actions">
          <Link to="/new" className="new-blog-button">Create New Blog</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="no-blogs">No blogs found. Create your first blog!</div>
      ) : (
        <>
          <section className="blog-section">
            <h2>Published Blogs</h2>
            {publishedBlogs.length === 0 ? (
              <div className="no-blogs">No published blogs yet.</div>
            ) : (
              <div className="blog-grid">
                {publishedBlogs.map(renderBlogCard)}
              </div>
            )}
          </section>

          <section className="blog-section">
            <h2>Drafts</h2>
            {draftBlogs.length === 0 ? (
              <div className="no-blogs">No draft blogs.</div>
            ) : (
              <div className="blog-grid">
                {draftBlogs.map(renderBlogCard)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default BlogList; 