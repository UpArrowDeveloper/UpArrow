const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes/api');

const connectDB = require('./db');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, OPTIONS, DELETE'
  );
  next();
});

app.use(morgan('dev'));
app.use(helmet());
connectDB();

app.use('/api/v1', routes);

app.listen(port, () => console.log(`API Server Listening on port ${port}`));
