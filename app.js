var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/Users');
var authRouter = require('./routes/auth');
var productsRouter = require('./routes/Products');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);


module.exports = app;
