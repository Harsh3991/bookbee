require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/database');
const cors = require('./config/cors');
const limiter = require('./middleware/rateLimitMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storyRoutes = require('./routes/storyRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const readingRoutes = require('./routes/readingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');

connectDB();

// Configure Passport
require('./config/passport')(passport);

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cors);
app.use(express.json());

// Add session middleware BEFORE passport initialization
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to BookBee API!');
});

// Export for Vercel serverless
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Only start cron in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const cronJob = require('./config/cron');
  cronJob.start();
}