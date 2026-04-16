import express from 'express';
import { createBlog, getAllBlogs, getBlogBySlug } from '../controllers/blog.controller.js';

const router = express.Router();

router.post('/publish', createBlog);
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

export default router;
