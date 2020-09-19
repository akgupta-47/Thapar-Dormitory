const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
require('./config/db');

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.stack);
  //console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The App is running at ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
