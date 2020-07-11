const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

const routes = require('./routes/userRoutes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

connectDB();

dotenv.config();

app.use('./posts', routes);
  
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.status(200).send('server says hello');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the app is running at ${port}...`);
});
