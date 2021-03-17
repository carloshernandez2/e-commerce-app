var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var productRouter = require('./routes/productRouter');
var userRouter = require('./routes/userRouter');
var orderRouter = require('./routes/orderRouter');
var dotenv = require('dotenv');
var cors = require('cors');
var errorhandler = require('errorhandler');

dotenv.config();

var app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'? process.env.LOCALHOST : ["http://localhost:3000", "http://localhost:5000"], // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/postres_de_la_abuela', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// app.use(express.static(path.join(__dirname, 'client/build')))
if (process.env.NODE_ENV === 'production') {
  // only use in development
  app.use(express.static(path.join(__dirname, 'client/build')))
}

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}

module.exports = app;
