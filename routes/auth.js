const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/login');
};

// Login page
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login');
});

// Register page
router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('auth/register');
});

// Register handle
router.post('/register', async (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('auth/register', {
            errors,
            username,
            email
        });
    } else {
        try {
            // Check if user exists
            const userExists = await User.findOne({ $or: [{ email }, { username }] });
            
            if (userExists) {
                errors.push({ msg: 'Email or username is already registered' });
                res.render('auth/register', {
                    errors,
                    username,
                    email
                });
            } else {
                const newUser = new User({
                    username,
                    email,
                    password
                });

                await newUser.save();
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/auth/login');
            }
        } catch (err) {
            console.error(err);
            res.render('auth/register', {
                errors: [{ msg: 'An error occurred during registration' }],
                username,
                email
            });
        }
    }
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});

// Dashboard - Protected route
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('posts');
        res.render('dashboard', {
            user,
            title: 'Dashboard'
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
});

module.exports = {
    router,
    isAuthenticated
};
