const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Admin Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments({ isAdmin: false }),
            totalPosts: await Post.countDocuments(),
            totalComments: await Comment.countDocuments(),
            recentPosts: await Post.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('author', 'username')
        };

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading admin dashboard');
        res.redirect('/admin/login');
    }
};

// Manage Posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('admin/posts', {
            title: 'Manage Posts',
            posts,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading posts');
        res.redirect('/admin/dashboard');
    }
};

// Manage Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false })
            .select('-password')
            .sort({ createdAt: -1 });

        res.render('admin/users', {
            title: 'Manage Users',
            users,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading users');
        res.redirect('/admin/dashboard');
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Post.deleteMany({ author: req.params.id });
        await Comment.deleteMany({ author: req.params.id });

        req.flash('success_msg', 'User and all associated content deleted');
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting user');
        res.redirect('/admin/users');
    }
};

// Update Post Status
exports.updatePostStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await Post.findByIdAndUpdate(req.params.id, { status });

        req.flash('success_msg', 'Post status updated');
        res.redirect('/admin/posts');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating post status');
        res.redirect('/admin/posts');
    }
};

// Delete Post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.remove();
        await Comment.deleteMany({ post: req.params.id });

        req.flash('success_msg', 'Post and associated comments deleted');
        res.redirect('/admin/posts');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting post');
        res.redirect('/admin/posts');
    }
};
