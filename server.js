const express = require('express');
const mongoose = require('mongoose');
const app = express();

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful still'));

app.get('/', (req, res) => {
  res.status(200).send('server says hello');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the app is running at ${port}...`);
});
