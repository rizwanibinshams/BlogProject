const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: 'desc' });
        res.render('posts/index', { posts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// New post form
router.get('/new', (req, res) => {
    res.render('posts/new', { post: new Post() });
});

// Create post
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const newPost = await post.save();
        res.redirect(`/posts/${newPost.id}`);
    } catch (err) {
        res.render('posts/new', {
            post: post,
            error: 'Error creating post'
        });
    }
});

// Show post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments');
        res.render('posts/show', { post });
    } catch (err) {
        res.redirect('/');
    }
});

// Edit post form
router.get('/:id/edit', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('posts/edit', { post });
    } catch (err) {
        res.redirect('/');
    }
});

// Update post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.title = req.body.title;
        post.content = req.body.content;
        post.author = req.body.author;
        await post.save();
        res.redirect(`/posts/${post.id}`);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await Comment.deleteMany({ post: post.id });
        await post.remove();
        res.redirect('/posts');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = new Comment({
            content: req.body.content,
            author: req.body.author,
            post: post.id
        });
        await comment.save();
        post.comments.push(comment);
        await post.save();
        res.redirect(`/posts/${post.id}`);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
