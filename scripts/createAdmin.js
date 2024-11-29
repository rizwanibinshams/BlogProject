require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const adminUser = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // This will be hashed before saving
    isAdmin: true
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blog-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected');
    
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUser.password, salt);
        
        // Create new admin user
        const newAdmin = new User({
            ...adminUser,
            password: hashedPassword
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
        
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
    
    process.exit(0);
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
