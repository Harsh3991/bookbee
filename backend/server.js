require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
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

const cronJob = require('./config/cron');

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cors);
app.use(express.json());

app.use('/uploads', express.static('public/uploads'));

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

cronJob.start();