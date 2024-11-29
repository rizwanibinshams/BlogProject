const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const passport = require('passport');
const multer = require('multer');
const path = require('path');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash('error_msg', 'Please log in as an admin to view this resource');
    res.redirect('/admin/login');
};

// Admin Login Page
router.get('/login', (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { 
        title: 'Admin Login',
        user: req.user
    });
});

// Admin Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.flash('error_msg', 'An error occurred during login');
            return res.redirect('/admin/login');
        }
        if (!user) {
            req.flash('error_msg', info.message || 'Invalid credentials');
            return res.redirect('/admin/login');
        }
        if (!user.isAdmin) {
            req.flash('error_msg', 'You must be an admin to access this area');
            return res.redirect('/admin/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                req.flash('error_msg', 'An error occurred during login');
                return res.redirect('/admin/login');
            }
            req.flash('success_msg', 'Welcome to admin dashboard');
            res.redirect('/admin/dashboard');
        });
    })(req, res, next);
});

// Admin Routes
router.get('/dashboard', isAdmin, adminController.getDashboard);
router.get('/posts', isAdmin, adminController.getPosts);
router.get('/users', isAdmin, adminController.getUsers);
router.delete('/users/:id', isAdmin, adminController.deleteUser);
router.patch('/posts/:id/status', isAdmin, adminController.updatePostStatus);
router.delete('/posts/:id', isAdmin, adminController.deletePost);

module.exports = router;
