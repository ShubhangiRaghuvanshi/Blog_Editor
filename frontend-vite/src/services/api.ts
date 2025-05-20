import axios from 'axios';
import type { Blog, BlogFormData, BlogResponse, BlogListResponse } from '../types/blog';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const blogApi = {
    // Get all blogs
    getAllBlogs: async (): Promise<BlogListResponse> => {
        const response = await api.get('/blogs');
        return response.data;
    },

    // Get blog by ID
    getBlogById: async (id: string): Promise<BlogResponse> => {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    },

    // Save draft
    saveDraft: async (data: BlogFormData, id?: string): Promise<BlogResponse> => {
        const response = await api.post('/blogs/save-draft', { ...data, id });
        return response.data;
    },

    // Publish blog
    publishBlog: async (data: BlogFormData, id?: string): Promise<BlogResponse> => {
        const response = await api.post('/blogs/publish', { ...data, id });
        return response.data;
    }
};

export default api; 