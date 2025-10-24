const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000',
  credentials: true,
};

module.exports = cors(corsOptions);
