const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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
app.use('/api', require('./routes/miscellaneousRoutes'));

app.get('/', (req, res) => {
  res.status(200).send('server says hello');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
