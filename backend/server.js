require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

connectDB();

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to BookBee API!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});