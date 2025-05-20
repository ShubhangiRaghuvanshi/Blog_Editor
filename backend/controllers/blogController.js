const Blog = require('../models/Blog');

/**
 * Save or update a blog draft
 * @route POST /api/blogs/save-draft
 */
const saveDraft = async (req, res) => {
    try {
        const { id, title, content, tags } = req.body;

        let blog;
        if (id) {
            // Update existing draft
            blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog draft not found'
                });
            }

            // Only update if it's a draft
            if (blog.status !== 'draft') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot modify a published blog post'
                });
            }

            blog.title = title;
            blog.content = content;
            blog.tags = tags;
            await blog.save();
        } else {
            // Create new draft
            blog = await Blog.create({
                title,
                content,
                tags,
                status: 'draft'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog draft saved successfully',
            data: blog
        });

    } catch (error) {
        console.error('Error saving blog draft:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving blog draft',
            error: error.message
        });
    }
};

const publishBlog = async (req, res) => {
    try {
        const { id, title, content, tags } = req.body;

        let blog;
        if (id) {
            // Publishing an existing draft
            blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog post not found'
                });
            }

            if (blog.status === 'published') {
                return res.status(400).json({
                    success: false,
                    message: 'Blog post is already published'
                });
            }

            blog.title = title || blog.title;
            blog.content = content || blog.content;
            blog.tags = tags || blog.tags;
            blog.status = 'published';
            await blog.save();
        } else {
            // Create and publish new blog post
            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and content are required'
                });
            }

            blog = await Blog.create({
                title,
                content,
                tags,
                status: 'published'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog post published successfully',
            data: blog
        });

    } catch (error) {
        console.error('Error publishing blog post:', error);
        res.status(500).json({
            success: false,
            message: 'Error publishing blog post',
            error: error.message
        });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const { status, tag, search } = req.query;
        
        let query = {};
        
        // Filter by status if provided
        if (status) {
            query.status = status;
        }
        
        // Filter by tag if provided
        if (tag) {
            query.tags = tag;
        }
        
        // Search in title or content if search term provided
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query and sort by creation date (newest first)
        const blogs = await Blog.find(query)
            .sort({ created_at: -1 })
            .select('title content tags status created_at updated_at');

        // Format dates before sending response
        const formattedBlogs = blogs.map(blog => ({
            ...blog.toObject(),
            created_at: blog.created_at.toISOString(),
            updated_at: blog.updated_at.toISOString()
        }));

        res.status(200).json({
            success: true,
            count: blogs.length,
            data: formattedBlogs
        });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

/**
 * Get a single blog by ID
 * @route GET /api/blogs/:id
 */
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .select('title content tags status created_at updated_at');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }

        // Format dates before sending response
        const formattedBlog = {
            ...blog.toObject(),
            created_at: blog.created_at.toISOString(),
            updated_at: blog.updated_at.toISOString()
        };

        res.status(200).json({
            success: true,
            data: formattedBlog
        });

    } catch (error) {
        // Handle invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID format'
            });
        }

        console.error('Error fetching blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
            error: error.message
        });
    }
};

/**
 * Update an existing blog
 * @route PUT /api/blogs/:id
 */
const updateBlog = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const blogId = req.params.id;

        // Find and update the blog
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title: title || undefined,
                content: content || undefined,
                ...(tags && { tags }),
                updated_at: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });

    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog',
            error: error.message
        });
    }
};

module.exports = {
    saveDraft,
    publishBlog,
    getAllBlogs,
    getBlogById,
    updateBlog
}; 