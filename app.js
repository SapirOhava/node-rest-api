const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
require('dotenv').config();

const app = express();
const uri = `mongodb+srv://yoelkalovski:${process.env.MONGO_ATLAS_PASS}@cluster0.jrmpo9q.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri);

app.use(morgan('dev'));
// it makes the uploads folder statically (publicly available)
// to see a specific image in this folder get from this url - localhost:3000/uploads/name-of-file
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origins', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // browser always sends an options request
  // first when sending (Post, Put requests) to check if he can make the request (allowed)
  if (req.method === 'OPTIONS') {
    // this header is where i tell the browser what he may send
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
