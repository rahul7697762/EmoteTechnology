import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  categoryIcon: {
    type: String,
    default: 'BookOpen'
  },
  categoryColor: {
    type: String,
    default: '#6C7EF5'
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  coverGradient: {
    type: String,
    default: 'linear-gradient(135deg, #3B4FD8 0%, #6C7EF5 60%, #8B5CF6 100%)',
  },
  imageUrl: {
    type: String,
  }
}, { timestamps: true });

export const Blog = mongoose.model('Blog', blogSchema);
