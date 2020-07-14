const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
require('./config/db');

dotenv.config();
const app = express();
app.use(express.json());

const routes = require('./routes/postRoutes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/posts', routes);
app.use('/api/image', require('./routes/imageRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/laundry', require('./routes/laundryRoutes'));

app.get('/', (req, res) => {
  res.status(200).send('server says hello');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the app is running at ${port}...`);
});
