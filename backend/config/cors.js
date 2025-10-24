const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev port
      process.env.FRONTEND_URL, // Production frontend URL
    ];

    if (allowedOrigins.includes(origin) || origin.includes('netlify.app') || origin.includes('vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

module.exports = cors(corsOptions);
