import { Blog } from '../models/blog.model.js';
import { broadcastBlogNotification } from '../utils/fcm.service.js';

export const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, author, tags, readTime, featured } = req.body;

        // Simple slug generator from title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const newBlog = await Blog.create({
            title,
            slug,
            content,
            excerpt,
            category,
            author,
            tags,
            readTime,
            featured
        });

        // Broadcast notifications to all users with FCM tokens
        const url = `/blog/${slug}`;
        const notificationResult = await broadcastBlogNotification(title, excerpt, url);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully and notifications triggered',
            blog: newBlog,
            notificationResult
        });

    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.status(200).json({ success: true, blog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
