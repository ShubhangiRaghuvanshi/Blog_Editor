import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from '../../services/api';
import type { Blog, BlogFormData } from '../../types/blog';
import './BlogEditor.css';

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const autoSave = useCallback(async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    try {
      if (id) {
        await api.put(`/blogs/${id}`, formData);
      } else {
        await api.post('/blogs/save-draft', formData);
      }
      setLastSaved(new Date());
      console.log('Auto-saved at:', new Date().toLocaleTimeString());
    } catch (error: any) {
      console.error('Auto-save failed:', error);
    }
  }, [formData, id]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Debounced auto-save when user stops typing
  useEffect(() => {
    const timeout = setTimeout(autoSave, 5000);
    return () => clearTimeout(timeout);
  }, [autoSave]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      const { data } = response.data;
      setFormData({
        title: data.title,
        content: data.content,
        tags: data.tags || []
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch blog');
      navigate('/');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      title: e.target.value
    });
  };

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      const newTags = [...formData.tags, tag];
      setFormData(prev => ({
        ...prev,
        tags: newTags
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags || []
      };

      if (id) {
        await api.put(`/blogs/${id}`, blogData);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs/save-draft', blogData);
        toast.success('Blog draft saved successfully');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);

    try {
      const blogData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags || [],
        id: id || undefined
      };

      const response = await api.post('/blogs/publish', blogData);
      if (response.data.success) {
        toast.success('Blog published successfully');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Failed to publish blog');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to publish blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <h1>{id ? 'Edit Blog' : 'Create New Blog'}</h1>
        <div className="editor-actions">
          {lastSaved && (
            <span className="last-saved">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            className="publish-button"
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            placeholder="Enter blog title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tags (press Enter)"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your blog content..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor; 