// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userCareerRoutes = require('./routes/userCareer');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const socialProfileRoutes = require('./routes/socialProfiles'); // Add this line

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload limit if needed

// Log environment variables for debugging (remove in production)
console.log('Environment variables loaded:');
console.log('- PORT:', process.env.PORT);
console.log('- MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'NOT SET');
console.log('- JWT Secret:', process.env.JWT_SECRET ? 'Set (hidden for security)' : 'NOT SET');

// Routes
app.use('/api/user-career', userCareerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/social-profiles', socialProfileRoutes); // Add this line

// Basic route
app.get('/', (req, res) => {
  res.send('Kids Stay Away');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Port configuration 
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});