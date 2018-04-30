const express = require('express');
require('dotenv').config();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./config/passport');
const cors = require('cors');

const app = express();

const error = require('./services/error.service');
const router = require('./routes');

// Connect to Database
mongoose.connect(process.env.DATABASE, {}, function(err) {
  if (err) {
    console.error('No database connection');
  } else {
    console.log('Connected to database at ' + process.env.DATABASE);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors({
  origin: process.env.APP_URL,
  optionsSuccessStatus: 200
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Routes
app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = error.throw(404, 'Not found');
  next(err);
});

// error handler
app.use(error.errorHandler);

module.exports = app;
