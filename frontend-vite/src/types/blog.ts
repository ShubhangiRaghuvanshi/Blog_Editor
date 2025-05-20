export interface Blog {
    _id: string;
    title: string;
    content: string;
    author: string;
    status: 'draft' | 'published';
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface BlogFormData {
    title: string;
    content: string;
    tags: string[];
}

export interface BlogResponse {
    success: boolean;
    blog: Blog;
    message?: string;
}

export interface BlogListResponse {
    success: boolean;
    blogs: Blog[];
    message?: string;
} 