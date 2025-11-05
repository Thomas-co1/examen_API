const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/Products');
const tagsRouter = require('./routes/tags');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/tags', tagsRouter);


module.exports = app;
